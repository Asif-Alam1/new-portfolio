'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Loader, CheckCircle, AlertCircle, Terminal, Copy, Mail, Github, Linkedin, Instagram, Globe } from 'lucide-react'
import ContactCode from '../components/ContactCode'
import CustomHead from '../components/Head'
import styles from '../styles/ContactPage.module.css'

const ContactPage = () => {
  // Form state management
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formFocus, setFormFocus] = useState({
    name: false,
    email: false,
    message: false
  })

  // Line numbers generation
  const lineCount = 25
  const linesArray = Array.from({ length: lineCount }, (_, i) => i + 1)

  // Animation and interaction state
  const [activeInput, setActiveInput] = useState(null)
  const [copied, setCopied] = useState(null)
  const [codeVisible, setCodeVisible] = useState(true)
  const [terminalMode, setTerminalMode] = useState(false)
  const terminalInputRef = useRef(null)
  const [terminalCommand, setTerminalCommand] = useState('')
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'system', text: 'Contact Terminal [Version 1.0.0]' },
    { type: 'system', text: '(c) 2025 Asif Alam Portfolio. All rights reserved.' },
    { type: 'system', text: 'Type "help" to see available commands.' },
    { type: 'prompt', text: '>' }
  ])

  // Animation timing for success message
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [submitted])

  // Focus terminal input when terminal mode is active
  useEffect(() => {
    if (terminalMode && terminalInputRef.current) {
      terminalInputRef.current.focus()
    }
  }, [terminalMode, terminalOutput])

  // Terminal command handling
  const handleTerminalCommand = (cmd) => {
    const command = cmd.trim().toLowerCase()

    // Add command to output
    setTerminalOutput(prev => [
      ...prev,
      { type: 'command', text: cmd }
    ])

    // Process commands
    if (command === 'help') {
      setTerminalOutput(prev => [
        ...prev,
        { type: 'output', text: 'Available commands:' },
        { type: 'output', text: '  help       - Show this help message' },
        { type: 'output', text: '  clear      - Clear terminal' },
        { type: 'output', text: '  email      - Send email to Asif' },
        { type: 'output', text: '  github     - Open GitHub profile' },
        { type: 'output', text: '  linkedin   - Open LinkedIn profile' },
        { type: 'output', text: '  instagram  - Open Instagram profile' },
        { type: 'output', text: '  exit       - Exit terminal mode' },
        { type: 'prompt', text: '>' }
      ])
    } else if (command === 'clear') {
      setTerminalOutput([
        { type: 'prompt', text: '>' }
      ])
    } else if (command === 'email') {
      window.open('mailto:asiftalukder151@gmail.com', '_blank')
      setTerminalOutput(prev => [
        ...prev,
        { type: 'output', text: 'Opening email client...' },
        { type: 'prompt', text: '>' }
      ])
    } else if (command === 'github') {
      window.open('https://github.com/asif-alam1', '_blank')
      setTerminalOutput(prev => [
        ...prev,
        { type: 'output', text: 'Opening GitHub profile...' },
        { type: 'prompt', text: '>' }
      ])
    } else if (command === 'linkedin') {
      window.open('https://www.linkedin.com/in/asif-alam-talukder', '_blank')
      setTerminalOutput(prev => [
        ...prev,
        { type: 'output', text: 'Opening LinkedIn profile...' },
        { type: 'prompt', text: '>' }
      ])
    } else if (command === 'instagram') {
      window.open('https://www.instagram.com/asif_.alam', '_blank')
      setTerminalOutput(prev => [
        ...prev,
        { type: 'output', text: 'Opening Instagram profile...' },
        { type: 'prompt', text: '>' }
      ])
    } else if (command === 'exit') {
      setTerminalMode(false)
    } else if (command !== '') {
      setTerminalOutput(prev => [
        ...prev,
        { type: 'error', text: `Command not recognized: '${cmd}'` },
        { type: 'output', text: 'Type "help" to see available commands.' },
        { type: 'prompt', text: '>' }
      ])
    } else {
      setTerminalOutput(prev => [
        ...prev,
        { type: 'prompt', text: '>' }
      ])
    }

    setTerminalCommand('')
  }

  // Form submission handler
  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Form validation
    if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
      setError('Please fill out all fields')
      setIsLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      // Simulated loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000))

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      })

      if (response.ok) {
        console.log('Email sent successfully')
        setName('')
        setEmail('')
        setMessage('')
        setSubmitted(true)
      } else {
        console.error('Failed to send email')
        setError('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('An unexpected error occurred. Please try again.')
    }

    setIsLoading(false)
  }

  // Copy email to clipboard
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(type)
        setTimeout(() => setCopied(null), 2000)
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
      })
  }

  // Form field focus handlers
  const handleFocus = field => {
    setFormFocus(prev => ({ ...prev, [field]: true }))
    setActiveInput(field)
  }

  const handleBlur = field => {
    setFormFocus(prev => ({ ...prev, [field]: false }))
    setActiveInput(null)
  }

  // Terminal key handler
  const handleTerminalKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTerminalCommand(terminalCommand)
    } else if (e.key === 'Escape') {
      setTerminalMode(false)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt+T to toggle terminal mode
      if (e.altKey && e.key === 't') {
        e.preventDefault()
        setTerminalMode(prev => !prev)
      }

      // Alt+C to toggle code visibility
      if (e.altKey && e.key === 'c') {
        e.preventDefault()
        setCodeVisible(prev => !prev)
      }

      // Escape to exit terminal mode
      if (e.key === 'Escape' && terminalMode) {
        setTerminalMode(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [terminalMode])

  return (
    <>
      <CustomHead
        title='Contact and Socials Page'
        description='Get in touch with Asif Alam. Send a message or connect via social media to discuss web development projects or opportunities.'
      />

      <div className={styles.container}>
        <div className={styles.editor}>

          <div className={styles.contentWrapper}>
            <div className={`${styles.codeContainer} ${!codeVisible ? styles.hidden : ''}`}>
              <div className={styles.codeHeader}>
                <h3 className={styles.heading}>
                  <span className={styles.headingIcon}>&lt;/&gt;</span>
                  Connect With Me
                </h3>

              </div>
              <ContactCode />



            </div>



            <div className={styles.formContainer}>
              <h3 className={styles.heading}>
                <span className={styles.headingIcon}>📨</span>
                Send Me a Message
              </h3>
              {submitted ? (
                <div className={styles.thankYou}>
                  <div className={styles.checkCircleWrapper}>
                    <CheckCircle size={48} className={styles.icon} />
                  </div>
                  <h4>Thank you for your message!</h4>
                  <p>I'll get back to you as soon as possible.</p>
                  <div className={styles.codeDisplay}>
                    <div className={styles.codeLine}>
                      <span className={styles.keyword}>const</span>
                      <span className={styles.variable}> response</span>
                      <span className={styles.operator}> = </span>
                      <span className={styles.value}>'Message received'</span>
                      <span>;</span>
                    </div>
                    <div className={styles.codeLine}>
                      <span className={styles.keyword}>console</span>
                      <span>.</span>
                      <span className={styles.method}>log</span>
                      <span>(</span>
                      <span className={styles.value}>'Thank you, {name}!'</span>
                      <span>);</span>
                    </div>
                  </div>
                  <button
                    className={styles.sendAgainButton}
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div
                    className={`${styles.formGroup} ${
                      formFocus.name ? styles.focused : ''
                    } ${activeInput === 'name' ? styles.active : ''}`}
                  >
                    <label htmlFor='name'>
                      <span className={styles.labelText}>Name</span>
                      <span className={styles.comment}>// Your full name</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        type='text'
                        id='name'
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onFocus={() => handleFocus('name')}
                        onBlur={() => handleBlur('name')}
                        required
                        placeholder="John Doe"
                      />
                      {activeInput === 'name' && (
                        <div className={styles.cursor}></div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`${styles.formGroup} ${
                      formFocus.email ? styles.focused : ''
                    } ${activeInput === 'email' ? styles.active : ''}`}
                  >
                    <label htmlFor='email'>
                      <span className={styles.labelText}>Email</span>
                      <span className={styles.comment}>// Where I can reach you</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        type='email'
                        id='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onFocus={() => handleFocus('email')}
                        onBlur={() => handleBlur('email')}
                        required
                        placeholder="john@example.com"
                      />
                      {activeInput === 'email' && (
                        <div className={styles.cursor}></div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`${styles.formGroup} ${
                      formFocus.message ? styles.focused : ''
                    } ${activeInput === 'message' ? styles.active : ''}`}
                  >
                    <label htmlFor='message'>
                      <span className={styles.labelText}>Message</span>
                      <span className={styles.comment}>// What you'd like to discuss</span>
                    </label>
                    <div className={styles.textareaWrapper}>
                      <textarea
                        id='message'
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onFocus={() => handleFocus('message')}
                        onBlur={() => handleBlur('message')}
                        required
                        placeholder="I'd like to discuss a project..."
                        rows={6}
                      ></textarea>
                      {activeInput === 'message' && (
                        <div className={styles.cursor}></div>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className={styles.error}>
                      <AlertCircle size={18} />
                      <p>{error}</p>
                    </div>
                  )}

                  <button
                    type='submit'
                    disabled={isLoading}
                    className={styles.submitButton}
                  >
                    {isLoading ? (
                      <>
                        <Loader size={18} className={styles.spinner} />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Terminal modal */}
        {terminalMode && (
          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
              <span>Terminal</span>
              <button
                className={styles.closeTerminal}
                onClick={() => setTerminalMode(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.terminalBody}>
              {terminalOutput.map((line, index) => (
                <div
                  key={index}
                  className={`${styles.terminalLine} ${styles[line.type]}`}
                >
                  {line.type === 'prompt' ? (
                    <>
                      {line.text}
                      {index === terminalOutput.length - 1 && (
                        <input
                          type="text"
                          ref={terminalInputRef}
                          value={terminalCommand}
                          onChange={(e) => setTerminalCommand(e.target.value)}
                          onKeyDown={handleTerminalKeyDown}
                          className={styles.terminalInput}
                          autoFocus
                        />
                      )}
                    </>
                  ) : (
                    line.text
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: { title: 'Contact and Socials' }
  }
}

export default ContactPage