import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { MdKeyboardArrowUp } from 'react-icons/md'

const FONT = 'system-ui, -apple-system, sans-serif'
const ACCENT = '#6366f1'

// ─── Back-to-top button ───────────────────────────────────────────────────────

function BackToTopButton({ scrollContainerRef }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      setVisible(container.scrollTop > 200)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [scrollContainerRef])

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      title="Back to top"
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: ACCENT,
        color: '#fff',
        border: 'none',
        boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        fontFamily: FONT,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.8)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        pointerEvents: visible ? 'auto' : 'none'
      }}
    >
      <MdKeyboardArrowUp style={{ fontSize: 22 }} />
    </button>
  )
}

// ─── Animated page content ────────────────────────────────────────────────────

function AnimatedContent({ children }) {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('fadeIn')

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('fadeOut')
    }
  }, [location, displayLocation])

  const handleAnimationEnd = () => {
    if (transitionStage === 'fadeOut') {
      setTransitionStage('fadeIn')
      setDisplayLocation(location)
    }
  }

  return (
    <div
      onAnimationEnd={handleAnimationEnd}
      style={{
        flex: 1,
        animation: transitionStage === 'fadeIn'
          ? 'pageFadeIn 0.22s ease forwards'
          : 'pageFadeOut 0.15s ease forwards'
      }}
    >
      {children}
    </div>
  )
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)

  useEffect(() => {
    const h = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      // On resize to desktop, ensure sidebar is open; on resize to mobile, close it
      if (!mobile) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const mainScrollRef = useRef(null)

  const handleCollapsedChange = useCallback((collapsed) => {
    setSidebarCollapsed(collapsed)
  }, [])

  return (
    <>
      {/* Page transition keyframes */}
      <style>{`
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pageFadeOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-4px); }
        }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: FONT
      }}>
        {/* Mobile backdrop overlay */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 499
            }}
          />
        )}

        <Sidebar
          onCollapsedChange={handleCollapsedChange}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <Navbar
            onToggleSidebar={() => setSidebarOpen(prev => !prev)}
            isMobile={isMobile}
          />

          <main
            ref={mainScrollRef}
            style={{
              flex: 1,
              padding: isMobile ? 16 : 28,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <AnimatedContent>
              <Outlet />
            </AnimatedContent>
          </main>
        </div>

        <BackToTopButton scrollContainerRef={mainScrollRef} />
      </div>
    </>
  )
}
