import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import { getProjects } from './api/projects'
import styles from '../styles/ProjectsPage.module.css'
import CustomHead from '../components/Head'

const ProjectsPage = ({ projects }) => {
	const [filter, setFilter] = useState('All')
	const [searchTerm, setSearchTerm] = useState('')

	const allTags = ['All', ...new Set(projects.flatMap(project => project.tags))]

	const filteredProjects = projects.filter(
		project =>
			(filter === 'All' || project.tags.includes(filter)) &&
			project.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<>
			<CustomHead
				title='Projects and More'
				description="Explore Asif Alam's diverse portfolio of web development projects, showcasing expertise in Next.js, React.js, and more."
			/>
			<div className={styles.projectsContainer}>
				<h2 className={styles.heading}>
					My Tech Journey: Projects & Creations
				</h2>
				<div className={styles.filterContainer}>
					<input
						type='text'
						placeholder='Search projects...'
						className={styles.searchInput}
						onChange={e => setSearchTerm(e.target.value)}
					/>
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
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
				{filteredProjects.length === 0 && (
					<p className={styles.noResults}>
						No projects found. Try adjusting your search or filter.
					</p>
				)}
			</div>
		</>
	)
}

export async function getStaticProps() {
	const projects = getProjects()

	return {
		props: { title: 'Projects and More', projects }
	}
}

export default ProjectsPage
