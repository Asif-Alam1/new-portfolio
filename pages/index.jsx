'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { TypeAnimation } from 'react-type-animation'
import Illustration from '../components/Illustration'
import CustomHead from '../components/Head'
import styles from '../styles/HomePage.module.css'

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeShortcut, setActiveShortcut] = useState(null)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const terminalRef = useRef(null)
  const [terminalCommand, setTerminalCommand] = useState('')
  const [terminalOutput, setTerminalOutput] = useState([])
  const [terminalHistory, setTerminalHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Terminal command handler
  const handleTerminalCommand = (cmd) => {
    const commands = {
      'help': () => {
        return [
          'Available commands:',
          '  help     - Show this help message',
          '  about    - About Asif Alam',
          '  skills   - List technical skills',
          '  projects - View projects',
          '  contact  - Contact information',
          '  clear    - Clear terminal',
          '  exit     - Close terminal'
        ]
      },
      'about': () => {
        return [
          'Asif Alam',
          '---------------',
          'Software Engineer and Computer Engineering student with',
          'stellar academic achievements and professional experience',
          'across multiple industries.',
          '',
          'Currently: Lead Engineer at QWERTY',
          'Education: Computer Engineering at Holy Spirit University of Kaslik (USEK)'
        ]
      },
      'skills': () => {
        return [
          'Technical Skills:',
          '---------------',
          '  Frontend: React.js, Next.js, Tailwind CSS',
          '  Mobile:   React Native',
          '  Backend:  Node.js, Nest.js',
          '  Other:    TypeScript, Java, Git'
        ]
      },
      'projects': () => {
        return [
          'Notable Projects:',
          '---------------',
          '  • Fit Companion - Gym management application',
          '  • Antypas App - Car dealership webapp',
          '  • Internal App - Company management software',
          '  • RFM World - Website for multinational group',
          '',
          'Type "cd /projects" or visit the Projects tab to see more.'
        ]
      },
      'contact': () => {
        return [
          'Contact Information:',
          '---------------',
          '  Email:    asiftalukder151@gmail.com',
          '  GitHub:   github.com/asif-alam1',
          '  LinkedIn: linkedin.com/in/asif-alam-talukder',
          '',
          'Type "cd /contact" to go to contact page.'
        ]
      },
      'cd': (arg) => {
        if (arg === '/projects') {
          window.location.href = '/projects'
          return ['Navigating to projects...']
        } else if (arg === '/contact') {
          window.location.href = '/contact'
          return ['Navigating to contact...']
        } else if (arg === '/about') {
          window.location.href = '/about'
          return ['Navigating to about...']
        } else if (arg === '/github') {
          window.location.href = '/github'
          return ['Navigating to github...']
        } else {
          return [`Directory not found: ${arg}`]
        }
      },
      'clear': () => {
        setTimeout(() => setTerminalOutput([]), 50)
        return []
      },
      'exit': () => {
        setTimeout(() => setTerminalOpen(false), 500)
        return ['Closing terminal...']
      }
    }

    // Save command to history
    if (cmd.trim() !== '') {
      setTerminalHistory(prev => [...prev, cmd])
      setHistoryIndex(-1)
    }

    // Process command
    const args = cmd.trim().split(' ')
    const command = args[0].toLowerCase()

    if (command === '') {
      return
    } else if (commands[command]) {
      if (command === 'cd') {
        return commands[command](args[1])
      } else {
        return commands[command]()
      }
    } else {
      return [`Command not found: ${command}. Type 'help' for available commands.`]
    }
  }

  // Handle terminal key events
  const handleTerminalKeyDown = (e) => {
    if (e.key === 'Enter') {
      const output = handleTerminalCommand(terminalCommand)
      if (output && output.length > 0) {
        setTerminalOutput(prev => [...prev, { type: 'command', text: terminalCommand }, ...output.map(text => ({ type: 'output', text }))])
      } else {
        setTerminalOutput(prev => [...prev, { type: 'command', text: terminalCommand }])
      }
      setTerminalCommand('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (terminalHistory.length > 0 && historyIndex < terminalHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setTerminalCommand(terminalHistory[terminalHistory.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setTerminalCommand(terminalHistory[terminalHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setTerminalCommand('')
      }
    }
  }

  // Focus terminal input when opened
  useEffect(() => {
    if (terminalOpen && terminalRef.current) {
      terminalRef.current.focus()
    }
  }, [terminalOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+` to toggle terminal
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault()
        setTerminalOpen(prev => !prev)
      }

      // Ctrl+P for projects
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault()
        setActiveShortcut('projects')
        setTimeout(() => {
          window.location.href = '/projects'
        }, 500)
      }

      // Ctrl+A for about
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault()
        setActiveShortcut('about')
        setTimeout(() => {
          window.location.href = '/about'
        }, 500)
      }

      // Ctrl+C for contact
      if (e.ctrlKey && e.key === 'c' && !e.metaKey) { // Avoid conflicting with copy command
        if (!terminalOpen) {
          e.preventDefault()
          setActiveShortcut('contact')
          setTimeout(() => {
            window.location.href = '/contact'
          }, 500)
        }
      }

      // Ctrl+G for GitHub
      if (e.ctrlKey && e.key === 'g') {
        e.preventDefault()
        setActiveShortcut('github')
        setTimeout(() => {
          window.location.href = '/github'
        }, 500)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [terminalOpen])

  // Set visibility after component mounts
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, 100)
  }, [])

  // Add welcome message to terminal
  useEffect(() => {
    if (terminalOpen) {
      setTerminalOutput([
        { type: 'output', text: '  ___        _  __ _   _    _               ' },
        { type: 'output', text: ' / _ \\      (_)/ _( ) | |  | |              ' },
        { type: 'output', text: '/ /_\\ \\___  _| |_|/  | |  | | ___  ___ _ __ ' },
        { type: 'output', text: '|  _  / __|| |  _|   | |/\\| |/ _ \\/ __| \'__|' },
        { type: 'output', text: '| | | \\__ \\| | |     \\  /\\  /  __/\\__ \\ |   ' },
        { type: 'output', text: '\\_| |_/___/|_|_|      \\/  \\/ \\___||___/_|   ' },
        { type: 'output', text: '' },
        { type: 'output', text: 'Welcome to Asif Alam\'s portfolio terminal!' },
        { type: 'output', text: 'Type "help" to see available commands.' },
        { type: 'output', text: '' }
      ])
    }
  }, [terminalOpen])

  return (
    <>
      <CustomHead
        title='Asif Alam - Innovative Software Engineer'
        description='Asif Alam is a Software Engineer building the future through innovative web development. Explore his portfolio and projects.'
      />

      <div className={styles.container}>


        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.textContent}>
            <div className={styles.editorComment}>
              <span>{'//'} Welcome to my portfolio</span>
            </div>

            <div className={styles.codeBlock}>
              <span className={styles.keyword}>const</span>
              <span className={styles.variable}> Engineer</span>
              <span className={styles.operator}> = </span>
              <span className={styles.braces}>{'{'}</span>
            </div>

            <h1 className={styles.title}>
              <span className={styles.titleLine}>I BUILD</span>
              <span className={styles.titleLine}>THE FUTURE</span>
            </h1>

            <div className={styles.codeBlockEnd}>
              <span className={styles.braces}>{'}'}</span>
            </div>

            <div className={styles.info}>
              <h2 className={styles.name}>Asif Alam</h2>
              <h3 className={styles.bio}>
                <span className={styles.codeComment}>// </span>
                <TypeAnimation
                  sequence={[
                    'Software Engineer',
                    2000,
                    'Full Stack Engineer',
                    2000,
                    'Computer Engineer',
                    2000,
                    'Tech Innovator',
                    2000
                  ]}
                  wrapper='span'
                  speed={50}
                  repeat={Infinity}
                />
              </h3>
            </div>

            <div className={styles.cta}>
              <Link href='/projects' passHref>
                <button
                  className={`${styles.button} ${activeShortcut === 'projects' ? styles.activeButton : ''}`}
                  onMouseOver={() => setActiveShortcut('projects')}
                  onMouseLeave={() => setActiveShortcut(null)}
                >
                  <span className={styles.buttonText}>View Work </span>
                   <span className={styles.shortcut1}>
                                Ctrl+P
    </span>
                </button>
              </Link>
              <Link href='/contact' passHref>
                <button
                  className={`${styles.outlined} ${activeShortcut === 'contact' ? styles.activeButton : ''}`}
                  onMouseOver={() => setActiveShortcut('contact')}
                  onMouseLeave={() => setActiveShortcut(null)}
                >
                  <span className={styles.buttonText}>Contact Me</span>
                 <span className={styles.shortcut1}>
       Ctrl+C
    </span>
                </button>
              </Link>
            </div>

            <div className={styles.additionalLinks}>
              <Link href='/about' passHref>
                <button
                  className={`${styles.textLink} ${activeShortcut === 'about' ? styles.activeLink : ''}`}
                  onMouseOver={() => setActiveShortcut('about')}
                  onMouseLeave={() => setActiveShortcut(null)}
                >
                  <span>About</span>
                  <span className={styles.shortcut}>Ctrl+A</span>
                </button>
              </Link>
              <span className={styles.divider}>|</span>
              <Link href='/github' passHref>
                <button
                  className={`${styles.textLink} ${activeShortcut === 'github' ? styles.activeLink : ''}`}
                  onMouseOver={() => setActiveShortcut('github')}
                  onMouseLeave={() => setActiveShortcut(null)}
                >
                  <span>GitHub</span>
                  <span className={styles.shortcut}>Ctrl+G</span>
                </button>
              </Link>
              <span className={styles.divider}>|</span>
              <button
                className={styles.textLink}
                onClick={() => setTerminalOpen(true)}
              >
                <span>Terminal</span>
                <span className={styles.shortcut}>Ctrl+`</span>
              </button>
            </div>
          </div>

          <div className={styles.illustrationWrapper}>
            <div className={`${styles.floatingIllustration} ${isVisible ? styles.floatAnimation : ''}`}>
              <Illustration className={styles.illustration} />
            </div>


          </div>
        </div>

        <div className={`${styles.backgroundText} ${isVisible ? styles.fadeIn : ''}`}>
          <span>INNOVATE</span>
          <span>CREATE</span>
          <span>DEVELOP</span>
        </div>

        {/* Terminal */}
        {terminalOpen && (
          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
              <div className={styles.terminalTitle}>Terminal</div>
              <button
                className={styles.closeButton}
                onClick={() => setTerminalOpen(false)}
              >×</button>
            </div>
            <div className={styles.terminalBody}>
              {terminalOutput.map((line, index) => (
                <div key={index} className={line.type === 'command' ? styles.command : styles.output}>
                  {line.type === 'command' ? '> ' + line.text : line.text}
                </div>
              ))}
              <div className={styles.commandLine}>
                <span className={styles.prompt}></span>
                <input
                  ref={terminalRef}
                  type="text"
                  className={styles.commandInput}
                  value={terminalCommand}
                  onChange={(e) => setTerminalCommand(e.target.value)}
                  onKeyDown={handleTerminalKeyDown}
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}