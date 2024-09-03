import { useState } from 'react'
import Image from 'next/image'
import GitHubCalendar from 'react-github-calendar'
import RepoCard from '../components/RepoCard'
import styles from '../styles/GithubPage.module.css'
import CustomHead from '../components/Head'

const GithubPage = ({ repos, user }) => {
	const [filter, setFilter] = useState('')

	const filteredRepos = repos.filter(
		repo =>
			repo.name.toLowerCase().includes(filter.toLowerCase()) ||
			(repo.description &&
				repo.description.toLowerCase().includes(filter.toLowerCase()))
	)

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
				title='GitHub'
				description="View Asif Alam's GitHub profile, top repositories, and contribution graph. Discover his open-source projects and coding activity."
			/>
			<div className={styles.githubContainer}>
				<div className={styles.userInfo}>
					<div className={styles.userDetails}>
						<Image
							src={user.avatar_url}
							className={styles.avatar}
							alt={user.login}
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
				<input
					type='text'
					placeholder='Search repositories...'
					className={styles.searchInput}
					onChange={e => setFilter(e.target.value)}
				/>

				<div className={styles.repoContainer}>
					{filteredRepos.map(repo => (
						<RepoCard key={repo.id} repo={repo} />
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
		</>
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
		props: { title: 'GitHub', repos, user },
		revalidate: 10
	}
}

export default GithubPage
