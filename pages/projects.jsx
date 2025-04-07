'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Code, ExternalLink, GitBranch, Star, Eye, Tag, Calendar, Filter, Info, X, ChevronRight, Maximize2, Minimize2, CornerDownLeft } from 'lucide-react'
import { getProjects } from './api/projects'
import CustomHead from '../components/Head'
import styles from '../styles/ProjectsPage.module.css'

const ProjectsPage = ({ projects }) => {
  const [filter, setFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProjects, setFilteredProjects] = useState(projects)
  const [selectedProject, setSelectedProject] = useState(null)
  const [sortMethod, setSortMethod] = useState('default')
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [terminalCommand, setTerminalCommand] = useState('')
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'system', text: 'Projects Explorer Terminal v1.0.0' },
    { type: 'system', text: 'Type "help" for available commands.' }
  ])
  const searchInputRef = useRef(null)
  const terminalInputRef = useRef(null)
  const [isDetailView, setIsDetailView] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [lastInteraction, setLastInteraction] = useState(Date.now())
  const [hoveredProject, setHoveredProject] = useState(null)

  const allTags = ['All', ...new Set(projects.flatMap(project => project.tags))]

  // Process projects based on filters and sort methods
  useEffect(() => {
    let filtered = projects.filter(
      project =>
        (filter === 'All' || project.tags.includes(filter)) &&
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Apply sorting
    if (sortMethod === 'name-asc') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortMethod === 'name-desc') {
      filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name))
    } else if (sortMethod === 'newest') {
      // Assuming higher IDs are newer projects
      filtered = [...filtered].sort((a, b) => b.id - a.id)
    } else if (sortMethod === 'oldest') {
      filtered = [...filtered].sort((a, b) => a.id - b.id)
    }

    setFilteredProjects(filtered)
  }, [filter, searchTerm, projects, sortMethod])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus search with ctrl+s
      if (e.ctrlKey && e.key === 's' && !terminalOpen) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }

      // Toggle terminal with ctrl+`
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault()
        setTerminalOpen(prev => !prev)
      }

      // Focus terminal when opened
      if (terminalOpen && terminalInputRef.current) {
        terminalInputRef.current.focus()
      }

      // Toggle detail view with ctrl+d
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        setIsDetailView(prev => !prev)
      }

      // Escape to close modal
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [terminalOpen, selectedProject])

  // Terminal functions
  const handleTerminalSubmit = (e) => {
    e.preventDefault()

    if (!terminalCommand.trim()) return

    // Add command to terminal output
    setTerminalOutput(prev => [...prev, { type: 'command', text: terminalCommand }])

    // Process command
    const commandLower = terminalCommand.toLowerCase().trim()
    const args = commandLower.split(' ')
    const command = args[0]

    switch(command) {
      case 'help':
        setTerminalOutput(prev => [...prev,
          { type: 'output', text: 'Available commands:' },
          { type: 'output', text: '  search [term]    - Search for projects' },
          { type: 'output', text: '  filter [tag]     - Filter projects by tag' },
          { type: 'output', text: '  list             - List all projects' },
          { type: 'output', text: '  sort [method]    - Sort projects (name-asc, name-desc, newest, oldest)' },
          { type: 'output', text: '  view [id/name]   - View project details' },
          { type: 'output', text: '  open [id/name]   - Open project in modal' },
          { type: 'output', text: '  tags             - List all available tags' },
          { type: 'output', text: '  clear            - Clear terminal' },
          { type: 'output', text: '  exit             - Close terminal' }
        ])
        break

      case 'search':
        const searchQuery = args.slice(1).join(' ')
        if (searchQuery) {
          setSearchTerm(searchQuery)
          setTerminalOutput(prev => [...prev, { type: 'output', text: `Searching for "${searchQuery}"...` }])
        } else {
          setTerminalOutput(prev => [...prev, { type: 'error', text: 'Usage: search [term]' }])
        }
        break

      case 'filter':
        const tagQuery = args.slice(1).join(' ')
        if (tagQuery) {
          if (allTags.map(t => t.toLowerCase()).includes(tagQuery.toLowerCase())) {
            const exactTag = allTags.find(t => t.toLowerCase() === tagQuery.toLowerCase())
            setFilter(exactTag)
            setTerminalOutput(prev => [...prev, { type: 'output', text: `Filtering by "${exactTag}"` }])
          } else {
            setTerminalOutput(prev => [...prev, { type: 'error', text: `Tag "${tagQuery}" not found. Use "tags" command to see available tags.` }])
          }
        } else {
          setTerminalOutput(prev => [...prev, { type: 'error', text: 'Usage: filter [tag]' }])
        }
        break

      case 'list':
        const projectsList = filteredProjects.map(p => `  ${p.id}: ${p.name} [${p.tags.join(', ')}]`)
        if (projectsList.length > 0) {
          setTerminalOutput(prev => [
            ...prev,
            { type: 'output', text: `Found ${projectsList.length} projects:` },
            ...projectsList.map(text => ({ type: 'output', text }))
          ])
        } else {
          setTerminalOutput(prev => [...prev, { type: 'output', text: 'No projects found matching current filters.' }])
        }
        break

      case 'sort':
        const sortType = args[1]
        if (['name-asc', 'name-desc', 'newest', 'oldest'].includes(sortType)) {
          setSortMethod(sortType)
          setTerminalOutput(prev => [...prev, { type: 'output', text: `Sorting projects by ${sortType}` }])
        } else {
          setTerminalOutput(prev => [...prev, { type: 'error', text: 'Usage: sort [name-asc|name-desc|newest|oldest]' }])
        }
        break

      case 'view':
      case 'open':
        const projectQuery = args.slice(1).join(' ')
        if (projectQuery) {
          // Try to find by ID or name
          const projectById = projects.find(p => p.id.toString() === projectQuery)
          const projectByName = projects.find(p => p.name.toLowerCase() === projectQuery.toLowerCase())
          const project = projectById || projectByName

          if (project) {
            if (command === 'view') {
              setTerminalOutput(prev => [
                ...prev,
                { type: 'output', text: `Project: ${project.name}` },
                { type: 'output', text: `ID: ${project.id}` },
                { type: 'output', text: `Tags: ${project.tags.join(', ')}` },
                { type: 'output', text: `Description: ${project.description}` },
                { type: 'output', text: `Has demo: ${project.demo ? 'Yes' : 'No'}` },
                { type: 'output', text: `Has source code: ${project.source_code ? 'Yes' : 'No'}` }
              ])
            } else {
              setSelectedProject(project)
              setTerminalOutput(prev => [...prev, { type: 'output', text: `Opening project "${project.name}"` }])
            }
          } else {
            setTerminalOutput(prev => [...prev, { type: 'error', text: `Project "${projectQuery}" not found` }])
          }
        } else {
          setTerminalOutput(prev => [...prev, { type: 'error', text: `Usage: ${command} [id/name]` }])
        }
        break

      case 'tags':
        setTerminalOutput(prev => [
          ...prev,
          { type: 'output', text: 'Available tags:' },
          ...allTags.map(tag => ({ type: 'output', text: `  ${tag}` }))
        ])
        break

      case 'clear':
        setTerminalOutput([
          { type: 'system', text: 'Projects Explorer Terminal v1.0.0' },
          { type: 'system', text: 'Type "help" for available commands.' }
        ])
        break

      case 'exit':
        setTerminalOpen(false)
        break

      default:
        setTerminalOutput(prev => [...prev, { type: 'error', text: `Command not found: "${command}". Type "help" for available commands.` }])
    }

    // Clear command
    setTerminalCommand('')
  }

  return (
    <>
      <CustomHead
        title='Portfolio Projects'
        description="Explore Asif Alam's diverse portfolio of web development projects, showcasing expertise in Next.js, React.js, and more."
      />
      <div className={styles.projectsContainer}>


        {/* Code-like header */}
        <div className={styles.codeHeadingContainer}>
          <span className={styles.codeLine}>
            <span className={styles.codeComment}>// Explore projects developed by Asif Alam</span>
          </span>
          <span className={styles.codeLine}>
            <span className={styles.codeKeyword}>const</span> <span className={styles.codeVariable}>projects</span> <span className={styles.codeOperator}>=</span> <span className={styles.codeBracket}>{`{`}</span>
          </span>
          <h2 className={styles.heading}>My Tech Journey: Projects & Creations</h2>
          <span className={styles.codeLine}>
            <span className={styles.codeBracket}>{`}`}</span><span className={styles.codeSemicolon}>;</span>
          </span>
        </div>

        {/* Search and filter section */}
        <div className={styles.filterContainer}>
          {/* Search input with keyboard shortcut indicator */}
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} />
            <input
              ref={searchInputRef}
              type='text'
              placeholder='Search projects...'
              className={styles.searchInput}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <div className={styles.searchShortcut} title="Keyboard shortcut: Ctrl+S">
              <kbd>Ctrl</kbd>+<kbd>S</kbd>
            </div>
          </div>

          {/* Filter and sort controls */}
          <div className={styles.controlsRow}>
            <div className={styles.tagFilter}>
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`${styles.tagButton} ${
                    filter === tag ? styles.active : ''
                  }`}
                  onClick={() => setFilter(tag)}>
                  {tag !== 'All' && <Tag size={12} />}
                  {tag}
                </button>
              ))}
            </div>

            <div className={styles.sortControls}>
              <Filter size={14} />
              <select
                className={styles.sortSelect}
                value={sortMethod}
                onChange={(e) => setSortMethod(e.target.value)}
              >
                <option value="default">Default Order</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects display */}
        {!isDetailView ? (
          <div className={styles.projectGrid} role="list">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => {
                  setSelectedProject(project)
                  setLastInteraction(Date.now())
                }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                isHovered={hoveredProject === project.id}
              />
            ))}
          </div>
        ) : (
          <div className={styles.projectList} role="list">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className={styles.projectListItem}
                onClick={() => {
                  setSelectedProject(project)
                  setLastInteraction(Date.now())
                }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className={styles.projectListContent}>
                  <h3 className={styles.projectListName}>
                    {project.name}
                  </h3>
                  <p className={styles.projectListDescription}>
                    {project.description?.length > 120
                      ? project.description.substring(0, 120) + '...'
                      : project.description}
                  </p>
                  <div className={styles.projectListMeta}>
                    <div className={styles.projectListTags}>
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className={`${styles.projectListTag} ${styles[tag] || styles.defaultTag}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className={styles.projectListButtons}>
                      {project.demo && (
                        <Link
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.projectListButton}
                          onClick={(e) => e.stopPropagation()}
                        >
                        <>
                          <ExternalLink size={14} />
                          <span>Demo</span>
                          </>
                        </Link>
                      )}
                      {project.source_code && (
                        <Link
                          href={project.source_code}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.projectListButton}
                          onClick={(e) => e.stopPropagation()}
                        >
                        <>
                          <Code size={14} />
                          <span>Code</span>
                          </>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.projectListImage}>
                  <Image
                    src={project.image}
                    width={150}
                    height={84}
                    alt={project.name}
                    className={styles.projectListImageContent}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>
              <Info size={48} strokeWidth={1} />
            </div>
            <p className={styles.noResultsText}>
              No projects found. Try adjusting your search or filter.
            </p>
            <button
              className={styles.noResultsButton}
              onClick={() => {
                setSearchTerm('')
                setFilter('All')
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Terminal for advanced interaction */}
        {terminalOpen && (
          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
              <div className={styles.terminalTitle}>Projects Terminal</div>
              <button
                className={styles.terminalClose}
                onClick={() => setTerminalOpen(false)}
              >
                <X size={14} />
              </button>
            </div>
            <div className={styles.terminalBody}>
              {terminalOutput.map((output, index) => (
                <div
                  key={index}
                  className={`${styles.terminalLine} ${styles[output.type]}`}
                >
                  {output.type === 'command'
                    ? <><span className={styles.terminalPrompt}>$</span> {output.text}</>
                    : output.text
                  }
                </div>
              ))}
            </div>
            <form onSubmit={handleTerminalSubmit} className={styles.terminalForm}>
              <span className={styles.terminalPrompt}>$</span>
              <input
                ref={terminalInputRef}
                type="text"
                className={styles.terminalInput}
                value={terminalCommand}
                onChange={(e) => setTerminalCommand(e.target.value)}
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
              <button type="submit" className={styles.terminalEnter}>
                <CornerDownLeft size={14} />
              </button>
            </form>
          </div>
        )}

        {/* Keyboard shortcuts help */}
        <div className={styles.keyboardHelp}>
          <div className={styles.shortcutItem}>
            <kbd>Ctrl</kbd>+<kbd>S</kbd> Search
          </div>
          <div className={styles.shortcutItem}>
            <kbd>Ctrl</kbd>+<kbd>D</kbd> Toggle View
          </div>
          <div className={styles.shortcutItem}>
            <kbd>Ctrl</kbd>+<kbd>`</kbd> Terminal
          </div>
          <div className={styles.shortcutItem}>
            <kbd>Esc</kbd> Close Modal
          </div>
        </div>
      </div>

      {/* Project Modal with Tabs */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </>
  )
}

const ProjectCard = ({ project, onClick, onMouseEnter, onMouseLeave, isHovered }) => {
  return (
    <div
      className={`${styles.card} ${isHovered ? styles.hovered : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="listitem"
    >
      <div className={styles.imageContainer}>
        <Image
          src={project.image}
          width={400}
          height={225}
          alt={project.name}
          className={styles.image}
        />
        <div className={`${styles.overlay} ${isHovered ? styles.visible : ''}`}>
          <h3 className={styles.projectName}>{project.name}</h3>
          <div className={styles.tags}>
            {project.tags.map(tag => (
              <span
                key={tag}
                className={`${styles.tag} ${styles[tag] || styles.defaultTag}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.cardFooter}>
        <div className={styles.projectStats}>
          {project.demo && (
            <span className={styles.projectStat} title="Live Demo Available">
              <ExternalLink size={14} />
            </span>
          )}
          {project.source_code && (
            <span className={styles.projectStat} title="Source Code Available">
              <Code size={14} />
            </span>
          )}
        </div>
        <div className={styles.projectTitle}>
          {project.name}
        </div>
      </div>
    </div>
  )
}

const ProjectModal = ({ project, onClose, activeTab, setActiveTab }) => {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 300) // Match animation duration
  }

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
      onClick={handleClose}
    >
      <div
        className={`${styles.modalContent} ${isClosing ? styles.closing : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header with close button and project title */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            <span className={styles.modalTitlePath}>projects /</span> {project.name}
          </h3>
          <button className={styles.closeButton} onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tabs navigation */}
        <div className={styles.modalTabs}>
          <button
            className={`${styles.modalTab} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${styles.modalTab} ${activeTab === 'details' ? styles.active : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`${styles.modalTab} ${activeTab === 'links' ? styles.active : ''}`}
            onClick={() => setActiveTab('links')}
          >
            Links
          </button>
        </div>

        {/* Tab content */}
        <div className={styles.modalBody}>
          {activeTab === 'overview' && (
            <>
              <div className={styles.modalImageContainer}>
                <Image
                  src={project.image}
                  layout='fill'
                  objectFit='cover'
                  alt={project.name}
                  className={styles.modalImage}
                />
                <div className={styles.modalImageOverlay}></div>
              </div>
              <p className={styles.modalDescription}>{project.description}</p>
              <div className={styles.modalTags}>
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className={`${styles.tag} ${styles[tag] || styles.defaultTag}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}

          {activeTab === 'details' && (
            <div className={styles.modalDetails}>
              <div className={styles.detailSection}>
                <h4 className={styles.detailHeading}>
                  <Code size={16} className={styles.detailIcon} />
                  Technologies
                </h4>
                <div className={styles.detailTags}>
                  {project.tags.map(tag => (
                    <div key={tag} className={styles.detailTag}>
                      <div className={`${styles.tagIndicator} ${styles[tag]}`}></div>
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.detailSection}>
                <h4 className={styles.detailHeading}>
                  <Info size={16} className={styles.detailIcon} />
                  Project Info
                </h4>
                <div className={styles.detailInfo}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Project ID:</span>
                    <span className={styles.detailValue}>{project.id}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Has Demo:</span>
                    <span className={styles.detailValue}>
                      {project.demo ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Source Code:</span>
                    <span className={styles.detailValue}>
                      {project.source_code ? 'Available' : 'Private'}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h4 className={styles.detailHeading}>
                  <Calendar size={16} className={styles.detailIcon} />
                  Description
                </h4>
                <div className={styles.detailDescription}>
                  <p>{project.description}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className={styles.modalLinks}>
              <div className={styles.linksContainer}>
                {project.source_code && (
                  <Link
                    href={project.source_code}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles.linkCard}>
                    <>
                    <div className={styles.linkIcon}>
                      <GitBranch size={24} />
                    </div>
                    <div className={styles.linkContent}>
                      <h4>Source Code</h4>
                      <p>View the project repository</p>
                    </div>
                    <div className={styles.linkArrow}>
                      <ExternalLink size={16} />
                    </div>
                    </>
                  </Link>
                )}

                {project.demo && (
                  <Link
                    href={project.demo}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles.linkCard}>
                    <>
                    <div className={styles.linkIcon}>
                      <ExternalLink size={24} />
                    </div>
                    <div className={styles.linkContent}>
                      <h4>Live Demo</h4>
                      <p>Try the live project</p>
                    </div>
                    <div className={styles.linkArrow}>
                      <ExternalLink size={16} />
                    </div>
                    </>
                  </Link>
                )}

                <div className={styles.codeSnippet}>
                  <div className={styles.codeHeader}>
                    <span>project-info.json</span>
                  </div>
                  <pre className={styles.codeContent}>
{`{
  "name": "${project.name}",
  "id": ${project.id},
  "tags": [${project.tags.map(t => `"${t}"`).join(', ')}],
  "links": {
    "demo": ${project.demo ? `"${project.demo}"` : 'null'},
    "source": ${project.source_code ? `"${project.source_code}"` : 'null'}
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with actions */}
        <div className={styles.modalFooter}>
          <div className={styles.modalCta}>
            {project.source_code && (
              <Link
                href={project.source_code}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.modalButton}>
                <>
                <Code size={18} />
                <span>Source Code</span>
                </>
              </Link>
            )}
            {project.demo && (
              <Link
                href={project.demo}
                target='_blank'
                rel='noopener noreferrer'
                className={`${styles.modalButton} ${styles.primaryButton}`}>
                <>
                <ExternalLink size={18} />
                <span>Live Demo</span>
                </>
              </Link>
            )}
          </div>
          <div className={styles.modalKeyboardHelp}>
            Press <kbd>Esc</kbd> to close
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const projects = getProjects()

  return {
    props: { title: 'Portfolio Projects', projects }
  }
}

export default ProjectsPage