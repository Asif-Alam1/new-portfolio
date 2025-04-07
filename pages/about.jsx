'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Terminal,
  Code,
  Cpu,
  Zap,
  Book,
  Users,
  Github,
  Linkedin,
  Download,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Mail,
  Award,
  Hash
} from 'lucide-react'
import CustomHead from '../components/Head'
import styles from '../styles/AboutPage.module.css'

const AboutPage = () => {
  const [expandedSections, setExpandedSections] = useState({
    profile: true, // Open the first section by default
    expertise: false,
    journey: false,
    education: false,
    involvement: false
  })

  const [activeSection, setActiveSection] = useState('profile')
  const [isVisible, setIsVisible] = useState(false)

  // Handle keyboard navigation between sections
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+1-5 for navigating sections
      if (e.ctrlKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault()
        const sectionIndex = parseInt(e.key) - 1
        const sectionKeys = Object.keys(expandedSections)
        if (sectionIndex < sectionKeys.length) {
          const sectionKey = sectionKeys[sectionIndex]
          setActiveSection(sectionKey)
          setExpandedSections(prev => ({
            ...Object.fromEntries(Object.keys(prev).map(key => [key, key === sectionKey])),
          }))
          // Scroll to section
          document.getElementById(sectionKey)?.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [expandedSections])

  // Animation on initial load
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, 100)
  }, [])

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
    setActiveSection(section)
  }

  return (
    <>
      <CustomHead
        title='About Asif Alam - Software Engineer Extraordinaire'
        description='Learn about Asif Alam, a top computer engineering student and software engineer with expertise in Next.js, React.js, React Native and Nest.js.'
      />


      <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>


        <h2 className={styles.title}>
          <Terminal className={styles.icon} />
          <span className={styles.titleCode}>
            <span className={styles.keyword}>const  </span>
            <span className={styles.variable}> Engineer</span> =
            <span className={styles.string}>"Asif Alam"</span>;
          </span>
        </h2>

        <div className={styles.profile}>
          <div className={styles.imageWrapper}>
            <Image
              src='/profilepic.jpg'
              alt='Asif Alam'
              width={150}
              height={150}
              className={styles.profileImage}
              priority
            />
            <div className={styles.statusIndicator} title="Available for opportunities">
              <span className={styles.statusDot}></span>
              <span>Available</span>
            </div>
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.nameSection}>
              <h3 className={styles.name}>Asif Alam</h3>
              <div className={styles.badges}>
                <span className={styles.badge} title="Years of experience">
                  <Code size={14} /> 1+ YOE
                </span>
                <span className={styles.badge} title="Location">
                  <Hash size={14} /> Lebanon
                </span>
              </div>
            </div>
            <p className={styles.jobTitle}>Software Engineer</p>
            <p className={styles.location}>Jdeideh, Matn, Lebanon</p>
            <div className={styles.socialLinks}>
              <Link
                href='https://github.com/asif-alam1'
                target='_blank'
                rel='noopener noreferrer'
                className={styles.socialLink}
                title="GitHub Profile"
              >
              <div>
                <Github size={20} />
                <span className={styles.socialText}>asif-alam1</span>
                <ExternalLink size={12} className={styles.externalIcon} />
                </div>
              </Link>
              <Link
                href='https://linkedin.com/in/asif-alam-talukder'
                target='_blank'
                rel='noopener noreferrer'
                className={styles.socialLink}
                title="LinkedIn Profile"
              >
                <div>
                <Linkedin size={20} />
                <span className={styles.socialText}>asif-alam-talukder</span>
                <ExternalLink size={12} className={styles.externalIcon} />
                </div>
              </Link>
              <Link
                href='mailto:asiftalukder151@gmail.com'
                className={styles.socialLink}
                title="Email"
              >
              <div>
                <Mail size={20} />
                <span className={styles.socialText}>asiftalukder151@gmail.com</span>
                </div>
              </Link>
              <Link
                href='/asif-alam-cv.pdf'
                download
                className={`${styles.socialLink} ${styles.downloadLink}`}
                title="Download Resume"
              >
              <div>
                <Download size={20} />
                <span className={styles.socialText}>Download CV</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <Section
            id="profile"
            title='Profile'
            icon={<Code className={styles.icon} />}
            expanded={expandedSections.profile}
            toggleExpand={() => toggleSection('profile')}
            shortcut="Ctrl+1"
            isActive={activeSection === 'profile'}
          >
            <div className={styles.codeBlock}>
              <div className={styles.codeLine}>
                <span className={styles.commentCode}>// Professional summary</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.keywordCode}>const </span>
                <span className={styles.variableCode}>professionalSummary</span> = {'{'}
              </div>
              <div className={styles.codeLine}>
                <span className={styles.indentCode}></span>
                <span className={styles.propertyCode}>experience:</span>
                <span className={styles.stringCode}>"Software engineering and computer engineering student"</span>,
              </div>
              <div className={styles.codeLine}>
                <span className={styles.indentCode}></span>
                <span className={styles.propertyCode}>achievements:</span>
                <span className={styles.stringCode}>"Stellar academic record and professional experience"</span>,
              </div>
              <div className={styles.codeLine}>
                <span className={styles.indentCode}></span>
                <span className={styles.propertyCode}>industries:</span>
                <span className={styles.stringCode}>"Multiple sectors"</span>
              </div>
              <div className={styles.codeLine}>{'};'}</div>
            </div>

            <p className={styles.paragraph}>
              An accomplished software engineer and computer engineering student, celebrated for stellar academic achievements and a rich spectrum of professional experiences spanning multiple industries.
            </p>
            <p className={styles.paragraph}>
              My strong analytical skills, innovative approach to problem-solving, and fluency in several languages empower me to excel in complex technical environments, while my enduring passion for coding fuels continuous learning and creative breakthroughs.
            </p>
            <p className={styles.paragraph}>
              With over a year of hands-on industry experience, I thrive on tackling challenging projects and pushing technological boundaries to deliver cutting-edge solutions.
            </p>
          </Section>

          <Section
            id="expertise"
            title='Technical Expertise'
            icon={<Cpu className={styles.icon} />}
            expanded={expandedSections.expertise}
            toggleExpand={() => toggleSection('expertise')}
            shortcut="Ctrl+2"
            isActive={activeSection === 'expertise'}
          >
            <div className={styles.codeBlock}>
              <div className={styles.codeLine}>
                <span className={styles.commentCode}>// My tech stack and skills</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.keywordCode}>const </span>
                <span className={styles.variableCode}>skills</span> = {'{'}
              </div>
              <div className={styles.codeLine}>
                <span className={styles.indentCode}></span>
                <span className={styles.propertyCode}>frontend:</span> [
                <span className={styles.stringCode}>"React.js"</span>,
                <span className={styles.stringCode}>"Next.js"</span>,
                <span className={styles.stringCode}>"Tailwind CSS"</span>],
              </div>
              <div className={styles.codeLine}>
                <span className={styles.indentCode}></span>
                <span className={styles.propertyCode}>backend:</span> [
                <span className={styles.stringCode}>"Database Architecture"</span>,
                <span className={styles.stringCode}>"Nest.js"</span>],
              </div>
              <div className={styles.codeLine}>
                <span className={styles.indentCode}></span>
                <span className={styles.propertyCode}>mobile:</span> [
                <span className={styles.stringCode}>"React Native"</span>],
              </div>
              <div className={styles.codeLine}>
                <span className={styles.indentCode}></span>
                <span className={styles.propertyCode}>languages:</span> [
                <span className={styles.stringCode}>"JavaScript"</span>,
                <span className={styles.stringCode}>"TypeScript"</span>,
                <span className={styles.stringCode}>"Java"</span>]
              </div>
              <div className={styles.codeLine}>{'};'}</div>
            </div>

            <div className={styles.skillsGrid}>
              {[
                { name: 'Next.js', level: 100, type: 'frontend' },
                { name: 'React.js', level: 100, type: 'frontend' },
                { name: 'Nest.js', level: 80, type: 'backend' },
                { name: 'Java', level: 80, type: 'language' },
                { name: 'Tailwind CSS', level: 90, type: 'frontend' },
                { name: 'React Native', level: 95, type: 'mobile' },
                { name: 'TypeScript', level: 100, type: 'language' },
                { name: 'Database Architecture', level: 85, type: 'backend' },
              ].map(skill => (
                <div key={skill.name} className={`${styles.skillItem} ${styles[skill.type]}`}>
                  <div className={styles.skillHeader}>
                    <span className={styles.skillName}>{skill.name}</span>
                    <span className={styles.skillLevel}>{skill.level}%</span>
                  </div>
                  <div className={styles.skillBar}>
                    <div
                      className={styles.skillProgress}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="journey"
            title='Professional Journey'
            icon={<Zap className={styles.icon} />}
            expanded={expandedSections.journey}
            toggleExpand={() => toggleSection('journey')}
            shortcut="Ctrl+3"
            isActive={activeSection === 'journey'}
          >
            <div className={styles.codeBlock}>
              <div className={styles.codeLine}>
                <span className={styles.commentCode}>// Professional experience timeline</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.keywordCode}>const </span>
                <span className={styles.variableCode}>professionalExperience</span> = [
              </div>
              <div className={styles.codeLine}>
                <span className={styles.indentCode}></span>{'{'}
                <span className={styles.propertyCode}>role:</span>
                <span className={styles.stringCode}>"Lead Engineer"</span>,
                <span className={styles.propertyCode}>company:</span>
                <span className={styles.stringCode}>"QWERTY"</span>,
                <span className={styles.propertyCode}>period:</span>
                <span className={styles.stringCode}>"May 2024 - Present"</span>
                {'},'}
              </div>
              <div className={styles.codeLine}>
                <span className={styles.indentCode}></span>{'// More experiences...'}
              </div>
              <div className={styles.codeLine}>];</div>
            </div>

            <ul className={styles.timeline}>
              <TimelineItem
                title='Lead Engineer at QWERTY'
                date='May 2024 - Present'
                description='Leading ideation and development, working on various projects, providing innovative and sustainable solutions based on client needs.'
                technologies={['Next.js', 'React Native', 'TypeScript']}
              />
              <TimelineItem
                title='Freelance Full Stack Engineer'
                date='May 2023 - May 2024'
                description='Built a diverse portfolio of projects using the latest technologies and best practices while interacting with clients and corporations.'
                technologies={['React.js', 'Next.js', 'Tailwind']}
              />
              <TimelineItem
                title='Full Stack Engineer at Stitches Studio'
                date='March 2024 - May 2024'
                description='Worked in a SCRUM environment on the Education Basket Systems, using React.js and Nest.js to upgrade and maintain the existing system.'
                technologies={['React.js', 'Nest.js', 'PostgreSQL']}
              />
            </ul>
          </Section>

          <Section
            id="education"
            title='Educational Background'
            icon={<Book className={styles.icon} />}
            expanded={expandedSections.education}
            toggleExpand={() => toggleSection('education')}
            shortcut="Ctrl+4"
            isActive={activeSection === 'education'}
          >
            <div className={styles.codeBlock}>
              <div className={styles.codeLine}>
                <span className={styles.commentCode}>// Academic qualifications</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.keywordCode}>const </span>
                <span className={styles.variableCode}>education</span> = [
              </div>
              <div className={styles.codeLine}>
                <span className={styles.indentCode}></span>{'{'}
                <span className={styles.propertyCode}>degree:</span>
                <span className={styles.stringCode}>"Bachelor's in Computer Engineering"</span>,
                <span className={styles.propertyCode}>institution:</span>
                <span className={styles.stringCode}>"USEK"</span>
                {'},'}
              </div>
              <div className={styles.codeLine}>];</div>
            </div>

            <ul className={styles.educationList}>
              <EducationItem
                school='Holy Spirit University of Kaslik (USEK)'
                date='September 2021 - Present'
                degree="Bachelor's in Computer Engineering"
                grade='Current GPA: 90.15'
                achievements={[
                  'Top performer in Computer Engineering courses',
                  'Merit-based scholarship recipient'
                ]}
              />
              <EducationItem
                school='GGTA2 Public School'
                date='September 2019 - June 2021'
                degree='Lebanese Baccalaureate in Life Sciences'
                grade='Grade: 18.4/20 (Ranked 19th in Lebanon)'
                achievements={[
                  'National ranking: 19th in Lebanon',
                  'Debate team member ',
                  'Football team member'
                ]}
              />
            </ul>
          </Section>

          <Section
            id="involvement"
            title='Community Involvement'
            icon={<Users className={styles.icon} />}
            expanded={expandedSections.involvement}
            toggleExpand={() => toggleSection('involvement')}
            shortcut="Ctrl+5"
            isActive={activeSection === 'involvement'}
          >
            <div className={styles.codeBlock}>
              <div className={styles.codeLine}>
                <span className={styles.commentCode}>// Community contributions and leadership</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.keywordCode}>function</span>
                <span className={styles.functionCode}>getCommunityInvolvement</span>() {'{'}
              </div>
              <div className={styles.codeLine}>
                <span className={styles.indentCode}></span>
                <span className={styles.keywordCode}>return</span> [
                <span className={styles.stringCode}>"IEEE Member"</span>,
                <span className={styles.stringCode}>"Student Representative"</span>,
                <span className={styles.stringCode}>"Social Worker"</span>];
              </div>
              <div className={styles.codeLine}>{'}'}</div>
            </div>

            <div className={styles.involvementContainer}>
              <div className={styles.involvementCard}>
                <div className={styles.involvementHeader}>
                  <Award className={styles.involvementIcon} />
                  <h4>IEEE USEK Student Branch</h4>
                </div>
                <p className={styles.involvementDate}>December 2022 - December 2023</p>
                <p className={styles.involvementDesc}>
                  Active Committee Member responsible for organizing technical workshops, coding competitions, and networking events for engineering students.
                </p>
              </div>

              <div className={styles.involvementCard}>
                <div className={styles.involvementHeader}>
                  <Users className={styles.involvementIcon} />
                  <h4>Student Representative</h4>
                </div>
                <p className={styles.involvementDate}>October 2022 - October 2023</p>
                <p className={styles.involvementDesc}>
                  Elected as Student Representative of the School of Engineering at USEK, facilitating communication between students and faculty, advocating for student needs.
                </p>
              </div>

              <div className={styles.involvementCard}>
                <div className={styles.involvementHeader}>
                  <Heart className={styles.involvementIcon} />
                  <h4>APSAD Social Worker</h4>
                </div>
                <p className={styles.involvementDate}>October 2021 - February 2022</p>
                <p className={styles.involvementDesc}>
                  Volunteered at APSAD (Association for the Protection of Sites and Ancient Dwellings), contributing to community service and heritage preservation initiatives.
                </p>
              </div>
            </div>
          </Section>
        </div>


      </div>
    </>
  )
}

const Section = ({ id, title, icon, children, expanded, toggleExpand, shortcut, isActive }) => (
  <section
    id={id}
    className={`${styles.section} ${expanded ? styles.expanded : ''} ${isActive ? styles.active : ''}`}
  >
    <h3 className={styles.sectionTitle} onClick={toggleExpand}>
      {icon}
      <span className={styles.sectionTitleText}>{title}</span>
      <span className={styles.sectionShortcut}>{shortcut}</span>
      {expanded ? (
        <ChevronUp className={styles.chevronIcon} />
      ) : (
        <ChevronDown className={styles.chevronIcon} />
      )}
    </h3>
    <div className={styles.sectionContent}>
      <div className={styles.sectionContentInner}>
        {children}
      </div>
    </div>
  </section>
)

const TimelineItem = ({ title, date, description, technologies = [] }) => (
  <li className={styles.timelineItem}>
    <div className={styles.timelineHeader}>
      <h4 className={styles.jobTitle}>{title}</h4>
      <span className={styles.jobDate}>{date}</span>
    </div>
    <p className={styles.jobDescription}>{description}</p>
    {technologies.length > 0 && (
      <div className={styles.jobTechnologies}>
        {technologies.map(tech => (
          <span key={tech} className={styles.techTag}>{tech}</span>
        ))}
      </div>
    )}
  </li>
)

const EducationItem = ({ school, date, degree, grade, achievements = [] }) => (
  <li className={styles.educationItem}>
    <div className={styles.educationHeader}>
      <h4 className={styles.schoolName}>{school}</h4>
      <span className={styles.educationDate}>{date}</span>
    </div>
    <p className={styles.educationDetail}>{degree}</p>
    <p className={styles.educationGrade}>{grade}</p>
    {achievements.length > 0 && (
      <div className={styles.achievements}>
        <h5 className={styles.achievementsTitle}>Key Achievements:</h5>
        <ul className={styles.achievementsList}>
          {achievements.map((achievement, index) => (
            <li key={index} className={styles.achievementItem}>{achievement}</li>
          ))}
        </ul>
      </div>
    )}
  </li>
)

// Forgot to import Heart icon
const Heart = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
)

export default AboutPage