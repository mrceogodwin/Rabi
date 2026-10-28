"use client";

import { useState } from "react";

type IconName = "pin" | "search" | "mic" | "arrow" | "car" | "walk" | "clock" | "target" | "chevron" | "spark" | "menu";
function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const paths: Record<IconName, React.ReactNode> = {
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
    mic: <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3m-4 0h8"/></>,
    arrow: <><path d="M5 12h14M13 5l7 7-7 7"/></>,
    car: <><path d="m5 11 1.8-4.2A2 2 0 0 1 8.6 5.5h6.8a2 2 0 0 1 1.8 1.3L19 11"/><path d="M3.5 11.5h17v6h-17zM6.5 17.5v2m11-2v2M6 14.5h2m8 0h2"/></>,
    walk: <><circle cx="13" cy="4.5" r="2"/><path d="m11 8-2 5 4 2 1 5m-5-7-3 4-3 1m9-8 4 3 3 1"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

const places = [
  { name: "Ring Road", detail: "Popular destination", time: "12 min" },
  { name: "University of Benin", detail: "Ugbowo campus", time: "24 min" },
  { name: "Benin City Airport", detail: "Airport Road", time: "18 min" },
];

export default function Home() {
  const [destination, setDestination] = useState("");
  const [focused, setFocused] = useState(false);
  const [mode, setMode] = useState<"drive" | "walk">("drive");
  const [selected, setSelected] = useState("Ring Road");
  const [notice, setNotice] = useState("");
  const matches = places.filter((place) => place.name.toLowerCase().includes(destination.toLowerCase()));
  function choosePlace(name: string) {
    setDestination(name);
    setSelected(name);
    setFocused(false);
    setNotice("");
  }
  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="rabi home"><span className="brand-mark"><span>r</span><i /></span><span className="brand-name">rabi<span className="brand-dot">.</span></span></a>
        <div className="topbar-right"><span className="beta-pill"><span /> EARLY PREVIEW</span><button className="avatar" aria-label="Open profile menu" onClick={() => setNotice("Profile and account features are coming soon.")}>g</button></div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> YOUR CITY, YOUR WAY</div>
          <h1>Hi there,<br /><span>where to?</span></h1>
          <p className="hero-subtitle">A better way to find your way around.</p>

          <div className="search-card">
            <div className="search-row">
              <div className="route-dots"><span className="origin-dot" /><span className="route-dash" /><span className="destination-dot" /></div>
              <div className="search-fields">
                <div className="field-block"><label htmlFor="from">YOUR LOCATION</label><button id="from" className="location-value" onClick={() => setNotice("Live location will be available when GPS is connected.")}><span className="current-dot" /> Current location <span className="location-status">Demo</span></button></div>
                <div className="field-divider" />
                <div className="field-block destination-field"><label htmlFor="destination">WHERE ARE YOU GOING?</label><input id="destination" value={destination} onChange={(event) => { setDestination(event.target.value); setFocused(true); setNotice(""); }} onFocus={() => setFocused(true)} placeholder="Enter a destination" autoComplete="off" /><button className="mic-button" aria-label="Voice search (coming soon)" onClick={() => setNotice("Voice search is planned for a future version.")}><Icon name="mic" size={19} /></button></div>
              </div>
            </div>
            {focused && destination.length > 0 && <div className="suggestions">{matches.length ? matches.map((place) => <button key={place.name} className="suggestion" onClick={() => choosePlace(place.name)}><span className="suggestion-icon"><Icon name="pin" size={17} /></span><span className="suggestion-copy"><strong>{place.name}</strong><small>{place.detail}</small></span><Icon name="chevron" size={16} /></button>) : <p className="no-results">No demo suggestions. Live place search is not connected yet.</p>}</div>}
            <button className="primary-button" onClick={() => { if (!destination.trim()) { setFocused(true); setNotice("Enter a destination to preview the route."); return; } setSelected(destination.trim()); setFocused(false); setNotice("This is a visual preview only. Real routing and live traffic are not connected yet."); }}><span>Explore route</span><Icon name="arrow" size={18} /></button>
            {notice && <p className="notice" role="status">{notice}</p>}
          </div>
          <div className="trust-note"><span className="trust-icon"><Icon name="spark" size={15} /></span> Built for the way we move in Nigeria.</div>
        </div>

        <div className="map-panel">
          <div className="map-topline"><div><span className="map-live-dot" /> <span>EXPLORE</span></div><button className="map-control" onClick={() => setNotice("Live map and GPS controls will be enabled after map integration.")} aria-label="Map controls"><Icon name="target" size={18} /></button></div>
          <div className="map-art" aria-label="Illustrated map preview, not live navigation">
            <svg className="map-svg" viewBox="0 0 620 610" role="img" aria-label="Decorative city street map with a highlighted route">
              <defs><pattern id="blocks" width="110" height="95" patternUnits="userSpaceOnUse"><rect x="8" y="8" width="35" height="27" rx="5" fill="#ebe7f8"/><rect x="52" y="10" width="48" height="35" rx="5" fill="#f0edf9"/><rect x="10" y="44" width="30" height="40" rx="5" fill="#f1eef9"/><rect x="48" y="53" width="52" height="30" rx="5" fill="#e7e2f6"/></pattern><filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#4b2ba5" floodOpacity=".18"/></filter></defs>
              <rect width="620" height="610" fill="#faf9fe"/><rect width="620" height="610" fill="url(#blocks)" opacity=".95"/>
              <path d="M-40 120 C110 160 130 80 250 130 S420 230 670 160" stroke="#dcd6ed" strokeWidth="23" fill="none"/><path d="M-40 120 C110 160 130 80 250 130 S420 230 670 160" stroke="#fff" strokeWidth="16" fill="none"/>
              <path d="M100 -30 C140 100 180 170 145 280 S170 470 230 650" stroke="#dcd6ed" strokeWidth="28" fill="none"/><path d="M100 -30 C140 100 180 170 145 280 S170 470 230 650" stroke="#fff" strokeWidth="20" fill="none"/>
              <path d="M330 -30 C290 90 365 180 330 270 S390 420 360 650" stroke="#dcd6ed" strokeWidth="24" fill="none"/><path d="M330 -30 C290 90 365 180 330 270 S390 420 360 650" stroke="#fff" strokeWidth="16" fill="none"/>
              <path d="M-20 400 C120 350 200 420 310 390 S500 340 650 400" stroke="#dcd6ed" strokeWidth="27" fill="none"/><path d="M-20 400 C120 350 200 420 310 390 S500 340 650 400" stroke="#fff" strokeWidth="19" fill="none"/>
              <path d="M480 -20 C445 80 490 180 455 280 S490 470 530 640" stroke="#dcd6ed" strokeWidth="21" fill="none"/><path d="M480 -20 C445 80 490 180 455 280 S490 470 530 640" stroke="#fff" strokeWidth="14" fill="none"/>
              <path d="M145 280 C190 300 225 330 250 365 S305 410 360 390 S410 320 455 280" stroke="#b5a0ff" strokeWidth="13" fill="none" strokeLinecap="round" opacity=".35"/>
              <path d="M145 280 C190 300 225 330 250 365 S305 410 360 390 S410 320 455 280" stroke="#7447ed" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="145" cy="280" r="12" fill="#fff" stroke="#7447ed" strokeWidth="5"/><circle cx="455" cy="280" r="12" fill="#fff" stroke="#7447ed" strokeWidth="5"/>
              <g filter="url(#shadow)" transform="translate(105 208)"><rect width="120" height="34" rx="12" fill="#fff"/><text x="60" y="22" fontSize="12" fontWeight="700" textAnchor="middle" fill="#282139">Your starting point</text></g>
              <g filter="url(#shadow)" transform="translate(392 218)"><rect width="115" height="34" rx="12" fill="#fff"/><text x="57.5" y="22" fontSize="12" fontWeight="700" textAnchor="middle" fill="#282139">Destination</text></g>
              <g transform="translate(210 70)"><rect width="142" height="48" rx="15" fill="#fff" stroke="#eee9fa"/><text x="14" y="19" fontSize="10" fontWeight="700" fill="#8a829f" letterSpacing="1">ROUTE PREVIEW</text><text x="14" y="36" fontSize="15" fontWeight="750" fill="#4f2bc0">~ 12 minutes</text></g>
              <text x="35" y="520" fontSize="12" fontWeight="700" fill="#a49ab9" letterSpacing="2">RABI CITY VIEW</text>
              <g transform="translate(500 490)"><circle cx="28" cy="28" r="27" fill="#fff" stroke="#eee9fa"/><path d="M28 13v30M13 28h30" stroke="#a69bbd" strokeWidth="1.5"/><circle cx="28" cy="28" r="8" fill="none" stroke="#7447ed" strokeWidth="2"/></g>
            </svg>
            <div className="map-caption"><span className="caption-mark"><Icon name="pin" size={15} /></span><div><strong>{selected || "Choose a destination"}</strong><small>Illustrative route · Not live data</small></div><span className="caption-arrow"><Icon name="arrow" size={17} /></span></div>
          </div>
          <div className="map-footer"><span><span className="footer-dot" /> Route preview</span><span>BENIN CITY · DEMO</span></div>
        </div>
      </section>

      <section className="route-section">
        <div className="section-heading"><div><span className="eyebrow">YOUR NEXT MOVE</span><h2>Make the journey yours.</h2></div><span className="section-count">01 <span>/</span> 03</span></div>
        <div className="mode-switch" role="group" aria-label="Travel mode"><button className={mode === "drive" ? "mode active" : "mode"} onClick={() => setMode("drive")}><Icon name="car" size={19} /> Drive</button><button className={mode === "walk" ? "mode active" : "mode"} onClick={() => setMode("walk")}><Icon name="walk" size={19} /> Walk</button></div>
        <div className="route-cards">
          <article className="route-card featured"><div className="route-card-top"><span className="route-icon"><Icon name={mode === "drive" ? "car" : "walk"} size={21} /></span><span className="recommended">SUGGESTED</span></div><h3>{mode === "drive" ? "The easy way" : "A simple stroll"}</h3><p>{mode === "drive" ? "A straightforward route to your destination." : "A walk-friendly route, when supported."}</p><div className="route-card-bottom"><span><Icon name="clock" size={16} /> {mode === "drive" ? "12 min" : "26 min"} <small>· estimate</small></span><Icon name="arrow" size={18} /></div></article>
          <article className="route-card"><div className="route-card-top"><span className="route-icon pale"><Icon name="target" size={21} /></span><span className="quiet-label">OPTION 02</span></div><h3>{mode === "drive" ? "The scenic way" : "Take it slow"}</h3><p>Another way to think about your trip.</p><div className="route-card-bottom"><span><Icon name="clock" size={16} /> {mode === "drive" ? "18 min" : "32 min"} <small>· sample only</small></span><Icon name="arrow" size={18} /></div></article>
          <article className="route-card coming-card"><span className="coming-icon"><Icon name="spark" size={22} /></span><h3>More, soon.</h3><p>Traffic-aware routes and helpful local places are on the roadmap.</p><span className="coming-label">IN DEVELOPMENT</span></article>
        </div>
      </section>

      <footer className="footer"><a className="footer-brand" href="#"><span className="brand-mark small"><span>r</span><i /></span> rabi<span className="brand-dot">.</span></a><span>Made for the way we move.</span><span className="footer-note">Early product preview · Routes are illustrative</span></footer>
    </main>
  );
}
