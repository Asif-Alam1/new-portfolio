import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronRight,
  FolderPlus,
  FilePlus,
  Trash2,
  RefreshCw,
  Search,
  X,
  MoreHorizontal,
  Copy,
  Edit,
  Download,
  Share2
} from 'lucide-react'
import styles from '../styles/Explorer.module.css'

const initialExplorerItems = [
  { name: 'home.jsx', path: '/', icon: 'react_icon.svg', lastModified: '2 days ago' },
  { name: 'about.html', path: '/about', icon: 'html_icon.svg', lastModified: '1 week ago' },
  { name: 'contact.css', path: '/contact', icon: 'css_icon.svg', lastModified: '3 days ago' },
  { name: 'projects.js', path: '/projects', icon: 'js_icon.svg', lastModified: 'Yesterday' },
  { name: 'github.md', path: '/github', icon: 'markdown_icon.svg', lastModified: 'Today' }
]

// New component for file menu
const FileContextMenu = ({ visible, position, file, onClose, onDelete, onDownload, onCopy, onEdit, onShare }) => {
  if (!visible) return null;

  const actions = [
    { icon: Edit, label: 'Edit', action: () => onEdit(file) },
    { icon: Copy, label: 'Copy Path', action: () => onCopy(file) },
    { icon: Download, label: 'Download', action: () => onDownload(file) },
    { icon: Share2, label: 'Share', action: () => onShare(file) },
    { icon: Trash2, label: 'Delete', action: () => onDelete(file) }
  ];

  return (
    <div
      className={styles.contextMenu}
      style={{ top: position.y, left: position.x }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.contextMenuHeader}>
        <Image src={`/${file.icon}`} alt={file.name} width={16} height={16} />
        <span>{file.name}</span>
      </div>
      <div className={styles.contextMenuDivider}></div>
      {actions.map((action, index) => (
        <div
          key={index}
          className={styles.contextMenuItem}
          onClick={() => {
            action.action();
            onClose();
          }}
        >
          <action.icon size={16} className={styles.contextMenuIcon} />
          <span>{action.label}</span>
        </div>
      ))}
    </div>
  );
};

const Explorer = () => {
  const [portfolioOpen, setPortfolioOpen] = useState(true)
  const [explorerItems, setExplorerItems] = useState(initialExplorerItems)
  const [filteredItems, setFilteredItems] = useState(initialExplorerItems)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isCreatingFile, setIsCreatingFile] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    file: null
  })
  const [isMobile, setIsMobile] = useState(false)
  const [dropTarget, setDropTarget] = useState(null)
  const searchInputRef = useRef(null)
  const explorerRef = useRef(null)

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Filter files when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(explorerItems)
    } else {
      const filtered = explorerItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredItems(filtered)
    }
  }, [searchTerm, explorerItems])

  useEffect(() => {
    const handleKeyDown = event => {
      // Delete key to remove selected file
      if (event.key === 'Delete' && selectedFile) {
        deleteFile(selectedFile)
      }

      // Ctrl+F to focus search
      if (event.ctrlKey && event.key === 'f' && explorerRef.current?.contains(document.activeElement)) {
        event.preventDefault()
        setShowSearch(true)
        setTimeout(() => {
          searchInputRef.current?.focus()
        }, 100)
      }

      // Escape to close search
      if (event.key === 'Escape') {
        if (showSearch) {
          setShowSearch(false)
          setSearchTerm('')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedFile, showSearch])

  // Auto-focus search input when search is shown
  useEffect(() => {
    if (showSearch) {
      searchInputRef.current?.focus()
    }
  }, [showSearch])

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu.visible && !event.target.closest(`.${styles.contextMenu}`)) {
        setContextMenu(prev => ({ ...prev, visible: false }))
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [contextMenu.visible])

  const togglePortfolio = () => setPortfolioOpen(!portfolioOpen)

  const addFile = () => {
    setIsCreatingFile(true)
    setTimeout(() => {
      const input = document.querySelector(`.${styles.newFileInput}`)
      if (input) input.focus()
    }, 100)
  }

  const handleNewFileNameSubmit = e => {
    e.preventDefault()
    if (newFileName) {
      const fileExtension = newFileName.split('.').pop()
      let icon
      switch (fileExtension) {
        case 'js':
        case 'jsx':
          icon = 'react_icon.svg'
          break
        case 'html':
          icon = 'html_icon.svg'
          break
        case 'css':
          icon = 'css_icon.svg'
          break
        case 'md':
          icon = 'markdown_icon.svg'
          break
        default:
          icon = 'file_icon.svg'
      }

      const newFile = {
        name: newFileName,
        path: `/${newFileName}`,
        icon,
        lastModified: 'Just now'
      }

      setExplorerItems(prev => [...prev, newFile])
      setNewFileName('')
      setIsCreatingFile(false)
      setSelectedFile(newFileName)

      // Show confirmation toast
      showToast(`Created ${newFileName}`)
    }
  }

  const deleteFile = fileToDelete => {
    setExplorerItems(explorerItems.filter(item => item.name !== fileToDelete))
    if (selectedFile === fileToDelete) {
      setSelectedFile(null)
    }

    // Show confirmation toast
    showToast(`Deleted ${fileToDelete}`)
  }

  const refreshExplorer = () => {
    setExplorerItems([...initialExplorerItems])
    setSearchTerm('')
    showToast('Explorer refreshed')
  }

  const showToast = (message) => {
    // Implementation would go here - could be a state-based notification
    console.log('TOAST:', message)
  }

  const handleContextMenu = (e, file) => {
    e.preventDefault()
    setContextMenu({
      visible: true,
      position: { x: e.clientX, y: e.clientY },
      file
    })
  }

  const handleFileActions = {
    delete: (file) => deleteFile(file.name),
    download: (file) => {
      console.log('Downloading', file.name)
      showToast(`Downloaded ${file.name}`)
    },
    copy: (file) => {
      navigator.clipboard.writeText(file.path)
      showToast('Path copied to clipboard')
    },
    edit: (file) => {
      console.log('Editing', file.name)
      showToast(`Editing ${file.name}`)
    },
    share: (file) => {
      console.log('Sharing', file.name)
      showToast(`Sharing link created for ${file.name}`)
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e, file) => {
    e.dataTransfer.setData('text/plain', file.name)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e, file) => {
    e.preventDefault()
    setDropTarget(file.name)
  }

  const handleDragLeave = () => {
    setDropTarget(null)
  }

  const handleDrop = (e, targetFile) => {
    e.preventDefault()
    setDropTarget(null)

    const sourceName = e.dataTransfer.getData('text/plain')
    if (sourceName === targetFile.name) return

    const sourceIndex = explorerItems.findIndex(item => item.name === sourceName)
    const targetIndex = explorerItems.findIndex(item => item.name === targetFile.name)

    if (sourceIndex !== -1 && targetIndex !== -1) {
      const newItems = [...explorerItems]
      const [item] = newItems.splice(sourceIndex, 1)
      newItems.splice(targetIndex, 0, item)
      setExplorerItems(newItems)
      showToast(`Moved ${sourceName} to new position`)
    }
  }

  return (
    <div className={styles.explorer} ref={explorerRef}>
      <div className={styles.explorerHeader}>
        <p className={styles.title}>Explorer</p>
        <div className={styles.actions}>
          <button
            className={`${styles.actionButton} ${showSearch ? styles.active : ''}`}
            onClick={() => setShowSearch(!showSearch)}
            title="Search Files (Ctrl+F)"
          >
            <Search size={16} className={styles.actionIcon} />
          </button>
          <button
            className={styles.actionButton}
            onClick={() => alert('Create folder functionality to be implemented')}
            title="New Folder"
          >
            <FolderPlus size={16} className={styles.actionIcon} />
          </button>
          <button
            className={styles.actionButton}
            onClick={addFile}
            title="New File"
          >
            <FilePlus size={16} className={styles.actionIcon} />
          </button>
          <button
            className={styles.actionButton}
            onClick={refreshExplorer}
            title="Refresh Explorer"
          >
            <RefreshCw size={16} className={styles.actionIcon} />
          </button>
        </div>
      </div>

      {/* Search input */}
      {showSearch && (
        <div className={styles.searchContainer}>
          <Search size={14} className={styles.searchIcon} />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search files..."
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              className={styles.clearSearch}
              onClick={() => {
                setSearchTerm('')
                searchInputRef.current?.focus()
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      <div className={styles.explorerContent}>
        <div className={styles.heading} onClick={togglePortfolio}>
          <ChevronRight
            className={`${styles.chevron} ${portfolioOpen ? styles.rotated : ''}`}
          />
          <span>Portfolio</span>
          <span className={styles.itemCount}>{filteredItems.length}</span>
        </div>

        <div
          className={`${styles.files} ${portfolioOpen ? styles.expanded : ''}`}
        >
          {filteredItems.length === 0 && (
            <div className={styles.emptyState}>
              <p>No files found</p>
              {searchTerm && (
                <button
                  className={styles.clearButton}
                  onClick={() => setSearchTerm('')}
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {filteredItems.map(item => (
            <div
              key={item.name}
              className={`${styles.file} ${
                selectedFile === item.name ? styles.selected : ''
              } ${dropTarget === item.name ? styles.dropTarget : ''}`}
              onClick={() => setSelectedFile(item.name)}
              onContextMenu={(e) => handleContextMenu(e, item)}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, item)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item)}
            >
              <Link href={item.path}>
                <div className={styles.fileContent}>
                  <div className={styles.fileIcon}>
                    <Image
                      src={`/${item.icon}`}
                      alt='File Icon'
                      height={18}
                      width={18}
                    />
                  </div>
                  <div className={styles.fileDetails}>
                    <p className={styles.fileName}>{item.name}</p>
                    {!isMobile && (
                      <p className={styles.fileDate}>{item.lastModified}</p>
                    )}
                  </div>
                </div>
              </Link>

              <div className={styles.fileActions}>
                <button
                  className={styles.fileMenuButton}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleContextMenu(
                      { preventDefault: () => {}, clientX: e.clientX, clientY: e.clientY },
                      item
                    )
                  }}
                >
                  <MoreHorizontal size={14} />
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteFile(item.name)
                  }}
                  title='Delete file'
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {isCreatingFile && (
            <form onSubmit={handleNewFileNameSubmit} className={styles.newFileForm}>
              <div className={styles.fileIcon}>
                <FilePlus size={18} />
              </div>
              <input
                type='text'
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder='filename.ext'
                className={styles.newFileInput}
                autoFocus
              />
            </form>
          )}
        </div>
      </div>

      {/* Context Menu */}
      <FileContextMenu
        visible={contextMenu.visible}
        position={contextMenu.position}
        file={contextMenu.file}
        onClose={() => setContextMenu(prev => ({ ...prev, visible: false }))}
        onDelete={handleFileActions.delete}
        onDownload={handleFileActions.download}
        onCopy={handleFileActions.copy}
        onEdit={handleFileActions.edit}
        onShare={handleFileActions.share}
      />
    </div>
  )
}

export default Explorer