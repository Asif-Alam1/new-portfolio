// Replace the entire Sidebar.jsx component with this implementation
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Files,
  Github,
  Code,
  Mail,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Coffee,
  Command,
  Info,
  Menu,
  X,
  Zap,
  Monitor
} from 'lucide-react'
import styles from '../styles/Sidebar.module.css'

// Navigation data with added keyboard shortcuts and descriptions
const sidebarTopItems = [
  {
    Icon: Files,
    path: '/',
    label: 'Home',
    shortcut: 'Alt+F',
    description: 'Navigate to home page'
  },
  {
    Icon: Github,
    path: '/github',
    label: 'GitHub',
    shortcut: 'Alt+G',
    description: 'View GitHub projects'
  },
  {
    Icon: Code,
    path: '/projects',
    label: 'Projects',
    shortcut: 'Alt+P',
    description: 'Browse my portfolio projects'
  },
  {
    Icon: Mail,
    path: '/contact',
    label: 'Contact',
    shortcut: 'Alt+C',
    description: 'Get in touch with me'
  }
]

const sidebarBottomItems = [
  {
    Icon: User,
    path: '/about',
    label: 'About',
    shortcut: 'Alt+A',
    description: 'Learn more about me'
  },
  {
    Icon: Monitor,
    path: '/settings',
    label: 'Settings',
    shortcut: 'Alt+S',
    description: 'Change theme and settings'
  }
]

// Additional context menu actions
const contextActions = [
  {
    Icon: Terminal,
    label: 'Open Terminal',
    action: () => console.log('Open Terminal')
  },
  {
    Icon: Coffee,
    label: 'Buy Me a Coffee',
    action: () => window.open('https://www.buymeacoffee.com', '_blank')
  },
  {
    Icon: Command,
    label: 'Keyboard Shortcuts',
    action: () => console.log('Show Shortcuts')
  },
  {
    Icon: Info,
    label: 'About This Site',
    action: () => console.log('Show About')
  }
]

const Sidebar = () => {
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState(router.pathname)
  const [contextMenuVisible, setContextMenuVisible] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [hoveredItem, setHoveredItem] = useState(null)
  const [touchStartTime, setTouchStartTime] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

  const sidebarRef = useRef(null)
  const contextMenuRef = useRef(null)

  // Track active path
  useEffect(() => {
    setActiveItem(router.pathname)
  }, [router.pathname])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width <= 768);

      // Auto-close mobile menu when resizing to desktop
      if (width > 768) {
        setIsMobileMenuOpen(false);
      }

      // Auto-collapse sidebar on medium-sized screens
      if (width <= 1024 && width > 768) {
        setIsCollapsed(true);
      } else if (width > 1024) {
        setIsCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only trigger if Alt key is pressed
      if (e.altKey) {
        const key = e.key.toUpperCase()

        // Match with shortcuts
        if (key === 'F') {
          router.push('/')
          e.preventDefault()
        } else if (key === 'G') {
          router.push('/github')
          e.preventDefault()
        } else if (key === 'P') {
          router.push('/projects')
          e.preventDefault()
        } else if (key === 'C') {
          router.push('/contact')
          e.preventDefault()
        } else if (key === 'A') {
          router.push('/about')
          e.preventDefault()
        } else if (key === 'S') {
          router.push('/settings')
          e.preventDefault()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  // Hide context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuVisible &&
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        setContextMenuVisible(false)
      }

      // Close mobile menu when clicking outside
      if (
        isMobileMenuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.mobileMenuToggle}`)
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [contextMenuVisible, isMobileMenuOpen])

  // Close sidebars on navigation
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [router.pathname, isMobile]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    setContextMenuVisible(true)
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
  }

  const executeAction = (action) => {
    setContextMenuVisible(false)
    if (typeof action === 'function') {
      action()
    }
  }

  // Touch handlers for mobile devices
  const handleTouchStart = () => {
    setTouchStartTime(Date.now())
  }

  const handleTouchEnd = (e) => {
    const touchDuration = Date.now() - touchStartTime
    if (touchDuration > 500) {
      // Long press - show context menu
      e.preventDefault()
      handleContextMenu({
        preventDefault: () => {},
        clientX: e.changedTouches[0].clientX,
        clientY: e.changedTouches[0].clientY
      })
    }
  }

  const renderIcon = (item) => {
    const { Icon, path, label, shortcut, description } = item;
    const isActive = activeItem === path;
    const isHovered = hoveredItem === path;

    return (
      <div
        className={`${styles.iconContainer} ${
          isActive ? styles.active : ''
        } ${isHovered ? styles.hovered : ''}`}
        title={`${label} (${shortcut})`}
        aria-label={description}
        onMouseEnter={() => setHoveredItem(path)}
        onMouseLeave={() => setHoveredItem(null)}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.iconWrapper}>
          <Icon size={22} strokeWidth={1.5} className={styles.icon} />
          {isActive && <div className={styles.activeIndicator} />}
        </div>

        <div className={styles.labelContainer}>
          <span className={styles.iconLabel}>{label}</span>
          <span className={styles.shortcut}>{shortcut}</span>
        </div>

        {/* Tooltip for description */}
        <div className={styles.tooltip}>
          {description}
        </div>
      </div>
    );
  };

  // Mobile-specific sidebar render
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Toggle Button */}
        <button
          className={styles.mobileMenuToggle}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Sidebar */}
        <aside
          ref={sidebarRef}
          className={`${styles.mobileSidebar} ${isMobileMenuOpen ? styles.open : ''}`}
        >
          <div className={styles.mobileHeader}>
            <h3>Navigation</h3>
            <button
              className={styles.closeButton}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          <div className={styles.mobileNavSection}>
            <h4>Main</h4>
            {sidebarTopItems.map((item) => (
              <Link
                href={item.path}
                key={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className={`${styles.mobileNavItem} ${activeItem === item.path ? styles.activeNavItem : ''}`}>
                  <item.Icon size={18} className={styles.mobileNavIcon} />
                  <span>{item.label}</span>
                  <span className={styles.mobileShortcut}>{item.shortcut}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.mobileNavSection}>
            <h4>Settings</h4>
            {sidebarBottomItems.map((item) => (
              <Link
                href={item.path}
                key={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className={`${styles.mobileNavItem} ${activeItem === item.path ? styles.activeNavItem : ''}`}>
                  <item.Icon size={18} className={styles.mobileNavIcon} />
                  <span>{item.label}</span>
                  <span className={styles.mobileShortcut}>{item.shortcut}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.mobileNavSection}>
            <h4>Additional</h4>
            {contextActions.map((item, index) => (
              <div
                key={index}
                className={styles.mobileNavItem}
                onClick={() => {
                  item.action();
                  setIsMobileMenuOpen(false);
                }}
              >
                <item.Icon size={18} className={styles.mobileNavIcon} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className={styles.mobileFooter}>
            <p>Asif Alam © 2023</p>
            <div className={styles.poweredBy}>
              <Zap size={14} />
              <span>Powered by Next.js</span>
            </div>
          </div>
        </aside>

        {/* Overlay when mobile menu is open */}
        {isMobileMenuOpen && (
          <div
            className={styles.overlay}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </>
    );
  }

  // Desktop sidebar render
  return (
    <aside
      ref={sidebarRef}
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
      onContextMenu={handleContextMenu}
    >
      <div className={styles.sidebarTop}>
        {sidebarTopItems.map((item) => (
          <Link href={item.path} key={item.path}>
            {renderIcon(item)}
          </Link>
        ))}
      </div>

      <div className={styles.sidebarBottom}>
        {sidebarBottomItems.map((item) => (
          <Link href={item.path} key={item.path}>
            {renderIcon(item)}
          </Link>
        ))}

        <div
          className={`${styles.iconContainer} ${styles.toggleButton}`}
          onClick={toggleSidebar}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight size={22} strokeWidth={1.5} className={styles.icon} />
          ) : (
            <ChevronLeft size={22} strokeWidth={1.5} className={styles.icon} />
          )}

          <div className={styles.labelContainer}>
            <span className={styles.iconLabel}>
              {isCollapsed ? 'Expand' : 'Collapse'}
            </span>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenuVisible && (
        <div
          ref={contextMenuRef}
          className={styles.contextMenu}
          style={{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`
          }}
        >
          {contextActions.map((item, index) => (
            <div
              key={index}
              className={styles.contextMenuItem}
              onClick={() => executeAction(item.action)}
            >
              <item.Icon size={16} className={styles.contextMenuIcon} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}

export default Sidebar