'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Code, ExternalLink } from 'lucide-react'
import { getProjects } from './api/projects'
import CustomHead from '../components/Head'
import styles from '../styles/ProjectsPage.module.css'

const ProjectsPage = ({ projects }) => {
	const [filter, setFilter] = useState('All')
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredProjects, setFilteredProjects] = useState(projects)
	const [selectedProject, setSelectedProject] = useState(null)

	const allTags = ['All', ...new Set(projects.flatMap(project => project.tags))]

	useEffect(() => {
		const filtered = projects.filter(
			project =>
				(filter === 'All' || project.tags.includes(filter)) &&
				project.name.toLowerCase().includes(searchTerm.toLowerCase())
		)
		setFilteredProjects(filtered)
	}, [filter, searchTerm, projects])

	return (
		<>
			<CustomHead
				title='Portfolio Projects'
				description="Explore Asif Alam's diverse portfolio of web development projects, showcasing expertise in Next.js, React.js, and more."
			/>
			<div className={styles.projectsContainer}>
				<h2 className={styles.heading}>
					My Tech Journey: Projects & Creations
				</h2>
				<div className={styles.filterContainer}>
					<div className={styles.searchInputWrapper}>
						<Search className={styles.searchIcon} />
						<input
							type='text'
							placeholder='Search projects...'
							className={styles.searchInput}
							onChange={e => setSearchTerm(e.target.value)}
						/>
					</div>
					<div className={styles.tagFilter}>
						{allTags.map(tag => (
							<button
								key={tag}
								className={`${styles.tagButton} ${
									filter === tag ? styles.active : ''
								}`}
								onClick={() => setFilter(tag)}>
								{tag}
							</button>
						))}
					</div>
				</div>
				<div className={styles.projectGrid}>
					{filteredProjects.map(project => (
						<ProjectCard
							key={project.id}
							project={project}
							onClick={() => setSelectedProject(project)}
						/>
					))}
				</div>
				{filteredProjects.length === 0 && (
					<p className={styles.noResults}>
						No projects found. Try adjusting your search or filter.
					</p>
				)}
			</div>
			{selectedProject && (
				<ProjectModal
					project={selectedProject}
					onClose={() => setSelectedProject(null)}
				/>
			)}
		</>
	)
}

const ProjectCard = ({ project, onClick }) => {
	return (
		<div className={styles.card} onClick={onClick}>
			<div className={styles.imageContainer}>
				<Image
					src={project.image}
					layout='fill'
					objectFit='cover'
					alt={project.name}
					className={styles.image}
				/>
				<div className={styles.overlay}>
					<h3 className={styles.projectName}>{project.name}</h3>
					<div className={styles.tags}>
						{project.tags.map(tag => (
							<span
								key={tag}
								className={`${styles.tag} ${styles[tag] || styles.defaultTag}`}>
								{tag}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

const ProjectModal = ({ project, onClose }) => {
	return (
		<div className={styles.modalOverlay} onClick={onClose}>
			<div className={styles.modalContent} onClick={e => e.stopPropagation()}>
				<button className={styles.closeButton} onClick={onClose}>
					&times;
				</button>
				<h3 className={styles.modalTitle}>{project.name}</h3>
				<div className={styles.modalImageContainer}>
					<Image
						src={project.image}
						layout='fill'
						objectFit='cover'
						alt={project.name}
						className={styles.modalImage}
					/>
				</div>
				<p className={styles.modalDescription}>{project.description}</p>
				<div className={styles.modalTags}>
					{project.tags.map(tag => (
						<span
							key={tag}
							className={`${styles.tag} ${styles[tag] || styles.defaultTag}`}>
							{tag}
						</span>
					))}
				</div>
				<div className={styles.modalCta}>
					{project.source_code && (
						<Link
							href={project.source_code}
							target='_blank'
							rel='noopener noreferrer'
							className={styles.modalButton}>
							<>
								<Code size={18} />
								Source Code
							</>
						</Link>
					)}
					{project.demo && (
						<Link
							href={project.demo}
							target='_blank'
							rel='noopener noreferrer'
							className={styles.modalButton}>
							<>
								<ExternalLink size={18} />
								Live Demo
							</>
						</Link>
					)}
				</div>
			</div>
		</div>
	)
}

export async function getStaticProps() {
	const projects = getProjects()

	return {
		props: { title: 'Portfolio Projects', projects }
	}
}

export default ProjectsPage
