"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window { L?: any }
}

type Point = { lat: number; lon: number; label: string };

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

function loadLeaflet(): Promise<any> {
  if (window.L) return Promise.resolve(window.L);
  return new Promise((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>('script[data-rabi-leaflet="true"]');
    if (!document.querySelector('link[data-rabi-leaflet="true"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      link.dataset.rabiLeaflet = "true";
      document.head.appendChild(link);
    }
    if (!script) {
      script = document.createElement("script");
      script.src = LEAFLET_JS;
      script.async = true;
      script.dataset.rabiLeaflet = "true";
      document.body.appendChild(script);
    }
    script.addEventListener("load", () => window.L ? resolve(window.L) : reject(new Error("Map library did not initialize.")), { once: true });
    script.addEventListener("error", () => reject(new Error("The map library could not load. Check your internet connection.")), { once: true });
    if (window.L) resolve(window.L);
  });
}


function describeStep(step: any): string {
  const maneuver = step?.maneuver || {};
  const type = String(maneuver.type || "continue");
  const modifier = String(maneuver.modifier || "").replace(/_/g, " ");
  const road = String(step?.name || "").trim();
  if (type === "depart") return road ? `Start on ${road}` : "Start your journey";
  if (type === "arrive") return "Arrive at your destination";
  if (type === "roundabout" || type === "rotary") return `Enter the roundabout${road ? ` onto ${road}` : ""}`;
  if (type === "turn" || type === "end of road") return `Turn ${modifier || "ahead"}${road ? ` onto ${road}` : ""}`;
  if (type === "merge") return `Merge${modifier ? ` ${modifier}` : ""}${road ? ` onto ${road}` : ""}`;
  if (type === "fork") return `Keep ${modifier || "straight"}${road ? ` onto ${road}` : ""}`;
  if (type === "on ramp" || type === "off ramp") return `${type === "on ramp" ? "Take the ramp" : "Exit the ramp"}${road ? ` onto ${road}` : ""}`;
  return road ? `Continue on ${road}` : "Continue ahead";
}

async function geocode(query: string): Promise<Point | null> {
  const response = await fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=" + encodeURIComponent(query));
  if (!response.ok) throw new Error("Place search is temporarily unavailable.");
  const results = await response.json();
  if (!Array.isArray(results) || !results[0]) return null;
  return { lat: Number(results[0].lat), lon: Number(results[0].lon), label: String(results[0].display_name || query) };
}

export default function LiveMap({ destination, mode = "drive" }: { destination: string; mode?: "drive" | "walk" }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const originRef = useRef<Point | null>(null);
  const destinationMarkerRef = useRef<any>(null);
  const originMarkerRef = useRef<any>(null);
  const routeRef = useRef<any>(null);
  const [mapStatus, setMapStatus] = useState("Loading live map…");
  const [mapReady, setMapReady] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("Use my location");
  const [routeSummary, setRouteSummary] = useState("");
  const [routeSteps, setRouteSteps] = useState<Array<{ instruction: string; distance: number }>>([]);

  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((L) => {
      if (cancelled || !elementRef.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(elementRef.current, { zoomControl: false, scrollWheelZoom: false }).setView([6.335, 5.6037], 13);
      L.control.zoom({ position: "topright" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
      }).addTo(map);
      mapRef.current = map;
      setMapReady(true);
      setMapStatus("Live map ready · Benin City");
    }).catch((error) => { if (!cancelled) setMapStatus(error instanceof Error ? error.message : "Map unavailable."); });
    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function updateDestination() {
      if (!mapReady || !destination.trim() || !mapRef.current || !LRef.current) {
        setRouteSummary("");
        setRouteSteps([]);
        return;
      }
      try {
        setMapStatus("Finding destination…");
        setRouteSummary("");
        const point = await geocode(destination.trim());
        if (cancelled) return;
        if (!point) {
          if (routeRef.current) { routeRef.current.remove(); routeRef.current = null; }
          if (destinationMarkerRef.current) { destinationMarkerRef.current.remove(); destinationMarkerRef.current = null; }
          setMapStatus("No place found. Try adding the city or state.");
          return;
        }
        const L = LRef.current;
        if (destinationMarkerRef.current) destinationMarkerRef.current.remove();
        destinationMarkerRef.current = L.marker([point.lat, point.lon]).addTo(mapRef.current).bindPopup(point.label);
        if (mode === "walk") {
          if (routeRef.current) { routeRef.current.remove(); routeRef.current = null; }
          setRouteSteps([]);
          setRouteSummary("");
          mapRef.current.setView([point.lat, point.lon], 14);
          setMapStatus("Destination found · walking routes are not available from the demo routing service");
          return;
        }
        if (originRef.current) {
          const origin = originRef.current;
          setMapStatus("Calculating road route…");
          const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${point.lon},${point.lat}?overview=full&geometries=geojson&steps=true`);
          if (!response.ok) throw new Error("Road routing is temporarily unavailable.");
          const data = await response.json();
          if (cancelled) return;
          const route = data.code === "Ok" ? data.routes?.[0] : null;
          if (!route || !Array.isArray(route.geometry?.coordinates) || route.geometry.coordinates.length < 2) {
            if (routeRef.current) { routeRef.current.remove(); routeRef.current = null; }
            setMapStatus(data.message || "No driving route found for these points.");
            setRouteSummary("");
            setRouteSteps([]);
            return;
          }
          setRouteSteps((route.legs?.[0]?.steps || []).slice(0, 8).map((step: any) => ({ instruction: describeStep(step), distance: Number(step.distance) || 0 })));
          if (routeRef.current) routeRef.current.remove();
          routeRef.current = L.geoJSON(route.geometry, { style: { color: "#7048e8", weight: 5, opacity: 0.9 } }).addTo(mapRef.current);
          mapRef.current.fitBounds(routeRef.current.getBounds(), { padding: [30, 30] });
          setRouteSummary(`${(route.distance / 1000).toFixed(1)} km · about ${Math.max(1, Math.round(route.duration / 60))} min driving estimate`);
          setMapStatus("Route calculated · verify conditions before travel");
        } else {
          mapRef.current.setView([point.lat, point.lon], 14);
          setRouteSummary("");
          setMapStatus("Destination found · use your location to calculate a route");
        }
      } catch (error) {
        if (!cancelled) setMapStatus(error instanceof Error ? error.message : "Could not load this destination.");
      }
    }
    updateDestination();
    return () => { cancelled = true; };
  }, [destination, mapReady, mode]);

  function useLocation() {
    if (!navigator.geolocation) { setGpsStatus("GPS not supported"); return; }
    setGpsStatus("Finding location…");
    navigator.geolocation.getCurrentPosition(async (position) => {
      const point = { lat: position.coords.latitude, lon: position.coords.longitude, label: "Your location" };
      originRef.current = point;
      const L = LRef.current;
      if (L && mapRef.current) {
        if (originMarkerRef.current) originMarkerRef.current.remove();
        originMarkerRef.current = L.circleMarker([point.lat, point.lon], { radius: 8, color: "#fff", weight: 3, fillColor: "#7048e8", fillOpacity: 1 }).addTo(mapRef.current).bindPopup("Your current location");
        mapRef.current.setView([point.lat, point.lon], 14);
      }
      setGpsStatus("Location ready");
      if (destination.trim() && mode === "walk") {
        setMapStatus("GPS location ready · walking routes are not available from the demo routing service");
        setRouteSteps([]);
        setRouteSummary("");
        return;
      }
      if (destination.trim()) {
        // Re-trigger the destination effect after the origin is saved.
        setMapStatus("Location ready · calculating route…");
        try {
          const target = await geocode(destination.trim());
          if (!target || !L || !mapRef.current) return;
          const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${point.lon},${point.lat};${target.lon},${target.lat}?overview=full&geometries=geojson&steps=true`);
          if (!response.ok) throw new Error("Road routing is temporarily unavailable.");
          const data = await response.json();
          const route = data.code === "Ok" ? data.routes?.[0] : null;
          if (!route || !Array.isArray(route.geometry?.coordinates) || route.geometry.coordinates.length < 2) {
            setMapStatus(data.message || "No driving route found for these points.");
            setRouteSummary("");
            setRouteSteps([]);
            return;
          }
          setRouteSteps((route.legs?.[0]?.steps || []).slice(0, 8).map((step: any) => ({ instruction: describeStep(step), distance: Number(step.distance) || 0 })));
          if (routeRef.current) routeRef.current.remove();
          routeRef.current = L.geoJSON(route.geometry, { style: { color: "#7048e8", weight: 5, opacity: 0.9 } }).addTo(mapRef.current);
          if (destinationMarkerRef.current) destinationMarkerRef.current.remove();
          destinationMarkerRef.current = L.marker([target.lat, target.lon]).addTo(mapRef.current).bindPopup(target.label);
          mapRef.current.fitBounds(routeRef.current.getBounds(), { padding: [30, 30] });
          setRouteSummary(`${(route.distance / 1000).toFixed(1)} km · about ${Math.max(1, Math.round(route.duration / 60))} min driving estimate`);
          setMapStatus("Route calculated · verify conditions before travel");
        } catch { setMapStatus("Could not calculate a route right now. Try again later."); }
      }
    }, (error) => {
      setGpsStatus(error.code === error.PERMISSION_DENIED ? "Location permission needed" : "Could not get location");
      setMapStatus(error.code === error.PERMISSION_DENIED
        ? "Location permission was denied. Enable it in browser settings to calculate a route."
        : "Could not get your GPS position. Check device location settings and try again.");
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 });
  }

  return <div className="live-map-wrap">
    <div ref={elementRef} className="live-map" role="application" aria-label="Interactive OpenStreetMap map" />
    <div className="live-map-tools">
      <div className="live-map-status"><span className="map-live-dot" /><span>{mapStatus}</span>{routeSummary && <strong>{routeSummary}</strong>}</div>
      <button type="button" className="live-map-location" onClick={useLocation}>{gpsStatus}</button>
    </div>
    {routeSteps.length > 0 && <div className="route-instructions" aria-label="Route step preview"><div className="route-instructions-heading">ROUTE STEPS <span>PREVIEW ONLY</span></div>{routeSteps.map((step, index) => <div className="route-instruction" key={index}><span className="route-instruction-number">{index + 1}</span><span>{step.instruction}</span><small>{step.distance >= 1000 ? `${(step.distance / 1000).toFixed(1)} km` : `${Math.round(step.distance)} m`}</small></div>)}</div>}
    <p className="live-map-attribution-note">Map data © OpenStreetMap · Routing by OSRM demo service. Estimates may be incomplete; not turn-by-turn navigation.</p>
  </div>;
}
