'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSpring, animated, config } from 'react-spring'
import { TypeAnimation } from 'react-type-animation'
import Illustration from '../components/Illustration'
import CustomHead from '../components/Head'
import ParticleBackground from '../components/ParticleBackground'
import InitialLoader from '../components/InitialLoader'
import styles from '../styles/HomePage.module.css'

export default function HomePage() {
	const [showLoader, setShowLoader] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowLoader(false)
		}, 2500)

		return () => clearTimeout(timer)
	}, [])

	const fadeIn = useSpring({
		opacity: 1,
		transform: 'translateY(0)',
		from: { opacity: 0, transform: 'translateY(50px)' },
		config: config.molasses,
		delay: 2600
	})

	const illustrationSpring = useSpring({
		loop: { reverse: true },
		to: { transform: 'translateY(-15px)' },
		from: { transform: 'translateY(0px)' },
		config: { duration: 3000 }
	})

	const backgroundTextSpring = useSpring({
		loop: true,
		to: [
			{ opacity: 0.05, color: 'rgba(255, 255, 255, 0.05)' },
			{ opacity: 0.02, color: 'rgba(255, 255, 255, 0.02)' }
		],
		from: { opacity: 0.02, color: 'rgba(255, 255, 255, 0.02)' },
		config: { duration: 3000 }
	})

	return (
		<>
			{showLoader ? (
				<InitialLoader />
			) : (
				<>
					<CustomHead
						title='Asif Alam - Innovative Software Engineer'
						description='Asif Alam is a Software Engineer building the future through innovative web development. Explore his portfolio and projects.'
					/>
					<div className={styles.container}>
						<ParticleBackground />
						<animated.div style={fadeIn} className={styles.content}>
							<div className={styles.textContent}>
								<h1 className={styles.title}>
									<span className={styles.titleLine}>I BUILD</span>
									<span className={styles.titleLine}>THE FUTURE</span>
								</h1>
								<div className={styles.info}>
									<h2 className={styles.name}>Asif Alam</h2>
									<h3 className={styles.bio}>
										<TypeAnimation
											sequence={[
												'Software Engineer',
												2000,
												'Full Stack Developer',
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
										<animated.button
											className={styles.button}
											>
											View Work
										</animated.button>
									</Link>
									<Link href='/contact' passHref>
										<button className={styles.outlined}>Contact Me</button>
									</Link>
								</div>
							</div>
							<div className={styles.illustrationWrapper}>
								<animated.div style={illustrationSpring}>
									<Illustration className={styles.illustration} />
								</animated.div>
							</div>
						</animated.div>
						<animated.div
							style={backgroundTextSpring}
							className={styles.backgroundText}>
							<span>INNOVATE</span>
							<span>CREATE</span>
							<span>DEVELOP</span>
						</animated.div>
					</div>
				</>
			)}
		</>
	)
}