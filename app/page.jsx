'use client'
import { useState, useEffect, useRef } from 'react'

/* ── DESIGN TOKENS (hardcoded – no CSS vars) ── */
const C = {
  blue:    '#4451f4',
  blue2:   '#6b78ff',
  blue3:   '#eef0fe',
  violet:  '#7c5cfc',
  ink:     '#0f1117',
  ink2:    '#1a1d2e',
  surf:    '#f5f7ff',
  white:   '#ffffff',
  border:  '#e4e6f0',
  muted:   '#6b7280',
  muted2:  '#9ca3af',
}

const css = {
  btn: (hov, ghost) => ({
    padding: ghost ? '11px 22px' : '11px 24px',
    borderRadius: 100,
    fontFamily: "'Sora',sans-serif",
    fontSize: '.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    border: ghost ? `1.5px solid ${C.border}` : 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    transition: 'all .22s',
    background: ghost
      ? (hov ? C.blue3 : 'transparent')
      : (hov ? '#5563ff' : C.blue),
    color: ghost ? (hov ? C.blue : C.muted) : '#fff',
    boxShadow: ghost ? 'none' : (hov ? '0 8px 28px rgba(68,81,244,.45)' : '0 4px 18px rgba(68,81,244,.3)'),
    transform: hov ? 'translateY(-2px)' : 'none',
  }),
}

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Btn({ children, onClick, style = {}, ghost = false }) {
  const [hov, setHov] = useState(false)
  return (
    <button style={{ ...css.btn(hov, ghost), ...style }} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  )
}

/* ── INTERSECTION OBSERVER HOOK ── */
function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
      }
    }, { threshold: 0.1, ...options })

    if (ref.current) observer.observe(ref.current)

    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [])

  return [ref, inView]
}

/* ── ANIMATED TEXT COMPONENT ── */
function AnimatedText({ children, delay = 0, direction = 'left', style = {}, as = 'div' }) {
  const [ref, inView] = useInView()
  const Component = as

  return (
    <Component
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateX(0)' : `translateX(${direction === 'left' ? '-40px' : '40px'})`,
        transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </Component>
  )
}

/* ── GLOBAL STYLES (injected once) ── */
function GlobalStyles() {
  useEffect(() => {
    const id = 'gex-styles'
    if (document.getElementById(id)) return
    const el = document.createElement('style')
    el.id = id
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Outfit:wght@400;500;600&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Outfit', sans-serif; background: ${C.surf}; color: ${C.ink}; }
      input, select { outline: none; }
      @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:none; } }
      @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
      @keyframes blob { 0%,100% { border-radius:60% 40% 70% 30%/50% 60% 40% 70%; } 50% { border-radius:40% 60% 30% 70%/60% 40% 70% 30%; } }
      @keyframes shimmer { 0% { background-position:0% center; } 100% { background-position:200% center; } }
      @keyframes marqueeScroll {
        from { transform: translate3d(0,0,0); }
        to   { transform: translate3d(-33.333%,0,0); }
      }
      @keyframes pulseDot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(.7); } }
    `
    document.head.appendChild(el)
  }, [])
  return null
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect mobile after mount and on resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { label: 'Services', id: 'services' },
    { label: 'How It Works', id: 'how' },
    { label: 'Benefits', id: 'benefits' },
    { label: 'Who We Help', id: 'who' },
    { label: 'Contact', id: 'cta' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '14px 20px' : '16px 48px',
      background: scrolled ? 'rgba(245,247,255,0.94)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
      boxShadow: scrolled ? '0 4px 24px rgba(68,81,244,.07)' : 'none',
      transition: 'all .3s ease',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          background: `linear-gradient(135deg,${C.blue},${C.violet})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(68,81,244,.4)',
        }}>
          <svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: '1.18rem', color: C.ink, letterSpacing: '-0.5px' }}>
          Grow<span style={{ color: C.blue }}>EdgeX</span>
        </span>
      </div>

      {/* Desktop Links */}
      <ul style={{ display: isMobile ? 'none' : 'flex', gap: 28, listStyle: 'none' }}>
        {links.map(l => <li key={l.id}><NavLink label={l.label} onClick={() => scrollTo(l.id)} /></li>)}
      </ul>

      {/* Desktop Right */}
      <div style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 14 }}>
        <a href="tel:+14699292524" style={{ fontSize: '.83rem', fontWeight: 500, color: C.muted, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={C.muted2} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 10.79a19.79 19.79 0 01-3.07-8.67A2 2 0 011.9 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
          </svg>
          +1 469 929 2524
        </a>
        <Btn onClick={() => scrollTo('cta')}>Free Consultation →</Btn>
      </div>
{/* Blur overlay when mobile menu is open */}
{mobileOpen && (
  <div
    onClick={() => setMobileOpen(false)}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.2)',
      backdropFilter: 'blur(4px)',
      zIndex: 998,
      transition: 'all 0.3s ease',
    }}
  />
)}

{/* Mobile Menu */}
{mobileOpen && (
  <div
    style={{
      position: 'fixed',
      top: 70,
      left: 0,
      right: 0,
      background: 'rgba(245,247,255,0.98)',
      backdropFilter: 'blur(20px)',
      padding: '20px',
      boxShadow: '0 8px 24px rgba(68,81,244,.1)',
      animation: 'fadeUp .3s ease both',
      zIndex: 999,
    }}
  >
    {/* existing menu content */}
  </div>
)}
      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: isMobile ? 'flex' : 'none',
          flexDirection: 'column',
          gap: 4,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 8,
        }}
      >
        <div style={{ width: 24, height: 2, background: C.ink, borderRadius: 2, transition: 'all .3s', transform: mobileOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
        <div style={{ width: 24, height: 2, background: C.ink, borderRadius: 2, transition: 'all .3s', opacity: mobileOpen ? 0 : 1 }} />
        <div style={{ width: 24, height: 2, background: C.ink, borderRadius: 2, transition: 'all .3s', transform: mobileOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          top: 70,
          left: 0,
          right: 0,
          background: 'rgba(245,247,255,0.98)',
          backdropFilter: 'blur(20px)',
          padding: '20px',
          boxShadow: '0 8px 24px rgba(68,81,244,.1)',
          animation: 'fadeUp .3s ease both',
        }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {links.map(l => (
              <li key={l.id} onClick={() => { scrollTo(l.id); setMobileOpen(false); }}>
                <span style={{ fontSize: '.95rem', fontWeight: 500, color: C.muted, cursor: 'pointer' }}>{l.label}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
            <a href="tel:+14699292524" style={{ fontSize: '.85rem', fontWeight: 500, color: C.muted, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', marginBottom: 12 }}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={C.muted2} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 10.79a19.79 19.79 0 01-3.07-8.67A2 2 0 011.9 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
              </svg>
              +1 469 929 2524
            </a>
            <Btn onClick={() => { scrollTo('cta'); setMobileOpen(false); }} style={{ width: '100%', justifyContent: 'center' }}>Free Consultation →</Btn>
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ label, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <span onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ fontSize: '.875rem', fontWeight: 500, color: hov ? C.blue : C.muted, cursor: 'pointer', transition: 'color .2s' }}>
      {label}
    </span>
  )
}

/* ── HERO ── */
function Hero() {
  const IMAGE_URL = 'https://cdn.prod.website-files.com/646676446cb9dc8974098e5d/68dfe523cf88621047bfa804_thumbnail.jpeg'
const [isMobile, setIsMobile] = useState(false)
useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768)
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
  return () => window.removeEventListener('resize', checkMobile)
}, [])

useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 20)
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
  const stats = [
    { value: '98%', label: 'Visit Completion' },
    { value: '3x',  label: 'Faster Intake'    },
    { value: '40%', label: 'Less Admin Work'  },
    { value: '50+', label: 'Agencies Served'  },
  ]

  const trust = [
    'HIPAA Compliant',
    'EMR Compatible',
    'No Long-Term Contracts',
    'Dedicated Coordinators',
  ]

  return (
    <section
      id="home"
      style={{
        minHeight: isMobile ? 'auto' : '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: isMobile ? '100px 20px 60px' : '120px 48px 80px',
        position: 'relative',
        overflow: 'hidden',
        background: C.surf,
      }}
    >
      {/* ── grid bg ── */}
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(68,81,244,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(68,81,244,0.045) 1px, transparent 1px)
          `,
          backgroundSize: isMobile ? '40px 40px' : '56px 56px',
        }}
      />

      {/* ── soft blobs ── */}
      <div
        style={{
          position: 'absolute', width: isMobile ? 400 : 700, height: isMobile ? 400 : 700,
          right: isMobile ? -100 : -160, top: isMobile ? -100 : -160, zIndex: 0, pointerEvents: 'none',
          background: 'rgba(68,81,244,0.07)', filter: 'blur(80px)',
          borderRadius: '60% 40% 70% 30% / 50% 60% 40% 70%',
          animation: 'blob 12s ease-in-out infinite',
          willChange: 'border-radius',
        }}
      />
      <div
        style={{
          position: 'absolute', width: isMobile ? 300 : 500, height: isMobile ? 300 : 500,
          left: isMobile ? -60 : -100, bottom: isMobile ? -50 : -80, zIndex: 0, pointerEvents: 'none',
          background: 'rgba(124,92,252,0.06)', filter: 'blur(80px)',
          borderRadius: '40% 60% 30% 70% / 60% 40% 70% 30%',
          animation: 'blob 12s ease-in-out infinite reverse',
          willChange: 'border-radius',
        }}
      />

      {/* ── main grid ── */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 40 : 64,
          alignItems: 'center',
          maxWidth: 1200, margin: '0 auto', width: '100%',
        }}
      >
        {/* ─────────── LEFT ─────────── */}
        <div>
          <AnimatedText delay={0} direction="left">
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: C.blue3, border: `1px solid rgba(68,81,244,.22)`,
                padding: '7px 16px', borderRadius: 100,
                fontFamily: "'Sora',sans-serif", fontSize: isMobile ? '.7rem' : '.75rem',
                fontWeight: 700, color: C.blue, letterSpacing: '.5px',
                textTransform: 'uppercase', marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: C.blue, animation: 'pulseDot 2s infinite',
                }}
              />
              Home Health Scheduling Specialists
            </div>
          </AnimatedText>

          <AnimatedText delay={0.1} direction="left" as="h1">
            <h1
              style={{
                fontSize: isMobile ? '2rem' : 'clamp(2.2rem,4vw,3.5rem)', fontWeight: 800,
                letterSpacing: '-1.5px', lineHeight: 1.07,
                color: C.ink, marginBottom: 22,
                fontFamily: "'Sora',sans-serif",
              }}
            >
              Scheduling That{' '}
              <em
                style={{
                  fontStyle: 'normal',
                  background: `linear-gradient(120deg,${C.blue} 20%,${C.violet} 80%)`,
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 4s linear infinite',
                }}
              >
                Actually Works
              </em>{' '}
              for Your Agency
            </h1>
          </AnimatedText>

          <AnimatedText delay={0.2} direction="left">
            <p
              style={{
                fontSize: isMobile ? '.95rem' : '1.02rem', color: C.muted,
                lineHeight: 1.78, maxWidth: isMobile ? '100%' : 480,
                marginBottom: 14, fontWeight: 400,
              }}
            >
              GrowEdgeX provides dedicated remote scheduling &amp; intake
              coordination built exclusively for home health agencies — reducing
              chaos, missed visits, and admin overload.
            </p>
          </AnimatedText>

          <AnimatedText delay={0.3} direction="left">
            <p
              style={{
                fontSize: isMobile ? '.88rem' : '.92rem', color: C.muted2,
                lineHeight: 1.72, maxWidth: isMobile ? '100%' : 460, marginBottom: 36,
              }}
            >
              Our coordinators integrate directly into your EMR, your team
              channels, and your daily workflows — so you see results from day one
              without adding headcount.
            </p>
          </AnimatedText>

          <AnimatedText delay={0.4} direction="left">
            <div
              style={{
                display: 'flex', alignItems: 'center',
                gap: 14, flexWrap: 'wrap', marginBottom: 40,
              }}
            >
              <Btn
                onClick={() => scrollTo('cta')}
                style={{ padding: isMobile ? '11px 22px' : '13px 28px', fontSize: isMobile ? '.85rem' : '.93rem' }}
              >
                Book Free Consultation →
              </Btn>
              <Btn
                ghost
                onClick={() => scrollTo('services')}
                style={{ padding: isMobile ? '11px 20px' : '13px 24px', fontSize: isMobile ? '.85rem' : '.93rem' }}
              >
                See Our Services
              </Btn>
            </div>
          </AnimatedText>

          <AnimatedText delay={0.5} direction="left">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
              {trust.map(t => (
                <div
                  key={t}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: isMobile ? '5px 12px' : '6px 14px', borderRadius: 100,
                    background: C.white, border: `1px solid ${C.border}`,
                    fontSize: isMobile ? '.7rem' : '.75rem', fontWeight: 600,
                    color: C.muted, fontFamily: "'Sora',sans-serif",
                    boxShadow: '0 2px 8px rgba(68,81,244,.05)',
                  }}
                >
                  <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {t}
                </div>
              ))}
            </div>
          </AnimatedText>

          <AnimatedText delay={0.6} direction="left">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex' }}>
                {['JM', 'SR', 'AK', '+'].map((t, i) => (
                  <div
                    key={i}
                    style={{
                      width: isMobile ? 30 : 34, height: isMobile ? 30 : 34, borderRadius: '50%',
                      background: `linear-gradient(135deg,${C.blue},${C.violet})`,
                      border: `2.5px solid ${C.surf}`,
                      marginLeft: i === 0 ? 0 : -10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Sora',sans-serif", fontSize: isMobile ? 10 : 11,
                      fontWeight: 700, color: '#fff',
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ color: '#f5a623', fontSize: isMobile ? 11 : 13, letterSpacing: 1 }}>★★★★★</div>
                <div style={{ fontSize: isMobile ? '.78rem' : '.82rem', color: C.muted, fontWeight: 500 }}>
                  <strong style={{ color: C.ink }}>50+ agencies</strong> trust GrowEdgeX
                </div>
              </div>
            </div>
          </AnimatedText>
        </div>

        {/* ─────────── RIGHT ─────────── */}
        <AnimatedText delay={0.3} direction="right">
          <div style={{ position: 'relative', animation: isMobile ? 'none' : 'float 6s ease-in-out infinite' }}>
            <div
              style={{
                borderRadius: 24, overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(68,81,244,.18), 0 8px 24px rgba(0,0,0,.08)',
                border: `1px solid ${C.border}`,
                position: 'relative',
              }}
            >
              <img
                src={IMAGE_URL}
                alt="Home health coordination team at work"
                style={{
                  width: '100%', height: isMobile ? 240 : 360,
                  objectFit: 'cover', display: 'block',
                }}
              />

              <div
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(15,17,23,.55) 0%, transparent 55%)',
                }}
              />

              <div
                style={{
                  position: 'absolute', bottom: 18, left: 18,
                  background: 'rgba(255,255,255,.96)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 14, padding: isMobile ? '10px 14px' : '12px 16px',
                  display: 'flex', alignItems: 'center', gap: 10,
                  boxShadow: '0 8px 24px rgba(0,0,0,.12)',
                }}
              >
                <div
                  style={{
                    width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius: 10,
                    background: `linear-gradient(135deg,${C.blue},${C.violet})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  <svg width={isMobile ? 14 : 16} height={isMobile ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: isMobile ? '.74rem' : '.78rem', fontWeight: 700, color: C.ink, fontFamily: "'Sora',sans-serif" }}>Today's Schedule</div>
                  <div style={{ fontSize: isMobile ? '.68rem' : '.72rem', color: C.muted }}>24 visits · 0 conflicts</div>
                </div>
              </div>

              <div
                style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'rgba(255,255,255,.95)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 100, padding: isMobile ? '5px 10px' : '6px 12px',
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: isMobile ? '.68rem' : '.72rem', fontWeight: 700,
                  color: C.ink, fontFamily: "'Sora',sans-serif",
                  boxShadow: '0 4px 12px rgba(0,0,0,.1)',
                }}
              >
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'pulseDot 2s infinite' }} />
                Live Operations
              </div>
            </div>

            <div
              style={{
                display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
                gap: isMobile ? 8 : 12, marginTop: 16,
              }}
            >
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  style={{
                    background: C.white,
                    border: `1px solid ${C.border}`,
                    borderRadius: 14, padding: isMobile ? '12px 10px' : '16px 12px',
                    textAlign: 'center',
                    boxShadow: '0 4px 16px rgba(68,81,244,.06)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Sora',sans-serif",
                      fontSize: isMobile ? '1.3rem' : '1.55rem', fontWeight: 800,
                      color: C.blue, lineHeight: 1,
                    }}
                  >
                    {value}
                  </div>
                  <div style={{ fontSize: isMobile ? '.65rem' : '.68rem', color: C.muted, marginTop: 4, fontWeight: 500 }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {!isMobile && (
              <div
                style={{
                  position: 'absolute', top: 80, left: -64,
                  background: C.white, border: `1px solid ${C.border}`,
                  borderRadius: 16, padding: '16px 20px',
                  boxShadow: '0 16px 48px rgba(68,81,244,.14)',
                  width: 200,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: 9,
                      background: C.blue3,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '.8rem', fontWeight: 700, color: C.ink, fontFamily: "'Sora',sans-serif" }}>Clinicians Online</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#4451f4','#7c5cfc','#22c55e','#f5a623'].map((col, i) => (
                    <div key={i} style={{ width: 24, height: 24, borderRadius: '50%', background: col, border: '2px solid #fff', marginLeft: i === 0 ? 0 : -6 }} />
                  ))}
                  <span style={{ fontSize: '.72rem', color: C.muted, marginLeft: 6, alignSelf: 'center' }}>+18 active</span>
                </div>
              </div>
            )}
          </div>
        </AnimatedText>
      </div>
    </section>
  )
}

/* ── MARQUEE ── */
function Marquee() {
  const items = [
    'SOC Scheduling','Referral Intake','Clinician Coordination','EMR Support',
    'Visit Confirmations','Documentation Tracking','Recertifications','Discharge Coordination',
  ]
  const band = [...items, ...items, ...items]

  return (
    <div
      style={{
        background: C.ink2, padding: '17px 0',
        overflow: 'hidden', position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: `linear-gradient(90deg,${C.ink2} 0%,transparent 8%,transparent 92%,${C.ink2} 100%)`,
      }} />

      <div
        style={{
          display: 'flex',
          width: 'max-content',
          animation: 'marqueeScroll 28s linear infinite',
          willChange: 'transform',
        }}
      >
        {band.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '0 32px', fontSize: '.78rem', fontWeight: 600,
              color: 'rgba(255,255,255,.52)',
              fontFamily: "'Sora',sans-serif",
              textTransform: 'uppercase', whiteSpace: 'nowrap',
              letterSpacing: '.6px',
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.blue2, flexShrink: 0 }} />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── SECTION WRAPPER ── */
function Section({ id, bg, children, py = 100 }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  return (
    <section id={id} style={{ padding: isMobile ? `${py * 0.6}px 20px` : `${py}px 48px`, background: bg || C.surf, position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>{children}</div>
    </section>
  )
}

function SectionTag({ children, light }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  return (
    <AnimatedText delay={0} direction="left">
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        fontFamily: "'Sora',sans-serif", fontSize: isMobile ? '.68rem' : '.72rem', fontWeight: 700,
        color: light ? '#8b93ff' : C.blue, letterSpacing: '1.5px', textTransform: 'uppercase',
        background: light ? 'rgba(68,81,244,.2)' : C.blue3,
        border: `1px solid ${light ? 'rgba(68,81,244,.3)' : 'rgba(68,81,244,.15)'}`,
        padding: '5px 14px', borderRadius: 100, marginBottom: 16,
      }}>{children}</div>
    </AnimatedText>
  )
}

function SectionTitle({ children, light, style = {} }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  return (
    <AnimatedText delay={0.1} direction="left" as="h2">
      <h2 style={{
        fontSize: isMobile ? '1.6rem' : 'clamp(1.9rem,3vw,2.8rem)', fontWeight: 800, letterSpacing: '-1px',
        color: light ? '#fff' : C.ink, lineHeight: 1.12, marginBottom: 14,
        fontFamily: "'Sora',sans-serif", ...style,
      }}>{children}</h2>
    </AnimatedText>
  )
}

/* ── PROBLEMS ── */
const pains = [
  'Missed or delayed patient visits that damage care quality and agency reputation',
  'Constant rescheduling and last-minute cancellations draining coordinator time',
  'Clinician availability conflicts creating gaps in patient coverage areas',
  'Delayed referral processing slowing admissions and creating bottlenecks',
  'Communication gaps between staff, clinicians, and office teams causing errors',
]

function PainItem({ text, delay }) {
  const [hov, setHov] = useState(false)
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  return (
    <AnimatedText delay={delay} direction="right">
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
        display: 'flex', alignItems: 'flex-start', gap: 14, padding: isMobile ? '14px 16px' : '16px 18px',
        borderRadius: 12,
        border: `1px solid ${hov ? 'rgba(68,81,244,.4)' : 'rgba(255,255,255,.08)'}`,
        background: hov ? 'rgba(68,81,244,.1)' : 'rgba(255,255,255,.04)', transition: 'all .25s',
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(68,81,244,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <span style={{ fontSize: isMobile ? '.84rem' : '.88rem', color: 'rgba(255,255,255,.75)', lineHeight: 1.55 }}>{text}</span>
      </div>
    </AnimatedText>
  )
}

function Problems() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  return (
    <Section id="problems" bg={C.ink}>
      <SectionTag light>The Problem</SectionTag>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 60, alignItems: 'start', marginTop: 8 }}>
        <div>
          <SectionTitle light style={{ maxWidth: isMobile ? '100%' : 400 }}>Scheduling chaos is killing your agency's growth</SectionTitle>
          <AnimatedText delay={0.2} direction="left">
            <p style={{ fontSize: isMobile ? '.92rem' : '1rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.75, marginBottom: 32 }}>
              Without proper coordination, home health agencies lose revenue, clinicians, and patients every week.
            </p>
          </AnimatedText>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pains.map((p, i) => <PainItem key={i} text={p} delay={0.1 * i} />)}
          </div>
        </div>

        <AnimatedText delay={0.3} direction="right">
          <div style={{ background: 'linear-gradient(140deg,rgba(68,81,244,.15),rgba(124,92,252,.1))', border: '1px solid rgba(68,81,244,.25)', borderRadius: 22, padding: isMobile ? 32 : 42, position: isMobile ? 'relative' : 'sticky', top: isMobile ? 0 : 100 }}>
            <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 700, color: '#fff', marginBottom: 14, lineHeight: 1.3, fontFamily: "'Sora',sans-serif" }}>
              The operational cost is higher than you think
            </h3>
            <p style={{ fontSize: isMobile ? '.86rem' : '.9rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.75 }}>
              Every missed visit, delayed intake, and scheduling conflict compounds — slowing growth, frustrating clinicians, and reducing patient satisfaction scores.
            </p>
            <div style={{ display: 'flex', gap: isMobile ? 16 : 24, marginTop: 32, flexWrap: 'wrap' }}>
              {[['40%', 'Admin time wasted on rescheduling'], ['3x', 'Revenue lost per missed visit']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontSize: isMobile ? '2rem' : '2.4rem', fontWeight: 800, color: C.blue2, lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: isMobile ? '.7rem' : '.75rem', color: 'rgba(255,255,255,.45)', marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32, padding: isMobile ? 16 : 20, background: 'rgba(68,81,244,.15)', borderRadius: 14, border: '1px solid rgba(68,81,244,.25)' }}>
              <p style={{ fontSize: isMobile ? '.84rem' : '.88rem', color: 'rgba(255,255,255,.82)', lineHeight: 1.65, fontStyle: 'italic' }}>
                "We were losing 8–10 visits a week to scheduling errors before we brought in dedicated coordinators. The impact on revenue was devastating."
              </p>
              <p style={{ fontSize: isMobile ? '.74rem' : '.78rem', color: 'rgba(255,255,255,.4)', marginTop: 10 }}>— Home Health Agency Director, Texas</p>
            </div>
          </div>
        </AnimatedText>
      </div>
    </Section>
  )
}

/* ── SERVICES ── */
const services = [
  {
    icon: (stroke) => <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    title: 'Scheduling & Visit Coordination',
    desc: 'SOCs, evaluations, revisits, recertifications, and discharges scheduled and confirmed — with real-time calendar management and clinician matching.',
    tags: ['SOC', 'Revisits', 'Recerts', 'Discharges'],
  },
  {
    icon: (stroke) => <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>,
    title: 'Intake & Referral Coordination',
    desc: 'Referral intake processing, patient onboarding, start of care scheduling, and insurance/authorization coordination — handled end to end.',
    tags: ['Referrals', 'Onboarding', 'Auth'],
  },
  {
    icon: (stroke) => <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
    title: 'Agency & Clinician Coordination',
    desc: 'Coordination with DONs, case managers, and field staff. Escalation handling, schedule updates, and proactive daily operational communication.',
    tags: ['DON', 'Case Mgmt', 'Staffing'],
  },
  {
    icon: (stroke) => <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    title: 'Documentation & Tracking Support',
    desc: 'Monitoring overdue notes, pending documentation, SOC/reassessment tracking, cancellation logs, and EMR update support for full compliance visibility.',
    tags: ['EMR', 'Compliance', 'Tracking'],
  },
  {
    icon: (stroke) => <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
    title: 'Patient Communication Support',
    desc: 'Appointment confirmations, schedule reminders, change notifications, and patient communication support that reduces no-shows and builds trust.',
    tags: ['Reminders', 'Notifications', 'Follow-ups'],
  },
]

function ServiceCard({ icon, title, desc, tags, delay }) {
  const [hov, setHov] = useState(false)
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  return (
    <AnimatedText delay={delay} direction={delay % 2 === 0 ? 'left' : 'right'}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
        background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: isMobile ? 24 : 30,
        boxShadow: hov ? '0 20px 50px rgba(68,81,244,.13)' : '0 4px 20px rgba(68,81,244,.06)',
        transition: 'all .3s', position: 'relative', overflow: 'hidden',
        transform: hov ? 'translateY(-5px)' : 'none',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${C.blue},${C.violet})`, transform: `scaleX(${hov ? 1 : 0})`, transformOrigin: 'left', transition: 'transform .3s' }} />
        <div style={{ width: isMobile ? 44 : 48, height: isMobile ? 44 : 48, borderRadius: 14, background: hov ? C.blue : C.blue3, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, transition: 'background .3s' }}>
          {icon(hov ? '#fff' : C.blue)}
        </div>
        <h3 style={{ fontSize: isMobile ? '.94rem' : '1rem', fontWeight: 700, marginBottom: 10, color: C.ink, fontFamily: "'Sora',sans-serif" }}>{title}</h3>
        <p style={{ fontSize: isMobile ? '.82rem' : '.86rem', color: C.muted, lineHeight: 1.7 }}>{desc}</p>
        <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {tags.map(t => <span key={t} style={{ fontSize: '.72rem', fontWeight: 600, padding: '4px 10px', borderRadius: 100, background: C.blue3, color: C.blue, fontFamily: "'Sora',sans-serif" }}>{t}</span>)}
        </div>
      </div>
    </AnimatedText>
  )
}

function Services() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  return (
    <Section id="services" bg={C.surf}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 30 : 60, alignItems: 'end', marginBottom: 56 }}>
        <div>
          <SectionTag>Our Services</SectionTag>
          <SectionTitle>Everything your agency needs to run smoothly</SectionTitle>
        </div>
        <AnimatedText delay={0.2} direction="right">
          <p style={{ fontSize: isMobile ? '.92rem' : '1rem', color: C.muted, lineHeight: 1.75 }}>Our remote professionals integrate directly into your workflow — handling coordination so your clinical team stays focused on patients.</p>
        </AnimatedText>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 22 }}>
        {services.map((s, i) => <ServiceCard key={i} {...s} delay={0.1 * i} />)}
        <AnimatedText delay={0.5} direction="right">
          <div style={{ background: `linear-gradient(135deg,${C.blue},${C.violet})`, borderRadius: 18, padding: isMobile ? 24 : 30, boxShadow: '0 8px 30px rgba(68,81,244,.35)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: isMobile ? 44 : 48, height: isMobile ? 44 : 48, borderRadius: 14, background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </div>
            <h3 style={{ fontSize: isMobile ? '.94rem' : '1rem', fontWeight: 700, marginBottom: 10, color: '#fff', fontFamily: "'Sora',sans-serif" }}>Full Operational Support</h3>
            <p style={{ fontSize: isMobile ? '.82rem' : '.86rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.7 }}>All five service areas combined into one dedicated coordination package — your complete back-office operations handled remotely.</p>
            <div style={{ marginTop: 16 }}>
              <span style={{ fontSize: '.72rem', fontWeight: 600, padding: '4px 10px', borderRadius: 100, background: 'rgba(255,255,255,.2)', color: '#fff', fontFamily: "'Sora',sans-serif" }}>All Inclusive</span>
            </div>
          </div>
        </AnimatedText>
      </div>
    </Section>
  )
}

/* ── HOW IT WORKS ── */
const steps = [
  { n: '01', title: 'Free Consultation', desc: 'We assess your current scheduling challenges, workflow gaps, and operational needs during a complimentary discovery call.' },
  { n: '02', title: 'Custom Setup', desc: 'We configure our coordination workflows to match your EMR, communication tools, and agency-specific processes.', active: true },
  { n: '03', title: 'Team Integration', desc: 'Your dedicated coordinator joins your team channels, learns your clinicians, and begins managing schedules immediately.' },
  { n: '04', title: 'Scale With You', desc: 'As your patient volume grows, we scale support capacity without the cost and time of in-house hiring.' },
]

function HowItWorks() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  return (
    <Section id="how" bg={C.white}>
      <div style={{ textAlign: 'center', maxWidth: isMobile ? '100%' : 600, margin: '0 auto 60px' }}>
        <SectionTag>How It Works</SectionTag>
        <SectionTitle>Up and running in days, not months</SectionTitle>
        <AnimatedText delay={0.2} direction="left">
          <p style={{ fontSize: isMobile ? '.92rem' : '1rem', color: C.muted, lineHeight: 1.75 }}>No complicated onboarding. We learn your workflows and integrate directly into your existing systems.</p>
        </AnimatedText>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: isMobile ? 32 : 0, position: 'relative' }}>
        {!isMobile && <div style={{ position: 'absolute', top: 35, left: '12.5%', right: '12.5%', height: 1.5, background: `repeating-linear-gradient(90deg,${C.blue} 0,${C.blue} 8px,transparent 8px,transparent 16px)`, zIndex: 0 }} />}
        {steps.map((s, i) => (
          <AnimatedText key={i} delay={0.1 * i} direction={i % 2 === 0 ? 'left' : 'right'}>
            <div style={{ textAlign: 'center', padding: isMobile ? 0 : '0 20px', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: isMobile ? 64 : 72, height: isMobile ? 64 : 72, borderRadius: '50%',
                background: s.active ? C.blue : C.white,
                border: `2px solid ${s.active ? C.blue : C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 22px',
                fontFamily: "'Sora',sans-serif", fontSize: isMobile ? '1.2rem' : '1.3rem', fontWeight: 800,
                color: s.active ? '#fff' : C.blue,
                boxShadow: s.active ? '0 8px 28px rgba(68,81,244,.4)' : '0 4px 20px rgba(68,81,244,.1)',
              }}>{s.n}</div>
              <h4 style={{ fontSize: isMobile ? '.92rem' : '.97rem', fontWeight: 700, marginBottom: 8, color: C.ink, fontFamily: "'Sora',sans-serif" }}>{s.title}</h4>
              <p style={{ fontSize: isMobile ? '.8rem' : '.84rem', color: C.muted, lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          </AnimatedText>
        ))}
      </div>
    </Section>
  )
}

/* ── BENEFITS ── */
const benefits = [
  { title: 'Reduce Administrative Workload', desc: 'Offload scheduling, intake, and coordination to dedicated professionals — freeing your team for clinical work.', icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /> },
  { title: 'Improve Visit Completion Rates', desc: 'Fewer gaps, fewer missed visits, and better schedule adherence across your entire patient census.', icon: <><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></> },
  { title: 'Faster Referral Turnaround', desc: 'Cut intake processing time with dedicated referral coordinators who track and follow up every lead.', icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> },
  { title: 'Better Clinician Utilization', desc: 'Match clinicians to patients intelligently based on availability, location, and specialty.', icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></> },
  { title: 'Scalable Without Extra Hiring', desc: 'Grow your patient volume without the cost and delay of recruiting and training in-house coordination staff.', icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></> },
  { title: 'Dedicated Remote Professionals', desc: 'Not a call center — your own named coordinators who know your agency, your clinicians, and your patients.', icon: <><rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></> },
]

// BenefitCard component (extracted to satisfy Rules of Hooks)
function BenefitCard({ benefit, index, isMobile }) {
  const [hov, setHov] = useState(false)

  return (
    <AnimatedText delay={0.1 * index} direction={index % 2 === 0 ? 'left' : 'right'}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
          background: C.white,
          border: `1px solid ${hov ? 'rgba(68,81,244,.3)' : C.border}`,
          borderRadius: 12,
          padding: isMobile ? 20 : 24,
          boxShadow: hov ? '0 12px 36px rgba(68,81,244,.1)' : '0 4px 16px rgba(68,81,244,.05)',
          transform: hov ? 'translateY(-3px)' : 'none',
          transition: 'all .25s',
        }}
      >
        <div
          style={{
            width: isMobile ? 38 : 42,
            height: isMobile ? 38 : 42,
            borderRadius: 12,
            background: `linear-gradient(135deg,${C.blue},${C.violet})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(68,81,244,.3)',
          }}
        >
          <svg
            width={isMobile ? 16 : 18}
            height={isMobile ? 16 : 18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {benefit.icon}
          </svg>
        </div>
        <div>
          <h4
            style={{
              fontSize: isMobile ? '.88rem' : '.92rem',
              fontWeight: 700,
              color: C.ink,
              marginBottom: 5,
              fontFamily: "'Sora',sans-serif",
            }}
          >
            {benefit.title}
          </h4>
          <p
            style={{
              fontSize: isMobile ? '.78rem' : '.82rem',
              color: C.muted,
              lineHeight: 1.6,
            }}
          >
            {benefit.desc}
          </p>
        </div>
      </div>
    </AnimatedText>
  )
}

// Corrected Benefits component
function Benefits() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <Section id="benefits" bg={C.surf}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 30 : 60,
          alignItems: 'center',
          marginBottom: 56,
        }}
      >
        <div>
          <SectionTag>Why GrowEdgeX</SectionTag>
          <SectionTitle>Built for home health. Proven in the field.</SectionTitle>
        </div>
        <AnimatedText delay={0.2} direction="right">
          <p
            style={{
              fontSize: isMobile ? '.92rem' : '1rem',
              color: C.muted,
              lineHeight: 1.75,
            }}
          >
            Our coordinators are trained specifically on home health operations —
            not generic admin work. That specialization makes all the difference.
          </p>
        </AnimatedText>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 20,
        }}
      >
        {benefits.map((b, i) => (
          <BenefitCard key={i} benefit={b} index={i} isMobile={isMobile} />
        ))}
      </div>
    </Section>
  )
}

/* ── WHO WE SERVE ── */
const audience = [
  { title: 'Home Health Agencies', desc: 'Small to mid-size agencies needing reliable scheduling support', icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /> },
  { title: 'Skilled Nursing Teams', desc: 'Coordination support for complex skilled nursing scheduling', icon: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /> },
  { title: 'Therapy Staffing', desc: 'PT, OT, and ST scheduling coordination and optimization', icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></> },
  { title: 'Multi-Location Operations', desc: 'Centralized coordination across multiple agency locations', icon: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></> },
]



// Custom hook for responsive breakpoints
function useMediaQuery() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width <= 768)
      setIsTablet(width > 768 && width <= 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return { isMobile, isTablet }
}

// Audience card component – extracted to use useState at top level
function AudienceCard({ audience, index, isMobile, isTablet }) {
  const [hov, setHov] = useState(false)

  const getGap = () => {
    if (isMobile) return 12
    return 16
  }

  const getPadding = () => {
    if (isMobile) return '14px 16px'
    if (isTablet) return '18px 20px'
    return '20px 22px'
  }

  const getIconSize = () => {
    if (isMobile) return 38
    if (isTablet) return 42
    return 44
  }

  const getIconSvgSize = () => {
    if (isMobile) return 17
    if (isTablet) return 19
    return 20
  }

  const getTitleFontSize = () => {
    if (isMobile) return '.86rem'
    if (isTablet) return '.9rem'
    return '.93rem'
  }

  const getDescFontSize = () => {
    if (isMobile) return '.74rem'
    if (isTablet) return '.78rem'
    return '.8rem'
  }

  return (
    <AnimatedText delay={0.1 * index} direction="left">
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: getGap(),
          border: `1px solid ${hov ? C.blue : C.border}`,
          borderRadius: 12,
          padding: getPadding(),
          background: hov ? C.blue3 : C.surf,
          transform: hov ? 'translateX(4px)' : 'none',
          transition: 'all .25s',
        }}
      >
        <div
          style={{
            width: getIconSize(),
            height: getIconSize(),
            borderRadius: 12,
            background: hov ? C.blue : C.blue3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background .25s',
          }}
        >
          <svg
            width={getIconSvgSize()}
            height={getIconSvgSize()}
            viewBox="0 0 24 24"
            fill="none"
            stroke={hov ? '#fff' : C.blue}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'stroke .25s' }}
          >
            {audience.icon}
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              fontSize: getTitleFontSize(),
              fontWeight: 700,
              color: C.ink,
              marginBottom: 3,
              fontFamily: "'Sora',sans-serif",
            }}
          >
            {audience.title}
          </h4>
          <p
            style={{
              fontSize: getDescFontSize(),
              color: C.muted,
              lineHeight: 1.5,
            }}
          >
            {audience.desc}
          </p>
        </div>
      </div>
    </AnimatedText>
  )
}

// Corrected WhoWeServe component
function WhoWeServe() {
  const { isMobile, isTablet } = useMediaQuery()

  const getGridGap = () => {
    if (isMobile) return 32
    if (isTablet) return 56
    return 80
  }

  const getAudienceGridGap = () => {
    if (isMobile) return 12
    return 16
  }

  const getAudienceMarginTop = () => {
    if (isMobile) return 24
    if (isTablet) return 30
    return 36
  }

  const getRightSectionPaddingTop = () => {
    if (isMobile) return 0
    if (isTablet) return 10
    return 20
  }

  const getRightSectionPaddingLeft = () => {
    if (isMobile) return 0
    if (isTablet) return 28
    return 40
  }

  const getTagFontSize = () => {
    if (isMobile) return '.72rem'
    if (isTablet) return '.78rem'
    return '.85rem'
  }

  const getTitleFontSize = () => {
    if (isMobile) return '1.3rem'
    if (isTablet) return '1.55rem'
    return '1.8rem'
  }

  const getTextFontSize = () => {
    if (isMobile) return '.86rem'
    if (isTablet) return '.92rem'
    return '.95rem'
  }

  const getChecklistFontSize = () => {
    if (isMobile) return '.82rem'
    if (isTablet) return '.86rem'
    return '.88rem'
  }

  const getChecklistMarginBottom = () => {
    if (isMobile) return 10
    return 12
  }

  const getBtnPadding = () => {
    if (isMobile) return '10px 20px'
    if (isTablet) return '12px 24px'
    return '13px 28px'
  }

  const getBtnFontSize = () => {
    if (isMobile) return '.84rem'
    if (isTablet) return '.88rem'
    return '.93rem'
  }

  return (
    <Section id="who" bg={C.white}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: getGridGap(),
          alignItems: 'start',
        }}
      >
        {/* Left column – Who We Help list */}
        <div>
          <SectionTag>Who We Help</SectionTag>
          <SectionTitle>Purpose-built for home health operations</SectionTitle>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: getAudienceGridGap(),
              marginTop: getAudienceMarginTop(),
            }}
          >
            {audience.map((a, i) => (
              <AudienceCard
                key={i}
                audience={a}
                index={i}
                isMobile={isMobile}
                isTablet={isTablet}
              />
            ))}
          </div>
        </div>

        {/* Right column – The GrowEdgeX Difference */}
        <AnimatedText delay={0.3} direction="right">
          <div
            style={{
              paddingTop: getRightSectionPaddingTop(),
              paddingLeft: getRightSectionPaddingLeft(),
              borderLeft: isMobile ? 'none' : `3px solid ${C.blue3}`,
            }}
          >
            <p
              style={{
                fontSize: getTagFontSize(),
                fontWeight: 700,
                color: C.blue,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontFamily: "'Sora',sans-serif",
                marginBottom: 8,
              }}
            >
              The GrowEdgeX Difference
            </p>
            <h3
              style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: getTitleFontSize(),
                fontWeight: 800,
                color: C.ink,
                letterSpacing: '-.5px',
                lineHeight: 1.2,
                marginBottom: isMobile ? 16 : 20,
              }}
            >
              We work as an extension of your team — not a vendor
            </h3>
            <p
              style={{
                fontSize: getTextFontSize(),
                color: C.muted,
                lineHeight: 1.75,
                marginBottom: 16,
              }}
            >
              Our coordinators are embedded in your daily operations. They know
              your clinicians by name, understand your service territories, and
              proactively communicate rather than waiting to be told.
            </p>
            <p
              style={{
                fontSize: getTextFontSize(),
                color: C.muted,
                lineHeight: 1.75,
                marginBottom: isMobile ? 24 : 32,
              }}
            >
              This isn't generic outsourcing — it's home health expertise
              applied to your specific agency needs.
            </p>

            {[
              'No long-term contracts required',
              'Home health trained coordinators',
              'Works with your existing EMR systems',
              'Scales with your patient volume',
            ].map((t, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontSize: getChecklistFontSize(),
                  color: C.muted,
                  marginBottom: getChecklistMarginBottom(),
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: C.blue3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width={12}
                    height={12}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={C.blue}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                {t}
              </div>
            ))}

            <div style={{ marginTop: isMobile ? 24 : 32 }}>
              <Btn
                onClick={() => scrollTo('cta')}
                style={{
                  padding: getBtnPadding(),
                  fontSize: getBtnFontSize(),
                  width: isMobile ? '100%' : 'auto',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                }}
              >
                Get Started Today →
              </Btn>
            </div>
          </div>
        </AnimatedText>
      </div>
    </Section>
  )
}

/* ── CTA FORM ── */
function CTASection() {
  const [form, setForm] = useState({ name: '', email: '', agency: '', size: '', challenge: '' })
  const [submitted, setSubmitted] = useState(false)
  const [hovBtn, setHovBtn] = useState(false)
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.agency) {
      alert('Please fill in your name, email, and agency name.')
      return
    }
    setSubmitted(true)
  }

  const inputStyle = {
    width: '100%', padding: isMobile ? '11px 14px' : '12px 16px', borderRadius: 10,
    background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)',
    color: '#fff', fontSize: isMobile ? '.84rem' : '.88rem', fontFamily: "'Outfit',sans-serif", outline: 'none',
  }

  return (
    <section id="cta" style={{ padding: isMobile ? '60px 20px' : '100px 48px', background: C.surf }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        background: `linear-gradient(135deg,${C.ink2} 0%,${C.ink} 100%)`,
        borderRadius: isMobile ? 20 : 28, padding: isMobile ? 40 : 80,
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 400px', gap: isMobile ? 40 : 60, alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: isMobile ? 400 : 600, height: isMobile ? 400 : 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(68,81,244,.2) 0%,transparent 70%)', right: isMobile ? -100 : -150, top: isMobile ? -100 : -150, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <SectionTag light>Get Started Today</SectionTag>
          <AnimatedText delay={0.1} direction="left" as="h2">
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: isMobile ? '1.6rem' : 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 800, color: '#fff', letterSpacing: '-.5px', lineHeight: 1.15, marginBottom: 16, marginTop: 8 }}>
              Ready to fix your scheduling operations?
            </h2>
          </AnimatedText>
          <AnimatedText delay={0.2} direction="left">
            <p style={{ fontSize: isMobile ? '.9rem' : '.97rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.75, marginBottom: 32 }}>
              Book a free consultation and we'll show you exactly how GrowEdgeX can reduce your scheduling chaos, improve visit completion rates, and free your team to focus on patient care.
            </p>
          </AnimatedText>
          <AnimatedText delay={0.3} direction="left">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { href: 'tel:+14699292524', text: '+1 469 929 2524', label: 'Call us directly at' },
                { href: 'https://www.growedgex.com', text: 'www.growedgex.com', label: 'Visit us at' },
              ].map(({ href, text, label }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: isMobile ? '.8rem' : '.85rem', color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>
                  <div style={{ width: isMobile ? 30 : 34, height: isMobile ? 30 : 34, borderRadius: 9, background: 'rgba(68,81,244,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width={isMobile ? 12 : 14} height={isMobile ? 12 : 14} viewBox="0 0 24 24" fill="none" stroke={C.blue2} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 10.79a19.79 19.79 0 01-3.07-8.67A2 2 0 011.9 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
                    </svg>
                  </div>
                  <span>{label} <strong style={{ color: 'rgba(255,255,255,.85)' }}>{text}</strong></span>
                </a>
              ))}
            </div>
          </AnimatedText>
        </div>

        <AnimatedText delay={0.4} direction="right">
          <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 20, padding: isMobile ? 28 : 36, backdropFilter: 'blur(10px)', position: 'relative', zIndex: 1 }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: isMobile ? '30px 0' : '40px 0' }}>
                <div style={{ width: isMobile ? 56 : 64, height: isMobile ? 56 : 64, borderRadius: '50%', background: 'rgba(68,81,244,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width={isMobile ? 24 : 28} height={isMobile ? 24 : 28} viewBox="0 0 24 24" fill="none" stroke="#8b93ff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <h4 style={{ fontFamily: "'Sora',sans-serif", fontSize: isMobile ? '1.1rem' : '1.2rem', fontWeight: 700, color: '#fff', marginBottom: 10 }}>Thank you, {form.name}!</h4>
                <p style={{ fontSize: isMobile ? '.86rem' : '.9rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.7 }}>We've received your request. Our team will reach out within 24 hours to schedule your free consultation.</p>
                <div style={{ marginTop: 24, padding: isMobile ? 12 : 14, borderRadius: 10, background: 'rgba(68,81,244,.2)', border: '1px solid rgba(68,81,244,.3)' }}>
                  <p style={{ fontSize: isMobile ? '.8rem' : '.83rem', color: 'rgba(255,255,255,.6)' }}>Or call us now: <a href="tel:+14699292524" style={{ color: C.blue2, fontWeight: 600 }}>+1 469 929 2524</a></p>
                </div>
              </div>
            ) : (
              <>
                <h4 style={{ fontFamily: "'Sora',sans-serif", fontSize: isMobile ? '1.05rem' : '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 22 }}>Book Your Free Consultation</h4>
                {[
                  { key: 'name', placeholder: 'Your Full Name', type: 'text' },
                  { key: 'email', placeholder: 'Agency Email Address', type: 'email' },
                  { key: 'agency', placeholder: 'Agency Name', type: 'text' },
                  { key: 'challenge', placeholder: 'Biggest Scheduling Challenge', type: 'text' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 14 }}>
                    <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
                  </div>
                ))}
                <div style={{ marginBottom: 14 }}>
                  <select value={form.size} onChange={e => setForm(p => ({ ...p, size: e.target.value }))}
                    style={{ ...inputStyle, color: form.size ? '#fff' : 'rgba(255,255,255,.45)' }}>
                    <option value="" disabled>Number of Patients / Census Size</option>
                    <option value="under25">Under 25 patients</option>
                    <option value="25to75">25–75 patients</option>
                    <option value="75to150">75–150 patients</option>
                    <option value="150plus">150+ patients</option>
                  </select>
                </div>
                <button onClick={handleSubmit} onMouseEnter={() => setHovBtn(true)} onMouseLeave={() => setHovBtn(false)}
                  style={{
                    width: '100%', padding: isMobile ? 13 : 14, borderRadius: 100, border: 'none', cursor: 'pointer',
                    background: `linear-gradient(90deg,${C.blue},${C.violet})`,
                    fontFamily: "'Sora',sans-serif", fontSize: isMobile ? '.88rem' : '.92rem', fontWeight: 700, color: '#fff',
                    marginTop: 8,
                    boxShadow: hovBtn ? '0 12px 36px rgba(68,81,244,.6)' : '0 6px 24px rgba(68,81,244,.4)',
                    transform: hovBtn ? 'translateY(-2px)' : 'none', transition: 'all .25s',
                  }}>Schedule Free Consultation →</button>
                <p style={{ textAlign: 'center', fontSize: isMobile ? '.72rem' : '.75rem', color: 'rgba(255,255,255,.35)', marginTop: 12 }}>No commitment required · Response within 24 hours</p>
              </>
            )}
          </div>
        </AnimatedText>
      </div>
    </section>
  )
}

/* ── FOOTER ── */
// Helper component for footer links with hover state
function FooterLink({ item }) {
  const [hov, setHov] = useState(false)
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  if (item.href) {
    return (
      <li>
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            fontSize: isMobile ? '.8rem' : '.84rem',
            color: hov ? C.blue2 : 'rgba(255,255,255,.4)',
            transition: 'color .2s',
            textDecoration: 'none',
          }}
        >
          {item.label}
        </a>
      </li>
    )
  }

  return (
    <li>
      <span
        onClick={() => scrollTo(item.id)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          fontSize: isMobile ? '.8rem' : '.84rem',
          color: hov ? C.blue2 : 'rgba(255,255,255,.4)',
          transition: 'color .2s',
          cursor: 'pointer',
        }}
      >
        {item.label}
      </span>
    </li>
  )
}

// Helper for footer text links (Privacy, Terms)
function FooterTextLink({ label }) {
  const [hov, setHov] = useState(false)
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: isMobile ? '.74rem' : '.78rem',
        color: hov ? C.blue2 : 'rgba(255,255,255,.3)',
        cursor: 'pointer',
        transition: 'color .2s',
      }}
    >
      {label}
    </span>
  )
}

// Corrected Footer component
function Footer() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const footerLinks = {
    Services: [
      { label: 'Scheduling & Visits', id: 'services' },
      { label: 'Intake & Referrals', id: 'services' },
      { label: 'Clinician Coordination', id: 'services' },
      { label: 'Documentation Tracking', id: 'services' },
      { label: 'Patient Communication', id: 'services' },
    ],
    Company: [
      { label: 'About Us', id: 'home' },
      { label: 'Who We Serve', id: 'who' },
      { label: 'How It Works', id: 'how' },
      { label: 'Benefits', id: 'benefits' },
    ],
    Contact: [
      { label: '+1 469 929 2524', href: 'tel:+14699292524' },
      { label: 'www.growedgex.com', href: 'https://www.growedgex.com' },
      { label: 'Free Consultation', id: 'cta' },
    ],
  }

  return (
    <footer style={{ background: C.ink, padding: isMobile ? '50px 20px 30px' : '60px 48px 30px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr',
            gap: isMobile ? 40 : 48,
            marginBottom: 48,
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 14,
                cursor: 'pointer',
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `linear-gradient(135deg,${C.blue},${C.violet})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(68,81,244,.4)',
                }}
              >
                <svg
                  width={17}
                  height={17}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  color: '#fff',
                  letterSpacing: '-.5px',
                }}
              >
                Grow<span style={{ color: C.blue2 }}>EdgeX</span>
              </span>
            </div>
            <p
              style={{
                fontSize: isMobile ? '.82rem' : '.85rem',
                color: 'rgba(255,255,255,.4)',
                lineHeight: 1.7,
                maxWidth: isMobile ? '100%' : 260,
              }}
            >
              Dedicated remote scheduling and intake coordination designed
              specifically for home health agencies. Reduce chaos. Improve
              outcomes.
            </p>
          </div>

          {Object.entries(footerLinks).map(([col, links]) => (
            <div key={col}>
              <h5
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: isMobile ? '.76rem' : '.8rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,.85)',
                  letterSpacing: '.5px',
                  textTransform: 'uppercase',
                  marginBottom: 16,
                }}
              >
                {col}
              </h5>
              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {links.map((l, idx) => (
                  <FooterLink key={idx} item={l} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,.08)',
            paddingTop: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'center' : 'space-between',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 20 : 0,
          }}
        >
          <p
            style={{
              fontSize: isMobile ? '.76rem' : '.8rem',
              color: 'rgba(255,255,255,.3)',
            }}
          >
            © 2025 GrowEdgeX. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service'].map((t, idx) => (
              <FooterTextLink key={idx} label={t} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ── PAGE ── */
export default function Page() {
  return (
    <>
      <GlobalStyles />
      <Navbar />
      <Hero />
      <Marquee />
      <Problems />
      <Services />
      <HowItWorks />
      <Benefits />
      <WhoWeServe />
      <CTASection />
      <Footer />
    </>
  )
}