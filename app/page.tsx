"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

type IconName = "pin" | "mic" | "arrow" | "car" | "walk" | "clock" | "target" | "chevron" | "spark" | "coffee" | "shopping" | "home" | "briefcase" | "compass" | "heart" | "layers";
function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const paths: Record<IconName, ReactNode> = {
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    mic: <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3m-4 0h8"/></>,
    arrow: <><path d="M5 12h14M13 5l7 7-7 7"/></>,
    car: <><path d="m4 11 2-4.4A2 2 0 0 1 7.8 5.4h8.4A2 2 0 0 1 18 6.6L20 11"/><path d="M3 11h18v6H3zM6 17v2m12-2v2M5.5 14.5h2m9 0h2"/></>,
    walk: <><circle cx="13" cy="4.5" r="2"/><path d="m11 8-2 5 4 2 1 5m-5-7-3 4-3 1m9-8 4 3 3 1"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z"/></>,
    coffee: <><path d="M5 8h12v8a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z"/><path d="M17 10h1a3 3 0 1 1 0 6h-1M8 3v2m4-2v2"/></>,
    shopping: <><path d="M4 8h16l-1 12H5L4 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V10Z"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12h18m-11 0v2h4v-2"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15.8 8.2-2.4 5.2-5.2 2.4 2.4-5.2 5.2-2.4Z"/></>,
    heart: <path d="M20.8 8.8c0 5.5-8.8 11-8.8 11s-8.8-5.5-8.8-11A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z"/>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function BrandMark({ small = false }: { small?: boolean }) {
  return <span className={small ? "brand-mark small" : "brand-mark"} aria-hidden="true"><svg viewBox="0 0 48 48"><defs><linearGradient id="rabiMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff"/><stop offset=".42" stopColor="#d9d1ff"/><stop offset="1" stopColor="#8f72f4"/></linearGradient></defs><path d="M9 30V17c0-4 3-7 7-7h8c6 0 10 4 10 9 0 4-2 7-6 8l8 8h-9l-8-8h-2v8H9Z" fill="url(#rabiMetal)"/><path d="M7 34c8 2 20 2 29-3 3-2 5-5 5-9-1 7-6 13-13 15-7 2-15 2-21 0Z" fill="#fff" opacity=".88"/><path d="M16 17h8c2 0 3 1 3 3s-1 3-3 3h-8Z" fill="#6941d8"/><path d="M5 36c10 5 27 4 37-7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".8"/></svg></span>;
}

const places = [
  { name: "Ring Road", detail: "Benin City", category: "Popular", time: "12 min" },
  { name: "University of Benin", detail: "Ugbowo campus", category: "Education", time: "24 min" },
  { name: "Benin City Airport", detail: "Airport Road", category: "Travel", time: "18 min" },
  { name: "Sapele Road", detail: "Benin City", category: "Shopping", time: "16 min" },
];
const nearby = [
  { name: "Coffee & catch-ups", kind: "Cafés and quick stops", icon: "coffee" as const, tint: "lavender" },
  { name: "Everyday essentials", kind: "Shops around the city", icon: "shopping" as const, tint: "peach" },
  { name: "Places worth a visit", kind: "Discover somewhere new", icon: "compass" as const, tint: "mint" },
];

export default function Home() {
  const [destination, setDestination] = useState("");
  const [focused, setFocused] = useState(false);
  const [mode, setMode] = useState<"drive" | "walk">("drive");
  const [selected, setSelected] = useState("Ring Road");
  const [notice, setNotice] = useState("");
  const [activeTab, setActiveTab] = useState("Explore");
  const [saved, setSaved] = useState<string[]>(["Ring Road"]);
  const [savedLoaded, setSavedLoaded] = useState(false);
  const [locationLabel, setLocationLabel] = useState("Current location");
  const [locationStatus, setLocationStatus] = useState<"demo" | "ready" | "denied" | "unsupported">("demo");
  const [rideType, setRideType] = useState<"standard" | "comfort" | "xl">("standard");
  const [ridePickup, setRidePickup] = useState("Current location");
  const [rideDestination, setRideDestination] = useState("");
  const [rideNotice, setRideNotice] = useState("");
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("rabi:saved-places");
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) setSaved(parsed);
      }
    } catch { /* Storage may be disabled; saved places still work for this session. */ }
    setSavedLoaded(true);
  }, []);
  useEffect(() => {
    if (!savedLoaded) return;
    try { window.localStorage.setItem("rabi:saved-places", JSON.stringify(saved)); }
    catch { /* Keep the in-memory state if storage is unavailable. */ }
  }, [saved, savedLoaded]);
  function requestLocation() {
    if (!("geolocation" in navigator)) {
      setLocationStatus("unsupported");
      setNotice("This browser does not support device location. You can still enter a starting point manually.");
      return;
    }
    setNotice("Requesting device location permission…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocationLabel(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        setLocationStatus("ready");
        setRidePickup(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        setNotice(`Device location received (about ${Math.round(accuracy)} m accuracy). Coordinates stay in this browser; address lookup and routing are not connected.`);
      },
      (error) => {
        setLocationStatus(error.code === error.PERMISSION_DENIED ? "denied" : "demo");
        setNotice(error.code === error.PERMISSION_DENIED ? "Location permission was denied. Enter your starting point manually or enable location in browser settings." : "Could not get your location. Check device location settings and try again, or enter a starting point manually.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  }
  const matches = useMemo(() => places.filter((place) => place.name.toLowerCase().includes(destination.toLowerCase())), [destination]);
  function choosePlace(name: string) { setDestination(name); setSelected(name); setFocused(false); setNotice(""); }
  function exploreRoute() {
    if (!destination.trim()) { setFocused(true); setNotice("Enter a destination to preview your journey."); return; }
    setSelected(destination.trim()); setFocused(false);
    setNotice("Preview only — live maps, GPS and route calculations are not connected yet.");
  }
  function toggleSaved(name: string) { setSaved((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]); }
  function previewRideRequest() {
    if (!rideDestination.trim()) { setRideNotice("Enter where you want to go to preview a ride."); return; }
    setRideNotice("Ride preview only. No driver has been contacted and no booking or payment was created. Driver matching, live fares and payments need a backend connection.");
  }

  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#" aria-label="rabi home"><BrandMark/><span className="brand-name">rabi<span className="brand-dot">.</span></span></a>
      <nav className="desktop-nav" aria-label="Main navigation"><button className={activeTab === "Explore" ? "nav-link selected" : "nav-link"} onClick={() => setActiveTab("Explore")}>Explore</button><button className={activeTab === "Saved" ? "nav-link selected" : "nav-link"} onClick={() => {setActiveTab("Saved"); setNotice("Your saved places are shown below.");}}>Saved places</button><button className={activeTab === "Journeys" ? "nav-link selected" : "nav-link"} onClick={() => {setActiveTab("Journeys"); setNotice("Journey history will be available when accounts are connected.");}}>Journeys</button></nav>
      <div className="topbar-right"><span className="beta-pill"><span/> EARLY PREVIEW</span><button className="avatar" aria-label="Open profile" onClick={() => setNotice("Profile and account features are coming soon.")}>g</button></div>
    </header>

    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line"/> YOUR CITY, YOUR WAY</div>
        <h1>Move with<br/><span>more meaning.</span></h1>
        <p className="hero-subtitle">Find the places, routes and little moments that make every journey yours.</p>
        <div className="search-card">
          <div className="search-row"><div className="route-dots"><span className="origin-dot"/><span className="route-dash"/><span className="destination-dot"/></div>
            <div className="search-fields">
              <div className="field-block"><label htmlFor="from">STARTING POINT</label><button id="from" className="location-value" onClick={requestLocation}><span className="current-dot"/> {locationLabel} <span className="location-status">{locationStatus === "ready" ? "GPS READY" : locationStatus === "denied" ? "DENIED" : locationStatus === "unsupported" ? "UNAVAILABLE" : "GET GPS"}</span></button></div>
              <div className="field-divider"/>
              <div className="field-block destination-field"><label htmlFor="destination">WHERE TO?</label><input id="destination" value={destination} onChange={(event) => {setDestination(event.target.value);setFocused(true);setNotice("");}} onFocus={() => setFocused(true)} placeholder="Search a place or address" autoComplete="off"/><button className="mic-button" aria-label="Voice search coming soon" onClick={() => setNotice("Voice search is planned for a future version.")}><Icon name="mic" size={19}/></button></div>
            </div>
          </div>
          {focused && destination.length > 0 && <div className="suggestions">{matches.length ? matches.map((place) => <button key={place.name} className="suggestion" onClick={() => choosePlace(place.name)}><span className="suggestion-icon"><Icon name="pin" size={17}/></span><span className="suggestion-copy"><strong>{place.name}</strong><small>{place.detail} · {place.category}</small></span><Icon name="chevron" size={16}/></button>) : <p className="no-results">No demo match. Real place search is not connected yet.</p>}</div>}
          <button className="primary-button" onClick={exploreRoute}><span>Preview my journey</span><Icon name="arrow" size={18}/></button>
          {notice && <p className="notice" role="status">{notice}</p>}
        </div>
        <div className="quick-destinations"><span className="quick-label">QUICK DESTINATIONS</span><div className="quick-chips"><button onClick={() => choosePlace("Home")}><span><Icon name="home" size={15}/></span> Home</button><button onClick={() => choosePlace("Work")}><span><Icon name="briefcase" size={15}/></span> Work</button><button onClick={() => {setActiveTab("Saved");setNotice("Your saved places are shown below.");}}><span><Icon name="heart" size={15}/></span> Saved</button></div></div>
      </div>

      <div className="map-panel">
        <div className="map-topline"><div><span className="map-live-dot"/><span>YOUR CITY AT A GLANCE</span></div><button className="map-control" onClick={() => setNotice("Live map controls will be available after map integration.")} aria-label="Map controls"><Icon name="target" size={18}/></button></div>
        <div className="map-art" aria-label="Illustrated map preview, not live navigation">
          <svg className="map-svg" viewBox="0 0 620 610" role="img" aria-label="Decorative city street map with a highlighted route">
            <defs><pattern id="blocks" width="110" height="95" patternUnits="userSpaceOnUse"><rect x="8" y="8" width="35" height="27" rx="5" fill="#ebe7f8"/><rect x="52" y="10" width="48" height="35" rx="5" fill="#f0edf9"/><rect x="10" y="44" width="30" height="40" rx="5" fill="#f1eef9"/><rect x="48" y="53" width="52" height="30" rx="5" fill="#e7e2f6"/></pattern><filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#4b2ba5" floodOpacity=".18"/></filter></defs>
            <rect width="620" height="610" fill="#faf9fe"/><rect width="620" height="610" fill="url(#blocks)"/>
            <path d="M-40 120 C110 160 130 80 250 130 S420 230 670 160" stroke="#dcd6ed" strokeWidth="23" fill="none"/><path d="M-40 120 C110 160 130 80 250 130 S420 230 670 160" stroke="#fff" strokeWidth="16" fill="none"/>
            <path d="M100 -30 C140 100 180 170 145 280 S170 470 230 650" stroke="#dcd6ed" strokeWidth="28" fill="none"/><path d="M100 -30 C140 100 180 170 145 280 S170 470 230 650" stroke="#fff" strokeWidth="20" fill="none"/>
            <path d="M330 -30 C290 90 365 180 330 270 S390 420 360 650" stroke="#dcd6ed" strokeWidth="24" fill="none"/><path d="M330 -30 C290 90 365 180 330 270 S390 420 360 650" stroke="#fff" strokeWidth="16" fill="none"/>
            <path d="M-20 400 C120 350 200 420 310 390 S500 340 650 400" stroke="#dcd6ed" strokeWidth="27" fill="none"/><path d="M-20 400 C120 350 200 420 310 390 S500 340 650 400" stroke="#fff" strokeWidth="19" fill="none"/>
            <path d="M480 -20 C445 80 490 180 455 280 S490 470 530 640" stroke="#dcd6ed" strokeWidth="21" fill="none"/><path d="M480 -20 C445 80 490 180 455 280 S490 470 530 640" stroke="#fff" strokeWidth="14" fill="none"/>
            <path d="M145 280 C190 300 225 330 250 365 S305 410 360 390 S410 320 455 280" stroke="#b5a0ff" strokeWidth="13" fill="none" strokeLinecap="round" opacity=".35"/><path d="M145 280 C190 300 225 330 250 365 S305 410 360 390 S410 320 455 280" stroke="#7447ed" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="145" cy="280" r="12" fill="#fff" stroke="#7447ed" strokeWidth="5"/><circle cx="455" cy="280" r="12" fill="#fff" stroke="#7447ed" strokeWidth="5"/>
            <g filter="url(#shadow)" transform="translate(105 208)"><rect width="120" height="34" rx="12" fill="#fff"/><text x="60" y="22" fontSize="12" fontWeight="700" textAnchor="middle" fill="#282139">You are here</text></g>
            <g filter="url(#shadow)" transform="translate(392 218)"><rect width="115" height="34" rx="12" fill="#fff"/><text x="57.5" y="22" fontSize="12" fontWeight="700" textAnchor="middle" fill="#282139">Destination</text></g>
            <g transform="translate(210 70)"><rect width="160" height="48" rx="15" fill="#fff" stroke="#eee9fa"/><text x="14" y="19" fontSize="10" fontWeight="700" fill="#8a829f" letterSpacing="1">JOURNEY PREVIEW</text><text x="14" y="36" fontSize="15" fontWeight="750" fill="#4f2bc0">Your next move</text></g>
            <text x="35" y="520" fontSize="12" fontWeight="700" fill="#a49ab9" letterSpacing="2">RABI CITY VIEW</text>
            <g transform="translate(500 490)"><circle cx="28" cy="28" r="27" fill="#fff" stroke="#eee9fa"/><path d="M28 13v30M13 28h30" stroke="#a69bbd" strokeWidth="1.5"/><circle cx="28" cy="28" r="8" fill="none" stroke="#7447ed" strokeWidth="2"/></g>
          </svg>
          <div className="map-caption"><span className="caption-mark"><Icon name="pin" size={15}/></span><div><strong>{selected || "Choose a destination"}</strong><small>Illustrative route · Not live data</small></div><span className="caption-arrow"><Icon name="arrow" size={17}/></span></div>
        </div>
        <div className="map-footer"><span><span className="footer-dot"/> Route preview</span><span>BENIN CITY · DEMO</span></div>
      </div>
    </section>

    <section className="route-section" id="journeys">
      <div className="section-heading"><div><span className="eyebrow">THE WAY YOU WANT</span><h2>One trip. Your choice.</h2><p>Pick the travel style that suits your day.</p></div><span className="section-count">01 <span>/</span> 03</span></div>
      <div className="mode-switch" role="group" aria-label="Travel mode"><button className={mode === "drive" ? "mode active" : "mode"} onClick={() => setMode("drive")}><Icon name="car" size={19}/> Drive</button><button className={mode === "walk" ? "mode active" : "mode"} onClick={() => setMode("walk")}><Icon name="walk" size={19}/> Walk</button></div>
      <div className="route-cards">
        <article className="route-card featured"><div className="route-card-top"><span className="route-icon"><Icon name={mode === "drive" ? "car" : "walk"} size={21}/></span><span className="recommended">SUGGESTED</span></div><h3>{mode === "drive" ? "The easy way" : "A simple stroll"}</h3><p>{mode === "drive" ? "A straightforward route to your destination." : "A walk-friendly route, when supported."}</p><div className="route-card-bottom"><span><Icon name="clock" size={16}/> {mode === "drive" ? "12 min" : "26 min"} <small>· sample estimate</small></span><Icon name="arrow" size={18}/></div></article>
        <article className="route-card"><div className="route-card-top"><span className="route-icon pale"><Icon name="layers" size={21}/></span><span className="quiet-label">OPTION 02</span></div><h3>{mode === "drive" ? "The scenic way" : "Take it slow"}</h3><p>Another way to think about your trip.</p><div className="route-card-bottom"><span><Icon name="clock" size={16}/> {mode === "drive" ? "18 min" : "32 min"} <small>· sample only</small></span><Icon name="arrow" size={18}/></div></article>
        <article className="route-card coming-card"><span className="coming-icon"><Icon name="spark" size={22}/></span><h3>More, soon.</h3><p>Traffic-aware routes and helpful local places are on the roadmap.</p><span className="coming-label">IN DEVELOPMENT</span></article>
      </div>
    </section>

    <section className="ride-section" id="ride">
      <div className="section-heading"><div><span className="eyebrow">GET THERE TOGETHER</span><h2>A ride when you need one.</h2><p>Choose a ride type and preview your pickup details. Booking is not live yet.</p></div><span className="ride-badge">RIDE PREVIEW</span></div>
      <div className="ride-layout">
        <div className="ride-options" role="group" aria-label="Choose ride type">
          <button className={rideType === "standard" ? "ride-option selected" : "ride-option"} onClick={() => setRideType("standard")}><span className="ride-option-icon"><Icon name="car" size={22}/></span><span className="ride-option-copy"><strong>Rabi Standard</strong><small>Everyday trips · 4 seats</small></span><span className="ride-fare">₦1,500–₦3,000<small>sample range</small></span></button>
          <button className={rideType === "comfort" ? "ride-option selected" : "ride-option"} onClick={() => setRideType("comfort")}><span className="ride-option-icon comfort"><Icon name="car" size={22}/></span><span className="ride-option-copy"><strong>Rabi Comfort</strong><small>Extra comfort · 4 seats</small></span><span className="ride-fare">₦2,500–₦4,500<small>sample range</small></span></button>
          <button className={rideType === "xl" ? "ride-option selected" : "ride-option"} onClick={() => setRideType("xl")}><span className="ride-option-icon xl"><Icon name="car" size={22}/></span><span className="ride-option-copy"><strong>Rabi XL</strong><small>More room · up to 6 seats</small></span><span className="ride-fare">₦3,000–₦6,000<small>sample range</small></span></button>
          <p className="fare-disclaimer">Illustrative Nigerian-naira ranges only — not live quotes or a promise of availability.</p>
        </div>
        <form className="ride-request-card" onSubmit={(event) => { event.preventDefault(); previewRideRequest(); }}>
          <div className="ride-card-heading"><span className="ride-card-mark"><Icon name="car" size={19}/></span><div><strong>Plan your pickup</strong><small>{rideType === "standard" ? "Rabi Standard" : rideType === "comfort" ? "Rabi Comfort" : "Rabi XL"} selected</small></div></div>
          <label htmlFor="ride-pickup">PICKUP</label><input id="ride-pickup" value={ridePickup} onChange={(event) => setRidePickup(event.target.value)} required placeholder="Enter pickup point"/>
          <label htmlFor="ride-destination">DESTINATION</label><input id="ride-destination" value={rideDestination} onChange={(event) => setRideDestination(event.target.value)} required placeholder="Where are you going?"/>
          <button className="primary-button" type="submit"><span>Preview ride request</span><Icon name="arrow" size={18}/></button>
          {rideNotice && <p className="notice" role="status">{rideNotice}</p>}
          <div className="safety-note"><span>✓</span><p><strong>Safety is part of the plan.</strong> Verified drivers, trip sharing, emergency support and ride tracking must be implemented before real rides launch.</p></div>
        </form>
      </div>
    </section>

    <section className="nearby-section" id="nearby">
      <div className="section-heading"><div><span className="eyebrow">MORE THAN DIRECTIONS</span><h2>Find your kind of place.</h2><p>Discover the city one stop at a time.</p></div><button className="text-action" onClick={() => setNotice("Nearby discovery will be powered by live place data in a future stage.")}>Explore nearby <Icon name="arrow" size={16}/></button></div>
      <div className="nearby-grid">{nearby.map((item) => <button className="nearby-card" key={item.name} onClick={() => setNotice(item.name + " discovery is planned; live business listings are not connected yet.")}><span className={"nearby-art " + item.tint}><Icon name={item.icon} size={25}/></span><span className="nearby-copy"><strong>{item.name}</strong><small>{item.kind}</small></span><span className="nearby-arrow"><Icon name="arrow" size={17}/></span></button>)}</div>
    </section>

    <section className="saved-section" id="saved">
      <div className="section-heading"><div><span className="eyebrow">YOUR PLACES</span><h2>{activeTab === "Saved" ? "Saved for later." : "Keep your favourites close."}</h2><p>Save a place so it's easier to find next time.</p></div></div>
      <div className="saved-list">{places.slice(0,3).map((place) => <div className="saved-item" key={place.name}><span className="saved-pin"><Icon name="pin" size={18}/></span><span className="saved-info"><strong>{place.name}</strong><small>{place.detail} · {place.category}</small></span><button className={saved.includes(place.name) ? "save-button saved" : "save-button"} onClick={() => toggleSaved(place.name)} aria-label={saved.includes(place.name) ? "Remove " + place.name + " from saved places" : "Save " + place.name}><Icon name="heart" size={18}/></button><button className="saved-go" onClick={() => choosePlace(place.name)}>Go <Icon name="chevron" size={15}/></button></div>)}</div>
    </section>

    <footer className="footer"><a className="footer-brand" href="#"><BrandMark small/> rabi<span className="brand-dot">.</span></a><span>Made for the way we move.</span><span className="footer-note">Early product preview · Routes are illustrative</span></footer>
    <nav className="mobile-nav" aria-label="Mobile navigation"><button className={activeTab === "Explore" ? "mobile-nav-item active" : "mobile-nav-item"} onClick={() => {setActiveTab("Explore");window.scrollTo({top:0,behavior:"smooth"});}}><Icon name="compass" size={20}/><span>Explore</span></button><button className={activeTab === "Saved" ? "mobile-nav-item active" : "mobile-nav-item"} onClick={() => {setActiveTab("Saved");document.getElementById("saved")?.scrollIntoView({behavior:"smooth"});}}><Icon name="heart" size={20}/><span>Saved</span></button><button className={activeTab === "Journeys" ? "mobile-nav-item active" : "mobile-nav-item"} onClick={() => {setActiveTab("Journeys");document.getElementById("journeys")?.scrollIntoView({behavior:"smooth"});setNotice("Journey history will be available when accounts are connected.");}}><Icon name="layers" size={20}/><span>Journeys</span></button><button className="mobile-nav-item" onClick={() => setNotice("Profile and account features are coming soon.")}><Icon name="briefcase" size={20}/><span>Profile</span></button></nav>
  </main>;
}
