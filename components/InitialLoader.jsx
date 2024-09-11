'use client'

import { useState, useEffect } from 'react'
import styles from '../styles/InitialLoader.module.css'

export default function InitialLoader() {
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false)
		}, 4000) // Loader will be visible for 4 seconds

		return () => clearTimeout(timer)
	}, [])

	if (!isVisible) return null

	return (
		<div className={styles.loaderContainer}>
			<div className={styles.loaderContent}>
				<div className={styles.codeEditor}>
					<div className={styles.line}>
						<span className={styles.function}>function</span>
						<span className={styles.name}> initPortfolio</span>
						<span className={styles.punctuation}>()</span>
						<span className={styles.punctuation}> {`{`}</span>
					</div>
					<div className={styles.line}>
						<span className={styles.keyword}>const</span>
						<span className={styles.variable}> experience </span>
						<span className={styles.operator}>= </span>
						<span className={styles.string}>"Software Engineer"</span>
						<span className={styles.punctuation}>;</span>
					</div>
					<div className={styles.line}>
						<span className={styles.keyword}>let</span>
						<span className={styles.variable}> skills </span>
						<span className={styles.operator}>= </span>
						<span className={styles.punctuation}>[</span>
						<span className={styles.string}>"React"</span>
						<span className={styles.punctuation}>,</span>
						<span className={styles.string}> "Next.js"</span>
						<span className={styles.punctuation}>,</span>
						<span className={styles.string}> "Node.js"</span>
						<span className={styles.punctuation}>]</span>
						<span className={styles.punctuation}>;</span>
					</div>
					<div className={styles.line}>
						<span className={styles.keyword}>return </span>
						<span className={styles.punctuation}>{`{`}</span>
						<span className={styles.variable}> name</span>
						<span className={styles.punctuation}>:</span>
						<span className={styles.string}> "Asif Alam"</span>
						<span className={styles.punctuation}>,</span>
						<span className={styles.variable}> experience</span>
						<span className={styles.punctuation}>,</span>
						<span className={styles.variable}> skills </span>
						<span className={styles.punctuation}>{`}`}</span>
						<span className={styles.punctuation}>;</span>
					</div>
					<div className={styles.line}>
						<span className={styles.punctuation}>{`}`}</span>
					</div>
				</div>
				<div className={styles.cursor}></div>
				<h2 className={styles.loaderTitle}>Initializing Portfolio...</h2>
				<p className={styles.loaderText}>
					For the best experience, please view on a laptop or desktop device.
				</p>
			</div>
		</div>
	)
}
