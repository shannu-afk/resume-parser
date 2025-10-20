import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header */}
      <header className="site-header">
        <div className="nav">
          <Link to="/" className="flex items-center gap-2" aria-label="RESP Home">
            <div className="brand-badge">RESP</div>
            <span style={{fontWeight:700,color:'#0f172a'}}>Resume Matcher</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-3">
            <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Upload</NavLink>
            <NavLink to="/job" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Job</NavLink>
            <NavLink to="/result" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Result</NavLink>
            <a href="mailto:kodalishanmukh03@gmail.com" className="btn-primary" style={{padding:'8px 12px', borderRadius:10, fontWeight:700}}>Contact</a>
          </nav>
        </div>
      </header>

      {/* Routed pages with global corner imagery */}
      <main className="flex-1 relative overflow-x-hidden" style={{ paddingBottom: '96px' }}>
        {/* Top-left illustration */}
        <img
          src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=900&q=60"
          alt="Team collaborating on resume review"
          loading="lazy"
          aria-hidden
          style={{
            position: 'absolute',
            top: '-30px',
            left: '-30px',
            width: 'clamp(180px, 26vw, 420px)',
            opacity: 0.12,
            filter: 'saturate(0.9) blur(0px)',
            transform: 'rotate(-4deg)',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            borderRadius: '18px'
          }}
        />

        {/* Bottom-right illustration */}
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1100&q=60"
          alt="Interview and hiring discussion"
          loading="lazy"
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '-30px',
            right: '-30px',
            width: 'clamp(200px, 30vw, 520px)',
            opacity: 0.12,
            filter: 'saturate(0.9) blur(0px)',
            transform: 'rotate(3deg)',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            borderRadius: '18px'
          }}
        />

        {/* Routed content above the images */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="brand-badge" aria-hidden>RESP</div>
        <span style={{fontWeight:600}}>Mail me if any issue or to work with me:</span>
        <a href="mailto:kodalishanmukh03@gmail.com" style={{fontWeight:800, color:'#1d4ed8', textDecoration:'none'}}>kodalishanmukh03@gmail.com</a>
        <div className="links">
          <a href="#privacy" aria-label="Privacy Policy">Privacy</a>
          <a href="#terms" aria-label="Terms of Use">Terms</a>
          <a href="mailto:kodalishanmukh03@gmail.com" aria-label="Email Contact">Contact</a>
        </div>
      </footer>
    </div>
  )
}
