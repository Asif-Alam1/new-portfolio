import Image from 'next/image'
import { useState } from 'react'
import styles from '../styles/ProjectCard.module.css'

const ProjectCard = ({ project }) => {
	const [isHovered, setIsHovered] = useState(false)

	return (
		<div
			className={styles.card}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}>
			<div className={styles.imageContainer}>
				<Image
					src={project.image}
					layout='fill'
					objectFit='cover'
					alt={project.name}
					className={styles.image}
				/>
				{isHovered && (
					<div className={styles.overlay}>
						<h3 className={styles.projectName}>{project.name}</h3>
						<p className={styles.description}>{project.description}</p>
						<div className={styles.tags}>
							{project.tags.map(tag => (
								<span
									key={tag}
									className={`${styles.tag} ${
										styles[tag] || styles.defaultTag
									}`}>
									{tag}
								</span>
							))}
						</div>
						<div className={styles.cta}>
							{project.source_code && (
								<a
									href={project.source_code}
									target='_blank'
									rel='noopener noreferrer'
									className={styles.button}>
									Source Code
								</a>
							)}
							{project.demo && (
								<a
									href={project.demo}
									target='_blank'
									rel='noopener noreferrer'
									className={styles.button}>
									Live Demo
								</a>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default ProjectCard
