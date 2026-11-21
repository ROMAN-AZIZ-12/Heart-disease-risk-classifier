import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Activity, ArrowUpRight, Menu, X } from 'lucide-react'

export function Brand() {
  return <Link to="/" className="brand" aria-label="HeartWise home">
    <span className="brand-mark"><Activity size={25} strokeWidth={2.3} /></span>
    <span><strong>HeartWise<span className="brand-dot">.</span></strong><small>HEART RISK INSIGHTS</small></span>
  </Link>
}

export function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  return <header className="site-header">
    <div className="page-shell header-inner">
      <Brand />
      <button className="menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav id="navigation" className={open ? 'navigation is-open' : 'navigation'} aria-label="Main navigation" onClick={() => setOpen(false)}>
        <NavLink to="/" end>Overview</NavLink>
        <Link to="/#how-it-works">How it works</Link>
        <Link to="/#about">About HeartWise</Link>
        <Link to="/assessment" className="button primary nav-cta">{pathname === '/assessment' ? 'Assessment' : 'Start assessment'}<ArrowUpRight size={17} /></Link>
      </nav>
    </div>
  </header>
}

export function Footer() {
  return <footer className="site-footer"><div className="page-shell footer-inner">
    <div className="flex items-center gap-2"><Activity size={18} /><strong>HeartWise</strong><span className="footer-divider" />Heart risk insights</div>
    <p>For informational use only. Not a diagnosis or medical advice.</p>
  </div></footer>
}
