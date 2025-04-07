'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import GitHubCalendar from 'react-github-calendar'
import {
  Search,
  Star,
  GitFork,
  Eye,
  Github,
  ExternalLink,
  AlertTriangle,
  Code,
  Clock,
  Filter,
  SortAsc,
  SortDesc,
  X,
  Terminal
} from 'lucide-react'
import CustomHead from '../components/Head'
import styles from '../styles/GithubPage.module.css'

const GithubPage = ({ repos, user, error }) => {
  // State management
  const [filter, setFilter] = useState('')
  const [filteredRepos, setFilteredRepos] = useState(repos || [])
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [sortBy, setSortBy] = useState('stars') // stars, forks, updated
  const [sortDirection, setSortDirection] = useState('desc')
  const [activeTab, setActiveTab] = useState('repositories')
  const [hoveredRepo, setHoveredRepo] = useState(null)
  const [isClosing, setIsClosing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const searchInputRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  // Filter and sort repositories
  useEffect(() => {
    if (!repos) return;

    const filtered = repos.filter(
      repo =>
        repo.name.toLowerCase().includes(filter.toLowerCase()) ||
        (repo.description &&
          repo.description.toLowerCase().includes(filter.toLowerCase()))
    )

    // Sort the filtered repos
    const sorted = [...filtered].sort((a, b) => {
      let valueA, valueB;

      if (sortBy === 'stars') {
        valueA = a.stargazers_count
        valueB = b.stargazers_count
      } else if (sortBy === 'forks') {
        valueA = a.forks
        valueB = b.forks
      } else if (sortBy === 'updated') {
        valueA = new Date(a.updated_at)
        valueB = new Date(b.updated_at)
      } else {
        valueA = a.stargazers_count
        valueB = b.stargazers_count
      }

      return sortDirection === 'desc' ? valueB - valueA : valueA - valueB
    })

    setFilteredRepos(sorted)
  }, [filter, repos, sortBy, sortDirection])

  // Animation entry effect
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, 100)
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }

      // Escape to close modal
      if (e.key === 'Escape' && selectedRepo) {
        handleCloseModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedRepo])

  // Modal handlers
  const openModal = (repo) => {
    setSelectedRepo(repo)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      setSelectedRepo(null)
      setIsModalOpen(false)
      setIsClosing(false)
    }, 300)
  }

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')
  }

  // GitHub contribution chart theme
  const theme = {
    level0: '#161B22',
    level1: '#0e4429',
    level2: '#006d32',
    level3: '#26a641',
    level4: '#39d353'
  }

  // Generate language statistics
  const generateLanguageStats = () => {
    if (!repos) return {}

    const languages = {}
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1
      }
    })

    return languages
  }

  const languageStats = generateLanguageStats()

  // Common language colors
  const languageColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Python: '#3572A5',
    Java: '#b07219',
    'C#': '#178600',
    PHP: '#4F5D95'
  }

  // Calculate the timeframe since last update
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) return `${Math.floor(interval)} years ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    return `${Math.floor(seconds)} seconds ago`;
  };

  // Handle error state
  if (error) {
    return (
      <div className={styles.githubContainer}>
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <AlertTriangle size={48} className={styles.errorIcon} />
            <h2 className={styles.errorTitle}>GitHub Data Unavailable</h2>
            <p className={styles.errorDescription}>{error}</p>
            <p className={styles.errorSubtext}>Please try again later or check your API configuration.</p>
            <Link href="/" className={styles.errorButton}>
              <ExternalLink size={16} />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomHead
        title='GitHub Summary'
        description="View Asif Alam's GitHub profile, top repositories, and contribution graph. Discover his open-source projects and coding activity."
      />

      <div className={`${styles.githubContainer} ${isVisible ? styles.visible : ''}`}>


        {/* User profile section */}
        {user ? (
          <div className={styles.userInfo}>
            <div className={styles.userDetails}>
              <div className={styles.avatarContainer}>
                <Image
                  src={user.avatar_url}
                  className={styles.avatar}
                  alt={`${user.name || user.login}'s avatar`}
                  width={100}
                  height={100}
                />
                <div className={styles.statusIndicator}></div>
              </div>
              <div>
                <h2 className={styles.username}>{user.name || user.login}</h2>
                <div className={styles.loginNameBadge}>
                  <Github size={14} />
                  <span>{user.login}</span>
                </div>
                <p className={styles.bio}>{user.bio || "Software Engineer building the future"}</p>

                <div className={styles.userMeta}>
                  {user.location && (
                    <div className={styles.metaItem}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.blog && (
                    <Link
                      href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.metaLink}
                    >
                      <ExternalLink size={14} />
                      <span>Website</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <h3>{user.public_repos}</h3>
                <p>Repositories</p>
              </div>
              <div className={styles.stat}>
                <h3>{user.followers}</h3>
                <p>Followers</p>
              </div>
              <div className={styles.stat}>
                <h3>{user.following}</h3>
                <p>Following</p>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.userInfoSkeleton}>
            <div className={styles.avatarSkeleton}></div>
            <div className={styles.contentSkeleton}>
              <div className={styles.skeletonLine}></div>
              <div className={styles.skeletonLine}></div>
              <div className={styles.skeletonLine}></div>
            </div>
          </div>
        )}

        {/* Navigation tabs */}
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab('repositories')}
            className={`${styles.tab} ${activeTab === 'repositories' ? styles.activeTab : ''}`}
          >
            <Code size={16} />
            <span>Repositories</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`${styles.tab} ${activeTab === 'activity' ? styles.activeTab : ''}`}
          >
            <Clock size={16} />
            <span>Activity</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`${styles.tab} ${activeTab === 'stats' ? styles.activeTab : ''}`}
          >
            <Terminal size={16} />
            <span>Statistics</span>
          </button>
        </div>

        {/* Repositories tab content */}
        {activeTab === 'repositories' && (
          <>
            {repos && repos.length > 0 ? (
              <>
                <div className={styles.controlsContainer}>
                  <h2 className={styles.sectionTitle}>
                    <Code size={20} />
                    <span>Top Repositories</span>
                    <span className={styles.count}>({filteredRepos.length})</span>
                  </h2>

                  <div className={styles.controlsRow}>
                    <div className={styles.searchContainer}>
                      <Search className={styles.searchIcon} />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search repositories..."
                        className={styles.searchInput}
                        onChange={(e) => setFilter(e.target.value)}
                      />
                      <div className={styles.searchShortcut}>Ctrl+K</div>
                    </div>

                    <div className={styles.sortControls}>
                      <select
                        className={styles.sortSelect}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="stars">Stars</option>
                        <option value="forks">Forks</option>
                        <option value="updated">Updated</option>
                      </select>

                      <button
                        className={styles.sortButton}
                        onClick={toggleSortDirection}
                        title={sortDirection === 'desc' ? 'Sort Descending' : 'Sort Ascending'}
                      >
                        {sortDirection === 'desc'
                          ? <SortDesc className={styles.sortIcon} />
                          : <SortAsc className={styles.sortIcon} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.repoContainer}>
                  {filteredRepos.length > 0 ? (
                    filteredRepos.map(repo => (
                      <div
                        key={repo.id}
                        className={`${styles.card} ${hoveredRepo === repo.id ? styles.hovered : ''}`}
                        onClick={() => openModal(repo)}
                        onMouseEnter={() => setHoveredRepo(repo.id)}
                        onMouseLeave={() => setHoveredRepo(null)}
                      >
                        <div className={styles.content}>
                          <div className={styles.cardHeader}>
                            <h3 className={styles.title}>{repo.name}</h3>
                            {repo.language && (
                              <div className={styles.language}>
                                <span
                                  className={styles.languageDot}
                                  style={{ backgroundColor: languageColors[repo.language] || '#8B949E' }}
                                ></span>
                                <span>{repo.language}</span>
                              </div>
                            )}
                          </div>

                          <p className={styles.description}>
                            {repo.description || "No description provided"}
                          </p>

                          <div className={styles.timeInfo}>
                            <Clock size={14} className={styles.icon} />
                            <span>Updated {getTimeAgo(repo.updated_at)}</span>
                          </div>
                        </div>

                        <div className={styles.stats}>
                          <div className={styles.statRow}>
                            <div className={styles.stat}>
                              <Star className={styles.icon} /> {repo.stargazers_count}
                            </div>

                            <div className={styles.stat}>
                              <Eye className={styles.icon} /> {repo.watchers}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyState}>
                      <Search size={40} className={styles.emptyIcon} />
                      <p className={styles.emptyTitle}>No repositories found</p>
                      <p className={styles.emptyText}>Try adjusting your search or filters</p>
                      <button
                        onClick={() => setFilter('')}
                        className={styles.emptyButton}
                      >
                        Clear Search
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading repositories...</p>
              </div>
            )}
          </>
        )}

        {/* Activity tab content */}
        {activeTab === 'activity' && user && (
          <div className={styles.activitySection}>
            <h2 className={styles.sectionTitle}>
              <Clock size={20} />
              <span>Contribution Activity</span>
            </h2>

            <div className={styles.calendarContainer}>
              <GitHubCalendar
                username={user.login || process.env.NEXT_PUBLIC_GITHUB_USERNAME}
                theme={theme}
                hideColorLegend={false}
                hideTotalCount={false}
                hideMonthLabels={false}
                className={styles.calendar}
                blockSize={12}
                blockMargin={4}
                fontSize={12}
                blockRadius={2}
              />
            </div>

            <div className={styles.activityGrid}>
              <div className={styles.activityCard}>
                <h3 className={styles.activityCardTitle}>
                  <Clock size={16} />
                  <span>Recent Activity</span>
                </h3>
                <div className={styles.activityList}>
                  {repos && repos.slice(0, 3).map((repo, index) => (
                    <div key={index} className={styles.activityItem}>
                      <div className={styles.activityIndicator} style={{
                        backgroundColor: index === 0 ? '#10B981' : index === 1 ? '#2563EB' : '#6366F1'
                      }}></div>
                      <div className={styles.activityContent}>
                        <p className={styles.activityName}>{repo.name}</p>
                        <p className={styles.activityDate}>
                          Updated {new Date(repo.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.activityCard}>
                <h3 className={styles.activityCardTitle}>
                  <Star size={16} />
                  <span>Most Starred</span>
                </h3>
                <div className={styles.activityList}>
                  {repos && [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 3).map((repo, index) => (
                    <div key={index} className={styles.activityItem}>
                      <div className={styles.activityIndicator} style={{
                        backgroundColor: index === 0 ? '#FBBF24' : index === 1 ? '#F59E0B' : '#D97706'
                      }}></div>
                      <div className={styles.activityContent}>
                        <p className={styles.activityName}>{repo.name}</p>
                        <p className={styles.activityDate}>
                          {repo.stargazers_count} {repo.stargazers_count === 1 ? 'star' : 'stars'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          </div>
        )}

        {/* Stats tab content */}
        {activeTab === 'stats' && (
          <div className={styles.statsSection}>
            <h2 className={styles.sectionTitle}>
              <Terminal size={20} />
              <span>GitHub Statistics</span>
            </h2>

            <div className={styles.statsGrid}>
              <div className={styles.statsCard}>
                <h3 className={styles.statsCardTitle}>Programming Languages</h3>
                {Object.keys(languageStats).length > 0 ? (
                  <div className={styles.languageStats}>
                    {Object.entries(languageStats)
                      .sort(([, countA], [, countB]) => countB - countA)
                      .map(([language, count], index) => {
                        const percentage = (count / repos.length) * 100;
                        return (
                          <div key={language} className={styles.languageRow}>
                            <div className={styles.languageInfo}>
                              <div
                                className={styles.languageDot}
                                style={{ backgroundColor: languageColors[language] || '#8B949E' }}
                              ></div>
                              <span className={styles.languageName}>{language}</span>
                              <span className={styles.languagePercent}>{percentage.toFixed(1)}%</span>
                            </div>
                            <div className={styles.languageBar}>
                              <div
                                className={styles.languageProgress}
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: languageColors[language] || '#8B949E'
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                ) : (
                  <div className={styles.emptyLanguages}>
                    <Code size={24} />
                    <p>No language data available</p>
                  </div>
                )}
              </div>

              <div className={styles.statsCard}>
                <h3 className={styles.statsCardTitle}>Repository Statistics</h3>
                <div className={styles.statBoxes}>
                  <div className={styles.statBox}>
                    <div className={styles.statBoxHeader}>
                      <Star className={styles.statBoxIcon} />
                      <span>Total Stars</span>
                    </div>
                    <div className={styles.statBoxValue}>
                      {repos ? repos.reduce((sum, repo) => sum + repo.stargazers_count, 0) : 0}
                    </div>
                  </div>

                  <div className={styles.statBox}>
                    <div className={styles.statBoxHeader}>
                      <GitFork className={styles.statBoxIcon} />
                      <span>Total Forks</span>
                    </div>
                    <div className={styles.statBoxValue}>
                      {repos ? repos.reduce((sum, repo) => sum + repo.forks, 0) : 0}
                    </div>
                  </div>

                  <div className={styles.statBox}>
                    <div className={styles.statBoxHeader}>
                      <Eye className={styles.statBoxIcon} />
                      <span>Total Watchers</span>
                    </div>
                    <div className={styles.statBoxValue}>
                      {repos ? repos.reduce((sum, repo) => sum + repo.watchers, 0) : 0}
                    </div>
                  </div>

                  <div className={styles.statBox}>
                    <div className={styles.statBoxHeader}>
                      <Code className={styles.statBoxIcon} />
                      <span>Repositories</span>
                    </div>
                    <div className={styles.statBoxValue}>
                      {repos ? repos.length : 0}
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        )}


      </div>

      {/* Repository Modal */}
      {selectedRepo && isModalOpen && (
        <div
          className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
          onClick={handleCloseModal}
        >
          <div
            className={`${styles.modalContent} ${isClosing ? styles.closing : ''}`}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <Code className={styles.modalTitleIcon} />
                {selectedRepo.name}
              </h3>
              <button
                className={styles.closeButton}
                onClick={handleCloseModal}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <div className={styles.topicsList}>
                  {selectedRepo.topics && selectedRepo.topics.map(topic => (
                    <span key={topic} className={styles.topicTag}>
                      {topic}
                    </span>
                  ))}
                  {selectedRepo.language && (
                    <span
                      className={styles.languageTag}
                      style={{
                        backgroundColor: `${languageColors[selectedRepo.language] || '#8B949E'}20`,
                        color: languageColors[selectedRepo.language] || '#8B949E',
                        borderColor: `${languageColors[selectedRepo.language] || '#8B949E'}30`
                      }}
                    >
                      <span
                        className={styles.languageDot}
                        style={{ backgroundColor: languageColors[selectedRepo.language] || '#8B949E' }}
                      ></span>
                      {selectedRepo.language}
                    </span>
                  )}
                </div>

                <p className={styles.modalDescription}>{selectedRepo.description}</p>

                <div className={styles.repoStats}>
                  <div className={styles.repoStat}>
                    <Star className={styles.repoStatIcon} />
                    <div>
                      <p className={styles.repoStatLabel}>Stars</p>
                      <p className={styles.repoStatValue}>{selectedRepo.stargazers_count}</p>
                    </div>
                  </div>

                  <div className={styles.repoStat}>
                    <GitFork className={styles.repoStatIcon} />
                    <div>
                      <p className={styles.repoStatLabel}>Forks</p>
                      <p className={styles.repoStatValue}>{selectedRepo.forks}</p>
                    </div>
                  </div>

                  <div className={styles.repoStat}>
                    <Eye className={styles.repoStatIcon} />
                    <div>
                      <p className={styles.repoStatLabel}>Watchers</p>
                      <p className={styles.repoStatValue}>{selectedRepo.watchers}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.repoInfoTable}>
                  <h4 className={styles.repoInfoTitle}>Repository Information</h4>
                  <div className={styles.repoInfoGrid}>
                    <div className={styles.repoInfoRow}>
                      <span className={styles.repoInfoLabel}>Created:</span>
                      <span className={styles.repoInfoValue}>{new Date(selectedRepo.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.repoInfoRow}>
                      <span className={styles.repoInfoLabel}>Updated:</span>
                      <span className={styles.repoInfoValue}>{new Date(selectedRepo.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.repoInfoRow}>
                      <span className={styles.repoInfoLabel}>Default Branch:</span>
                      <span className={styles.repoInfoValue}>{selectedRepo.default_branch}</span>
                    </div>
                    <div className={styles.repoInfoRow}>
                      <span className={styles.repoInfoLabel}>Size:</span>
                      <span className={styles.repoInfoValue}>
                        {selectedRepo.size > 1000
                          ? `${(selectedRepo.size / 1000).toFixed(1)} MB`
                          : `${selectedRepo.size} KB`}
                      </span>
                    </div>
                    <div className={styles.repoInfoRow}>
                      <span className={styles.repoInfoLabel}>License:</span>
                      <span className={styles.repoInfoValue}>
                        {selectedRepo.license ? selectedRepo.license.name : 'Not specified'}
                      </span>
                    </div>
                    <div className={styles.repoInfoRow}>
                      <span className={styles.repoInfoLabel}>Open Issues:</span>
                      <span className={styles.repoInfoValue}>{selectedRepo.open_issues_count}</span>
                    </div>
                  </div>
                </div>

                {/* Show repo readme or description in code-like format */}
                <div className={styles.codeContainer}>
                  <div className={styles.codeLine}>
                    <span className={styles.lineComment}>// Repository README.md</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.lineKeyword}>const</span>
                    <span className={styles.lineVariable}> projectInfo</span> = {'{'}
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.lineIndent}></span>
                    <span className={styles.lineProperty}>name:</span>
                    <span className={styles.lineString}>"{selectedRepo.name}"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.lineIndent}></span>
                    <span className={styles.lineProperty}>description:</span>
                    <span className={styles.lineString}>"{selectedRepo.description || 'No description provided'}"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.lineIndent}></span>
                    <span className={styles.lineProperty}>author:</span>
                    <span className={styles.lineString}>"{user?.name || user?.login || 'Asif Alam'}"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.lineIndent}></span>
                    <span className={styles.lineProperty}>language:</span>
                    <span className={styles.lineString}>"{selectedRepo.language || 'Not specified'}"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.lineIndent}></span>
                    <span className={styles.lineProperty}>stars:</span>
                    <span className={styles.lineNumber}>{selectedRepo.stargazers_count}</span>
                  </div>
                  <div className={styles.codeLine}>{'};'}</div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <div className={styles.modalLinks}>
                <a
                  href={selectedRepo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.modalButton}
                >
                  <Github size={16} />
                  View on GitHub
                </a>
                {selectedRepo.homepage && (
                  <a
                    href={selectedRepo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.modalButton} ${styles.primaryButton}`}
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
              </div>
              <div className={styles.modalKeyboardHelp}>
                Press <kbd>Esc</kbd> to close
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export async function getStaticProps() {
  // Debug environment variables (will only show in build logs)
  console.log('NEXT_PUBLIC_GITHUB_USERNAME:', process.env.NEXT_PUBLIC_GITHUB_USERNAME);
  console.log('GITHUB_API_KEY available:', !!process.env.GITHUB_API_KEY);

  try {
    // Use fallback username if environment variable is missing
    const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'asif-alam1';

    // Fetch user data first
    console.log('Fetching GitHub user data');
    const userRes = await fetch(`https://api.github.com/users/${username}`);

    if (!userRes.ok) {
      console.error('User fetch failed:', userRes.status, userRes.statusText);
      return {
        props: {
          error: `Failed to fetch GitHub profile: ${userRes.status} ${userRes.statusText}`,
          repos: null,
          user: null,
          title: 'GitHub Summary'
        },
        revalidate: 60 // Try again after 1 minute
      };
    }

    const user = await userRes.json();

    // Fetch repositories with or without auth token
    console.log('Fetching repos for', username);
    const repoRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=10&sort=updated`
    );

    if (!repoRes.ok) {
      console.error('Repository fetch failed:', repoRes.status, repoRes.statusText);
      return {
        props: {
          error: `Failed to fetch repositories: ${repoRes.status} ${repoRes.statusText}`,
          repos: null,
          user,
          title: 'GitHub Summary'
        },
        revalidate: 60
      };
    }

    let repos = await repoRes.json();

    // Validate repos is an array
    if (!Array.isArray(repos)) {
      console.error('GitHub API did not return an array of repositories');
      return {
        props: {
          error: 'Invalid repository data received from GitHub',
          repos: null,
          user,
          title: 'GitHub Summary'
        },
        revalidate: 60
      };
    }

    console.log(`Successfully fetched ${repos.length} repositories`);

    // Sort by stars and take top 6
    repos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    return {
      props: {
        title: 'GitHub Summary',
        repos,
        user,
        error: null
      },
      revalidate: 600 // Revalidate every 10 minutes
    };

  } catch (error) {
    console.error('Error in getStaticProps:', error.message);
    return {
      props: {
        error: `Failed to fetch GitHub data: ${error.message}`,
        repos: null,
        user: null,
        title: 'GitHub Summary'
      },
      revalidate: 60
    };
  }
}

export default GithubPage