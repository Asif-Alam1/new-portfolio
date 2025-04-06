'use client'

import React, { useState } from 'react'
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
	ChevronUp
} from 'lucide-react'
import CustomHead from '../components/Head'
import styles from '../styles/AboutPage.module.css'

const AboutPage = () => {
	const [expandedSections, setExpandedSections] = useState({
		profile: false,
		expertise: false,
		journey: false,
		education: false,
		involvement: false
	})

	const toggleSection = section => {
		setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
	}

	return (
		<>
			<CustomHead
				title='About Asif Alam - Software Engineer Extraordinaire'
				description='Learn about Asif Alam, a top computer engineering student and software engineer with expertise in Next.js, React.js, React Native and Nest.js.'
			/>
			<div className={styles.container}>
				<h2 className={styles.title}>
					<Terminal className={styles.icon} />
					About Asif Alam: Software Engineer Extraordinaire
				</h2>

				<div className={styles.profile}>
					<div className={styles.imageWrapper}>
						<Image
							src='/profile-pic.webp'
							alt='Asif Alam'
							width={150}
							height={150}
							className={styles.profileImage}
							objectFit='cover'
						/>
					</div>
					<div className={styles.profileInfo}>
						<h3 className={styles.name}>Asif Alam</h3>
						<p className={styles.jobTitle}>Software Engineer</p>
						<p className={styles.location}>Jdeideh, Matn, Lebanon</p>
						<div className={styles.socialLinks}>
							<Link
								href='https://github.com/asif-alam1'
								target='_blank'
								rel='noopener noreferrer'
								className={styles.socialLink}>
								<Github size={24} />
							</Link>
							<Link
								href='https://linkedin.com/in/asif-alam-talukder'
								target='_blank'
								rel='noopener noreferrer'
								className={styles.socialLink}>
								<Linkedin size={24} />
							</Link>
							<Link
								href='/asif-alam-cv.pdf'
								download
								className={styles.socialLink}>
								<span className={styles.downloadLink}>
									<Download size={24} />
									<span className={styles.downloadText}>Download CV</span>
								</span>
							</Link>
						</div>
					</div>
				</div>

				<div className={styles.content}>
					<Section
						title='Profile'
						icon={<Code className={styles.icon} />}
						expanded={expandedSections.profile}
						toggleExpand={() => toggleSection('profile')}>
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
						title='Technical Expertise'
						icon={<Cpu className={styles.icon} />}
						expanded={expandedSections.expertise}
						toggleExpand={() => toggleSection('expertise')}>
						<div className={styles.skillsGrid}>
							{[
								'Next.js',
								'React.js',
								'Nest.js',
								'Java',
								'Tailwind CSS',
								'React Native',
							].map(skill => (
								<span key={skill} className={styles.skill}>
									{skill}
								</span>
							))}
						</div>
					</Section>

					<Section
						title='Professional Journey'
						icon={<Zap className={styles.icon} />}
						expanded={expandedSections.journey}
						toggleExpand={() => toggleSection('journey')}>
						<ul className={styles.timeline}>
							<TimelineItem
								title='Lead Engineer at QWERTY'
								date='May 2024 - Present'
								description='Leading ideation and development, working on various projects, providing innovative and sustainable solutions based on client needs.'
							/>
							<TimelineItem
								title='Freelance Full Stack Developer'
								date='May 2023 - May 2024'
								description='Built a diverse portfolio of projects using the latest technologies and best practices while interacting with clients and corporations.'
							/>
							<TimelineItem
								title='Full Stack Developer at Stitches Studio'
								date='March 2024 - May 2024'
								description='Worked in a SCRUM environment on the Education Basket Systems, using React.js and Nest.js to upgrade and maintain the existing system.'
							/>
						</ul>
					</Section>

					<Section
						title='Educational Background'
						icon={<Book className={styles.icon} />}
						expanded={expandedSections.education}
						toggleExpand={() => toggleSection('education')}>
						<ul className={styles.educationList}>
							<EducationItem
								school='Holy Spirit University of Kaslik (USEK)'
								date='September 2021 - Present'
								degree="Bachelor's in Computer Engineering"
								grade='Current GPA: 90.15'
							/>
							<EducationItem
								school='GGTA2 Public School'
								date='September 2019 - June 2021'
								degree='Lebanese Baccalaureate in Life Sciences'
								grade='Grade: 18.4/20 (Ranked 19th in Lebanon)'
							/>
						</ul>
					</Section>

					<Section
						title='Community Involvement'
						icon={<Users className={styles.icon} />}
						expanded={expandedSections.involvement}
						toggleExpand={() => toggleSection('involvement')}>
						<ul className={styles.involvementList}>
							<li className={styles.involvementItem}>
								Active Committee Member at IEEE USEK SB (December 2022 -
								December 2023)
							</li>
							<li className={styles.involvementItem}>
								Student Representative of the School of Engineering at USEK
								(October 2022 - October 2023)
							</li>
							<li className={styles.involvementItem}>
								Social Worker at APSAD (October 2021 - February 2022)
							</li>
						</ul>
					</Section>
				</div>
			</div>
		</>
	)
}

const Section = ({ title, icon, children, expanded, toggleExpand }) => (
	<section className={`${styles.section} ${expanded ? styles.expanded : ''}`}>
		<h3 className={styles.sectionTitle} onClick={toggleExpand}>
			{icon}
			{title}
			{expanded ? (
				<ChevronUp className={styles.icon} />
			) : (
				<ChevronDown className={styles.icon} />
			)}
		</h3>
		<div className={styles.sectionContent}>{children}</div>
	</section>
)

const TimelineItem = ({ title, date, description }) => (
	<li className={styles.timelineItem}>
		<h4 className={styles.jobTitle}>{title}</h4>
		<p className={styles.jobDate}>{date}</p>
		<p className={styles.jobDescription}>{description}</p>
	</li>
)

const EducationItem = ({ school, date, degree, grade }) => (
	<li className={styles.educationItem}>
		<h4 className={styles.schoolName}>{school}</h4>
		<p className={styles.educationDate}>{date}</p>
		<p className={styles.educationDetail}>{degree}</p>
		<p className={styles.educationGrade}>{grade}</p>
	</li>
)

export default AboutPage
