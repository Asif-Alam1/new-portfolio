import React from 'react'
import Link from 'next/link'
import Illustration from '../components/Illustration'
import styles from '../styles/HomePage.module.css'
import CustomHead from '../components/Head'

export default function HomePage() {
	return (
		<>
			<CustomHead
				title='HomePage'
				description='Asif Alam is a Software Engineer building the future through innovative web development. Explore his portfolio and projects.'
			/>
			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.textContent}>
						<h1 className={styles.title}>
							<span className={styles.titleLine}>I BUILD</span>
							<span className={styles.titleLine}>THE FUTURE</span>
						</h1>
						<div className={styles.info}>
							<h2 className={styles.name}>Asif Alam</h2>
							<h3 className={styles.bio}>Software Engineer</h3>
						</div>
						<div className={styles.cta}>
							<Link href='/projects'>
								<button className={styles.button}>View Work</button>
							</Link>
							<Link href='/contact'>
								<button className={styles.outlined}>Contact Me</button>
							</Link>
						</div>
					</div>
					<div className={styles.illustrationWrapper}>
						<Illustration className={styles.illustration} />
					</div>
				</div>
				<div className={styles.backgroundText}>
					<span>INNOVATE</span>
					<span>CREATE</span>
					<span>DEVELOP</span>
				</div>
			</div>
		</>
	)
}

export async function getStaticProps() {
	return {
		props: { title: 'HomePage' }
	}
}
