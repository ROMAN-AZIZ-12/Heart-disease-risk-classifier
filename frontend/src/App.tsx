import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { Header, Footer } from './components/Layout'
import { Landing } from './pages/Landing'
import { Assessment } from './pages/Assessment'

export function App() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    document.title = pathname === '/assessment' ? 'Assessment — HeartWise' : 'HeartWise — Heart risk, made understandable'
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView())
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="*" element={<main id="main" className="page-shell py-24"><h1>Page not found</h1><p className="my-6">Let's get you back to HeartWise.</p><Link className="button primary" to="/">Back to home</Link></main>} />
    </Routes>
    <Footer />
  </>
}
