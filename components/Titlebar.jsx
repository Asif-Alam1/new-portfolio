import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import {
  Minus,
  Maximize2,
  X,
  Palette,
  Github,
  Linkedin,
  Mail,
  FileText,
  Coffee,
  Menu,
  FolderTree
} from 'lucide-react'
import styles from '../styles/Titlebar.module.css'
import Link from 'next/link'

const themes = [
  { name: 'GitHub Dark', value: 'github-dark' },
  { name: 'Dracula', value: 'dracula' },
  { name: 'Ayu Dark', value: 'ayu-dark' },
  { name: 'Ayu Mirage', value: 'ayu-mirage' },
  { name: 'Nord', value: 'nord' },
  { name: 'Night Owl', value: 'night-owl' }
]

const menuItems = [
  {
    name: 'File',
    subItems: [
      {
        name: 'New Project',
        icon: <FileText size={14} />,
        action: () => console.log('New Project')
      },
      {
        name: 'Save All',
        icon: <FileText size={14} />,
        action: () => console.log('Save All')
      },
      {
        name: 'Auto Save',
        icon: <FileText size={14} />,
        action: () => console.log('Auto Save')
      },
      { name: 'Exit', icon: <X size={14} />, action: () => window.close() }
    ]
  },
  {
    name: 'Edit',
    subItems: [
      { name: 'Undo', action: () => document.execCommand('undo') },
      { name: 'Redo', action: () => document.execCommand('redo') },
      { name: 'Cut', action: () => document.execCommand('cut') },
      { name: 'Copy', action: () => document.execCommand('copy') },
      { name: 'Paste', action: () => document.execCommand('paste') }
    ]
  },
  {
    name: 'View',
    subItems: [
      {
        name: 'Toggle Full Screen',
        action: () => document.documentElement.requestFullscreen()
      },
      { name: 'Toggle Sidebar', action: () => console.log('Toggle Sidebar') }
    ]
  },
  {
    name: 'Go',
    subItems: [
      { name: 'Home', action: router => router.push('/') },
      { name: 'About', action: router => router.push('/about') },
      { name: 'Projects', action: router => router.push('/projects') },
      { name: 'Contact', action: router => router.push('/contact') }
    ]
  }
]

const Titlebar = ({ toggleSidebar, toggleExplorer, isMobile }) => {
  const [activeMenu, setActiveMenu] = useState(null)
  const [currentTheme, setCurrentTheme] = useState('github-dark')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const titlebarRef = useRef(null)

  const handleMenuClick = menu => {
    setActiveMenu(activeMenu === menu ? null : menu)
  }

  const handleSubItemClick = action => {
    if (typeof action === 'function') {
      action(router)
    }
    setActiveMenu(null)
    setMobileMenuOpen(false)
  }

  const changeTheme = theme => {
    setCurrentTheme(theme)
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    setActiveMenu(null)
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    setActiveMenu(null)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      changeTheme(savedTheme)
    }

    const handleClickOutside = event => {
      if (titlebarRef.current && !titlebarRef.current.contains(event.target)) {
        setActiveMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [router.pathname])

  return (
    <section className={styles.titlebar} ref={titlebarRef}>
      <div className={styles.left}>
        <Image
          src='/vscode_icon.svg'
          alt='VSCode Icon'
          height={15}
          width={15}
          className={styles.icon}
        />

        {/* Desktop Menu */}
        <div className={`${styles.items} ${styles.desktopOnly}`}>
          {menuItems.map(item => (
            <div
              key={item.name}
              className={`${styles.menuItem} ${
                activeMenu === item.name ? styles.active : ''
              }`}
              onClick={() => handleMenuClick(item.name)}
            >
              {item.name}
              {activeMenu === item.name && (
                <div className={styles.dropdown}>
                  {item.subItems.map(subItem => (
                    <div
                      key={subItem.name}
                      className={styles.subItem}
                      onClick={() => handleSubItemClick(subItem.action)}
                    >
                      {subItem.icon && (
                        <span className={styles.subItemIcon}>
                          {subItem.icon}
                        </span>
                      )}
                      {subItem.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile menu toggle */}
        {isMobile && (
          <button
            className={`${styles.mobileMenuToggle} ${mobileMenuOpen ? styles.active : ''}`}
            onClick={toggleMobileMenu}
          >
            <Menu size={16} />
          </button>
        )}
      </div>

      {/* Title - Hide on very small screens */}
      <p className={styles.title}>Asif Alam - Visual Studio Code</p>

      <div className={styles.right}>
        <div
          className={`${styles.menuItem} ${
            activeMenu === 'theme' ? styles.active : ''
          }`}
          onClick={() => handleMenuClick('theme')}
        >
          <Palette size={14} className={styles.themeIcon} />
          {activeMenu === 'theme' && (
            <div className={styles.dropdown}>
              {themes.map(theme => (
                <div
                  key={theme.value}
                  className={styles.subItem}
                  onClick={() => changeTheme(theme.value)}
                >
                  {theme.name}
                </div>
              ))}
            </div>
          )}
        </div>



          <a
            href='mailto:asiftalukder151@gmail.com'
            className={styles.menuItem}
            title='Email'
          >
            <Mail size={14} />
          </a>


        <div className={styles.windowButtons}>
          <button
            className={`${styles.windowButton} ${styles.minimize}`}
            onClick={() => console.log('Minimize')}
            title='Minimize'
          ></button>
          <button
            className={`${styles.windowButton} ${styles.maximize}`}
            onClick={() => console.log('Maximize')}
            title='Maximize'
          ></button>
          <button
            className={`${styles.windowButton} ${styles.close}`}
            onClick={() => console.log('Close')}
            title='Close'
          ></button>
        </div>
      </div>

      {/* Mobile expanded menu */}
      {isMobile && mobileMenuOpen && (
        <div className={styles.mobileMenu}>

<div className={styles.mobileMenuSection}>
  <div className={styles.mobileMenuSectionTitle}>Navigation</div>
  {['Home', 'About', 'Projects', 'Contact', 'GitHub'].map(item => (
    <Link
      key={item}
      href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
      legacyBehavior
    >
      <a
        className={styles.mobileMenuItem}
        onClick={() => setMobileMenuOpen(false)}
      >
        {item}
      </a>
    </Link>
  ))}
</div>

          <div className={styles.mobileMenuSection}>
            <div className={styles.mobileMenuSectionTitle}>Layout</div>

            <button
              className={styles.mobileMenuItem}
              onClick={() => {
                toggleExplorer();
                setMobileMenuOpen(false);
              }}
            >
              Toggle Explorer
            </button>
          </div>

          <div className={styles.mobileMenuSection}>
            <div className={styles.mobileMenuSectionTitle}>Themes</div>
            {themes.map(theme => (
              <button
                key={theme.value}
                className={`${styles.mobileMenuItem} ${currentTheme === theme.value ? styles.active : ''}`}
                onClick={() => changeTheme(theme.value)}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default Titlebar