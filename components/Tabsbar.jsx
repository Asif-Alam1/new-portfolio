import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import {
  X,
  SplitSquareVertical,
  MoreHorizontal,
  Play,
  Edit,
  Save,
  Copy,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react'
import styles from '../styles/Tabsbar.module.css'

const tabsData = [
  {
    icon: '/react_icon.svg',
    filename: 'home.jsx',
    path: '/',
    modified: false,
    lastActive: new Date().getTime()
  },
  {
    icon: '/html_icon.svg',
    filename: 'about.html',
    path: '/about',
    modified: false,
    lastActive: new Date().getTime() - 60000
  },
  {
    icon: '/css_icon.svg',
    filename: 'contact.css',
    path: '/contact',
    modified: false,
    lastActive: new Date().getTime() - 120000
  },
  {
    icon: '/js_icon.svg',
    filename: 'projects.js',
    path: '/projects',
    modified: true,
    lastActive: new Date().getTime() - 180000
  },
  {
    icon: '/markdown_icon.svg',
    filename: 'github.md',
    path: '/github',
    modified: false,
    lastActive: new Date().getTime() - 240000
  }
]

const Tabsbar = ({ isMobile }) => {
  const router = useRouter()
  const [openTabs, setOpenTabs] = useState(tabsData)
  const [activeTab, setActiveTab] = useState(router.pathname)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const [tabContextMenu, setTabContextMenu] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    tabIndex: null
  })
  const tabsContainerRef = useRef(null)
  const tabRefs = useRef([])

  // Update active tab when route changes
  useEffect(() => {
    setActiveTab(router.pathname)

    // Update lastActive time for current tab
    setOpenTabs(tabs =>
      tabs.map(tab =>
        tab.path === router.pathname
          ? { ...tab, lastActive: new Date().getTime() }
          : tab
      )
    )
  }, [router.pathname])

  // Check if scroll buttons are needed
  useEffect(() => {
    const checkScroll = () => {
      if (tabsContainerRef.current) {
        const { scrollWidth, clientWidth } = tabsContainerRef.current
        setShowScrollButtons(scrollWidth > clientWidth)
      }
    }

    checkScroll()
    window.addEventListener('resize', checkScroll)

    return () => window.removeEventListener('resize', checkScroll)
  }, [openTabs])

  // Scroll active tab into view when it changes
  useEffect(() => {
    const activeTabIndex = openTabs.findIndex(tab => tab.path === activeTab)
    if (activeTabIndex !== -1 && tabRefs.current[activeTabIndex]) {
      const tabElement = tabRefs.current[activeTabIndex]
      const tabsContainer = tabsContainerRef.current

      if (tabElement && tabsContainer) {
        const tabRect = tabElement.getBoundingClientRect()
        const containerRect = tabsContainer.getBoundingClientRect()

        if (tabRect.right > containerRect.right) {
          // Tab is off to the right
          tabsContainer.scrollLeft += (tabRect.right - containerRect.right) + 20
        } else if (tabRect.left < containerRect.left) {
          // Tab is off to the left
          tabsContainer.scrollLeft -= (containerRect.left - tabRect.left) + 20
        }
      }
    }
  }, [activeTab, openTabs])

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tabContextMenu.visible && !event.target.closest(`.${styles.contextMenu}`)) {
        setTabContextMenu(prev => ({ ...prev, visible: false }))
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [tabContextMenu.visible])

  const closeTab = (path, e) => {
    e.preventDefault()
    e.stopPropagation()

    // Find index of tab to close
    const tabIndex = openTabs.findIndex(tab => tab.path === path)

    if (tabIndex !== -1) {
      const newTabs = [...openTabs]
      newTabs.splice(tabIndex, 1)

      // If no more tabs, add back the home tab
      if (newTabs.length === 0) {
        newTabs.push({
          icon: '/react_icon.svg',
          filename: 'home.jsx',
          path: '/',
          modified: false,
          lastActive: new Date().getTime()
        })
      }

      setOpenTabs(newTabs)

      // If we're closing the active tab, navigate to the most recently used tab
      if (activeTab === path) {
        // Find the tab with the highest lastActive value
        const mostRecentTab = [...newTabs].sort((a, b) => b.lastActive - a.lastActive)[0]
        router.push(mostRecentTab.path)
      }
    }
  }

  const handleTabClick = path => {
    setActiveTab(path)
  }

  const handleTabDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index)
    e.dataTransfer.effectAllowed = 'move'

    // Add drag feedback
    setTimeout(() => {
      if (tabRefs.current[index]) {
        tabRefs.current[index].classList.add(styles.dragging)
      }
    }, 0)
  }

  const handleTabDragEnd = (e, index) => {
    if (tabRefs.current[index]) {
      tabRefs.current[index].classList.remove(styles.dragging)
    }
  }

  const handleTabDragOver = e => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleTabDragEnter = (e, index) => {
    e.preventDefault()
    if (tabRefs.current[index]) {
      tabRefs.current[index].classList.add(styles.dropTarget)
    }
  }

  const handleTabDragLeave = (e, index) => {
    if (tabRefs.current[index]) {
      tabRefs.current[index].classList.remove(styles.dropTarget)
    }
  }

  const handleTabDrop = (e, dropIndex) => {
    e.preventDefault()

    // Remove drop target styling
    if (tabRefs.current[dropIndex]) {
      tabRefs.current[dropIndex].classList.remove(styles.dropTarget)
    }

    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)

    // Don't do anything if dropping onto the same tab
    if (dragIndex === dropIndex) return

    const newTabs = [...openTabs]
    const [reorderedTab] = newTabs.splice(dragIndex, 1)
    newTabs.splice(dropIndex, 0, reorderedTab)

    setOpenTabs(newTabs)
  }

  const handleScroll = (direction) => {
    if (tabsContainerRef.current) {
      const { scrollLeft, clientWidth } = tabsContainerRef.current
      const scrollAmount = clientWidth / 2

      const newScrollPosition = direction === 'left'
        ? Math.max(0, scrollLeft - scrollAmount)
        : scrollLeft + scrollAmount

      tabsContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      })

      setScrollPosition(newScrollPosition)
    }
  }

  const handleTabContextMenu = (e, index) => {
    e.preventDefault()

    setTabContextMenu({
      visible: true,
      position: { x: e.clientX, y: e.clientY },
      tabIndex: index
    })
  }

  const handleTabAction = (action) => {
    if (tabContextMenu.tabIndex === null) return

    const tab = openTabs[tabContextMenu.tabIndex]

    switch (action) {
      case 'close':
        closeTab(tab.path, { preventDefault: () => {}, stopPropagation: () => {} })
        break
      case 'closeOthers':
        setOpenTabs([tab])
        break
      case 'closeAll':
        setOpenTabs([{
          icon: '/react_icon.svg',
          filename: 'home.jsx',
          path: '/',
          modified: false,
          lastActive: new Date().getTime()
        }])
        router.push('/')
        break
      case 'closeRight':
        setOpenTabs(openTabs.slice(0, tabContextMenu.tabIndex + 1))
        break
      case 'closeLeft':
        setOpenTabs(openTabs.slice(tabContextMenu.tabIndex))
        break
      case 'save':
        // Toggle modified state
        setOpenTabs(tabs =>
          tabs.map((t, i) =>
            i === tabContextMenu.tabIndex ? { ...t, modified: false } : t
          )
        )
        break
      case 'copy':
        navigator.clipboard.writeText(tab.filename)
        break
      default:
        break
    }

    setTabContextMenu(prev => ({ ...prev, visible: false }))
  }

  // Add a new empty tab reference array when tabs change
  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, openTabs.length)
  }, [openTabs])

  const assignTabRef = (index, element) => {
    tabRefs.current[index] = element
  }

  return (
    <div className={styles.tabsbar}>
      {showScrollButtons && (
        <button
          className={`${styles.scrollButton} ${styles.scrollLeft}`}
          onClick={() => handleScroll('left')}
          disabled={scrollPosition <= 0}
        >
          <ChevronLeft size={16} />
        </button>
      )}

      <div className={styles.tabs} ref={tabsContainerRef}>
        {openTabs.map((tab, index) => (
          <div
            key={tab.path}
            className={`${styles.tab} ${
              activeTab === tab.path ? styles.active : ''
            } ${tab.modified ? styles.modified : ''}`}
            onClick={() => handleTabClick(tab.path)}
            onContextMenu={(e) => handleTabContextMenu(e, index)}
            draggable={!isMobile}
            onDragStart={(e) => handleTabDragStart(e, index)}
            onDragEnd={(e) => handleTabDragEnd(e, index)}
            onDragOver={handleTabDragOver}
            onDragEnter={(e) => handleTabDragEnter(e, index)}
            onDragLeave={(e) => handleTabDragLeave(e, index)}
            onDrop={(e) => handleTabDrop(e, index)}
            ref={(el) => assignTabRef(index, el)}
          >
            <Link href={tab.path}>
              <div className={styles.tabContent}>
                <div className={styles.tabIcon}>
                  <Image src={tab.icon} alt={tab.filename} height={18} width={18} />
                  {tab.modified && <div className={styles.modifiedIndicator} />}
                </div>
                <p className={styles.tabText}>{tab.filename}</p>
                <button
                  className={styles.closeTab}
                  onClick={(e) => closeTab(tab.path, e)}
                  title='Close tab'
                >
                  <X size={14} />
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {showScrollButtons && (
        <button
          className={`${styles.scrollButton} ${styles.scrollRight}`}
          onClick={() => handleScroll('right')}
        >
          <ChevronRight size={16} />
        </button>
      )}

      <div className={styles.tabActions}>
        <button className={styles.actionButton} title='Split editor right'>
          <SplitSquareVertical size={16} />
        </button>
        <button className={styles.actionButton} title='More actions'>
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Tab Context Menu */}
      {tabContextMenu.visible && (
        <div
          className={styles.contextMenu}
          style={{
            top: tabContextMenu.position.y,
            left: tabContextMenu.position.x
          }}
        >
          <div
            className={styles.contextMenuItem}
            onClick={() => handleTabAction('close')}
          >
            <X size={14} className={styles.contextMenuIcon} />
            <span>Close</span>
          </div>
          <div
            className={styles.contextMenuItem}
            onClick={() => handleTabAction('closeOthers')}
          >
            <span>Close Others</span>
          </div>
          <div
            className={styles.contextMenuItem}
            onClick={() => handleTabAction('closeAll')}
          >
            <span>Close All</span>
          </div>
          <div className={styles.contextMenuDivider} />
          <div
            className={styles.contextMenuItem}
            onClick={() => handleTabAction('closeLeft')}
          >
            <span>Close to the Left</span>
          </div>
          <div
            className={styles.contextMenuItem}
            onClick={() => handleTabAction('closeRight')}
          >
            <span>Close to the Right</span>
          </div>
          <div className={styles.contextMenuDivider} />
          <div
            className={styles.contextMenuItem}
            onClick={() => handleTabAction('save')}
          >
            <Save size={14} className={styles.contextMenuIcon} />
            <span>Save</span>
          </div>
          <div
            className={styles.contextMenuItem}
            onClick={() => handleTabAction('copy')}
          >
            <Copy size={14} className={styles.contextMenuIcon} />
            <span>Copy Path</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tabsbar