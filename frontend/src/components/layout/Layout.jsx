import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { MdKeyboardArrowUp } from 'react-icons/md'

function BackToTopButton({ scrollContainerRef }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const handleScroll = () => setVisible(container.scrollTop > 200)
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [scrollContainerRef])

  const scrollToTop = () =>
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      onClick={scrollToTop}
      title="Back to top"
      className="fixed bottom-7 right-7 flex h-10 w-10 items-center justify-center rounded-full border-none bg-indigo-500 text-white shadow-lg transition-all duration-200"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.8)',
        pointerEvents: visible ? 'auto' : 'none',
        zIndex: 999,
        boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
      }}
    >
      <MdKeyboardArrowUp style={{ fontSize: 22 }} />
    </button>
  )
}

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
      className="flex-1"
      style={{
        animation:
          transitionStage === 'fadeIn'
            ? 'pageFadeIn 0.22s ease forwards'
            : 'pageFadeOut 0.15s ease forwards',
      }}
    >
      {children}
    </div>
  )
}

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
      setSidebarOpen(!mobile)
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
      <style>{`
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pageFadeOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-4px); }
        }
      `}</style>

      <div className="flex min-h-screen bg-slate-50 font-sans">
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-[499] bg-black/40"
          />
        )}

        <Sidebar
          onCollapsedChange={handleCollapsedChange}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col transition-[margin-left] duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]">
          <Navbar
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            isMobile={isMobile}
          />

          <main
            ref={mainScrollRef}
            className={`flex flex-1 flex-col overflow-auto ${isMobile ? 'p-4' : 'p-7'}`}
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
