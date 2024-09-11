'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import GitHubCalendar from 'react-github-calendar'
import { Search, Star, GitFork, Eye, Github, ExternalLink } from 'lucide-react'
import CustomHead from '../components/Head'
import styles from '../styles/GithubPage.module.css'

const GithubPage = ({ repos, user }) => {
	const [filter, setFilter] = useState('')
	const [filteredRepos, setFilteredRepos] = useState(repos)
	const [selectedRepo, setSelectedRepo] = useState(null)

	useEffect(() => {
		const filtered = repos.filter(
			repo =>
				repo.name.toLowerCase().includes(filter.toLowerCase()) ||
				(repo.description &&
					repo.description.toLowerCase().includes(filter.toLowerCase()))
		)
		setFilteredRepos(filtered)
	}, [filter, repos])

	const theme = {
		level0: '#161B22',
		level1: '#0e4429',
		level2: '#006d32',
		level3: '#26a641',
		level4: '#39d353'
	}

	return (
		<>
			<CustomHead
				title='GitHub Summary'
				description="View Asif Alam's GitHub profile, top repositories, and contribution graph. Discover his open-source projects and coding activity."
			/>
			<div className={styles.githubContainer}>
				<div className={styles.userInfo}>
					<div className={styles.userDetails}>
						<Image
							src={user.avatar_url}
							className={styles.avatar}
							alt='User Avatar'
							width={100}
							height={100}
						/>
						<div>
							<h2 className={styles.username}>{user.name || user.login}</h2>
							<p className={styles.bio}>{user.bio}</p>
						</div>
					</div>
					<div className={styles.stats}>
						<div className={styles.stat}>
							<h3>{user.public_repos}</h3>
							<p>Repositories</p>
						</div>
						<div className={styles.stat}>
							<h3>{user.followers}</h3>
							<p>Followers</p>
						</div>
						<div className={styles.stat}>
							<h3>{user.following}</h3>
							<p>Following</p>
						</div>
					</div>
				</div>

				<h2 className={styles.sectionTitle}>Top Repositories</h2>
				<div className={styles.searchInputWrapper}>
					<Search className={styles.searchIcon} />
					<input
						type='text'
						placeholder='Search repositories...'
						className={styles.searchInput}
						onChange={e => setFilter(e.target.value)}
					/>
				</div>

				<div className={styles.repoContainer}>
					{filteredRepos.map(repo => (
						<RepoCard
							key={repo.id}
							repo={repo}
							onClick={() => setSelectedRepo(repo)}
						/>
					))}
				</div>

				<h2 className={styles.sectionTitle}>Contribution Graph</h2>
				<div className={styles.contributions}>
					<GitHubCalendar
						username={process.env.NEXT_PUBLIC_GITHUB_USERNAME}
						theme={theme}
						hideColorLegend
						hideMonthLabels
					/>
				</div>
			</div>
			{selectedRepo && (
				<RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
			)}
		</>
	)
}

const RepoCard = ({ repo, onClick }) => {
	return (
		<div className={styles.card} onClick={onClick}>
			<div className={styles.content}>
				<h3 className={styles.title}>{repo.name}</h3>
				<p className={styles.description}>{repo.description}</p>
			</div>
			<div className={styles.stats}>
				<div className={styles.statRow}>
					<div className={styles.stat}>
						<Star className={styles.icon} /> {repo.stargazers_count}
					</div>
					<div className={styles.stat}>
						<GitFork className={styles.icon} /> {repo.forks}
					</div>
					<div className={styles.stat}>
						<Eye className={styles.icon} /> {repo.watchers}
					</div>
				</div>
			</div>
		</div>
	)
}

const RepoModal = ({ repo, onClose }) => {
	return (
		<div className={styles.modalOverlay} onClick={onClose}>
			<div className={styles.modalContent} onClick={e => e.stopPropagation()}>
				<button className={styles.closeButton} onClick={onClose}>
					&times;
				</button>
				<h3 className={styles.modalTitle}>{repo.name}</h3>
				<p className={styles.modalDescription}>{repo.description}</p>
				<div className={styles.modalStats}>
					<div className={styles.modalStat}>
						<Star className={styles.icon} /> {repo.stargazers_count} stars
					</div>
					<div className={styles.modalStat}>
						<GitFork className={styles.icon} /> {repo.forks} forks
					</div>
					<div className={styles.modalStat}>
						<Eye className={styles.icon} /> {repo.watchers} watchers
					</div>
				</div>
				<div className={styles.modalLanguages}>
					<h4>Languages:</h4>
					<div className={styles.languageList}>
						{repo.language && (
							<span
								className={`${styles.language} ${
									styles[repo.language.toLowerCase()]
								}`}>
								{repo.language}
							</span>
						)}
					</div>
				</div>
				<div className={styles.modalLinks}>
					<a
						href={repo.html_url}
						target='_blank'
						rel='noopener noreferrer'
						className={styles.modalButton}>
						<Github size={18} />
						View on GitHub
					</a>
					{repo.homepage && (
						<a
							href={repo.homepage}
							target='_blank'
							rel='noopener noreferrer'
							className={styles.modalButton}>
							<ExternalLink size={18} />
							Live Demo
						</a>
					)}
				</div>
			</div>
		</div>
	)
}

export async function getStaticProps() {
	const userRes = await fetch(
		`https://api.github.com/users/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}`,
		{
			headers: {
				Authorization: `token ${process.env.GITHUB_API_KEY}`
			}
		}
	)
	const user = await userRes.json()

	const repoRes = await fetch(
		`https://api.github.com/users/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}/repos?per_page=100`,
		{
			headers: {
				Authorization: `token ${process.env.GITHUB_API_KEY}`
			}
		}
	)
	let repos = await repoRes.json()
	repos = repos
		.sort((a, b) => b.stargazers_count - a.stargazers_count)
		.slice(0, 6)

	return {
		props: { title: 'GitHub Summary', repos, user },
		revalidate: 10
	}
}

export default GithubPage
