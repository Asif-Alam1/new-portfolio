import React from 'react'
import Image from 'next/image'
import {
	Terminal,
	Code,
	Cpu,
	Zap,
	Book,
	Users,
	Github,
	Linkedin,
	Download
} from 'lucide-react'
import Link from 'next/link'
import styles from '../styles/AboutPage.module.css'
import CustomHead from '../components/Head'

const AboutPage = () => {
	return (
		<>
			<CustomHead
				title='About Me Page'
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
								</span>
							</Link>
						</div>
					</div>
				</div>

				<div className={styles.content}>
					<section className={styles.section}>
						<h3 className={styles.sectionTitle}>
							<Code className={styles.icon} />
							Profile
						</h3>
						<p className={styles.paragraph}>
							A top software engineer and computer engineering student with
							remarkably high grades and diverse work experience across various
							sectors.
						</p>
						<p className={styles.paragraph}>
							Equipped with excellent critical thinking and problem-solving
							skills, multilingual capabilities, and a passion for programming.
						</p>
						<p className={styles.paragraph}>
							With a year of field experience, I'm eager to tackle new
							challenges and push the boundaries of technology.
						</p>
					</section>

					<section className={styles.section}>
						<h3 className={styles.sectionTitle}>
							<Cpu className={styles.icon} />
							Technical Expertise
						</h3>
						<div className={styles.skillsGrid}>
							{[
								'Next.js',
								'React.js',
								'Nest.js',
								'Java',
								'Tailwind CSS',
								'React Native',
								'Python'
							].map(skill => (
								<span key={skill} className={styles.skill}>
									{skill}
								</span>
							))}
						</div>
					</section>

					<section className={styles.section}>
						<h3 className={styles.sectionTitle}>
							<Zap className={styles.icon} />
							Professional Journey
						</h3>
						<ul className={styles.timeline}>
							<li className={styles.timelineItem}>
								<h4 className={styles.jobTitle}>Lead Engineer at QWERTY</h4>
								<p className={styles.jobDate}>May 2024 - Present</p>
								<p className={styles.jobDescription}>
									Leading ideation and development, working on various projects,
									providing innovative and sustainable solutions based on client
									needs.
								</p>
							</li>
							<li className={styles.timelineItem}>
								<h4 className={styles.jobTitle}>
									Freelance Full Stack Developer
								</h4>
								<p className={styles.jobDate}>May 2023 - May 2024</p>
								<p className={styles.jobDescription}>
									Built a diverse portfolio of projects using the latest
									technologies and best practices while interacting with clients
									and corporations.
								</p>
							</li>
							<li className={styles.timelineItem}>
								<h4 className={styles.jobTitle}>
									Full Stack Developer at Stitches Studio
								</h4>
								<p className={styles.jobDate}>March 2024 - May 2024</p>
								<p className={styles.jobDescription}>
									Worked in a SCRUM environment on the Education Basket Systems,
									using React.js and Nest.js to upgrade and maintain the
									existing system.
								</p>
							</li>
						</ul>
					</section>

					<section className={styles.section}>
						<h3 className={styles.sectionTitle}>
							<Book className={styles.icon} />
							Educational Background
						</h3>
						<ul className={styles.educationList}>
							<li className={styles.educationItem}>
								<h4 className={styles.schoolName}>
									Holy Spirit University of Kaslik (USEK)
								</h4>
								<p className={styles.educationDate}>September 2021 - Present</p>
								<p className={styles.educationDetail}>
									Bachelor's in Computer Engineering
								</p>
								<p className={styles.educationGrade}>Current GPA: 90.15</p>
							</li>
							<li className={styles.educationItem}>
								<h4 className={styles.schoolName}>GGTA2 Public School</h4>
								<p className={styles.educationDate}>
									September 2019 - June 2021
								</p>
								<p className={styles.educationDetail}>
									Lebanese Baccalaureate in Life Sciences
								</p>
								<p className={styles.educationGrade}>
									Grade: 18.4/20 (Ranked 19th in Lebanon)
								</p>
							</li>
						</ul>
					</section>

					<section className={styles.section}>
						<h3 className={styles.sectionTitle}>
							<Users className={styles.icon} />
							Community Involvement
						</h3>
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
					</section>
				</div>
			</div>
		</>
	)
}

export async function getStaticProps() {
	return {
		props: { title: 'About Me Page' }
	}
}

export default AboutPage
