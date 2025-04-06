import React, { useState, useEffect } from 'react'
import Titlebar from '../components/Titlebar'
import Sidebar from '../components/Sidebar'
import Explorer from '../components/Explorer'
import Bottombar from '../components/Bottombar'
import Tabsbar from './Tabsbar'
import styles from '../styles/Layout.module.css'
import { useRouter } from 'next/router'
import InitialLoader from './InitialLoader'
import { Menu, X } from 'lucide-react'

const Layout = ({ children }) => {
  // State for sidebar visibility on mobile
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const [isExplorerVisible, setIsExplorerVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const router = useRouter()

  // Handle window resize to detect mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)

      // Auto-hide sidebars on mobile
      if (mobile) {
        setIsSidebarVisible(false)
        setIsExplorerVisible(false)
      } else {
        // Restore default visibility on desktop
        setIsSidebarVisible(true)
        setIsExplorerVisible(true)
      }
    }

    // Initial check
    handleResize()

    // Set up listener
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Reset scroll position when navigating
  useEffect(() => {
    const main = document.getElementById('main-editor')
    if (main) main.scrollTop = 0

    // Auto-close mobile sidebar on navigation
    if (isMobile) {
      setIsSidebarVisible(false)
      setIsExplorerVisible(false)
    }
  }, [router.pathname, isMobile])

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarVisible(!isSidebarVisible)
      setIsExplorerVisible(false) // Close explorer when sidebar opens on mobile
    }
  }

  // Toggle explorer visibility
  const toggleExplorer = () => {
    if (isMobile) {
      setIsExplorerVisible(!isExplorerVisible)
      setIsSidebarVisible(false) // Close sidebar when explorer opens on mobile
    }
  }

  return (
    <>
      <InitialLoader />
      <Titlebar
        toggleSidebar={toggleSidebar}
        toggleExplorer={toggleExplorer}
        isMobile={isMobile}
      />
      <div className={styles.main}>
        {/* Sidebar with visibility classes */}
        <div className={`${styles.sidebarContainer} ${isSidebarVisible ? styles.visible : ''}`}>
          <Sidebar />
        </div>

        {/* Explorer with visibility classes */}
        <div className={`${styles.explorerContainer} ${isExplorerVisible ? styles.visible : ''}`}>
          <Explorer />
        </div>



        {/* Main content area */}
        <div className={styles.contentWrapper}>
          <Tabsbar isMobile={isMobile} />
          <main id="main-editor" className={styles.content}>
            {children}
          </main>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && (isSidebarVisible || isExplorerVisible) && (
        <div
          className={styles.overlay}
          onClick={() => {
            setIsSidebarVisible(false)
            setIsExplorerVisible(false)
          }}
        />
      )}

      <Bottombar />
    </>
  )
}

export default Layout