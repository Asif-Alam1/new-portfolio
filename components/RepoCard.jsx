import { useState } from 'react'
import WatchIcon from '../components/icons/WatchIcon'
import ForkIcon from '../components/icons/ForkIcon'
import StarIcon from '../components/icons/StarIcon'
import GithubIcon from '../components/icons/GithubIcon'
import LinkIcon from '../components/icons/LinkIcon'
import styles from '../styles/RepoCard.module.css'
import Link from 'next/link'

const RepoCard = ({ repo }) => {
	const [isHovered, setIsHovered] = useState(false)

	return (
		<div
			className={styles.card}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}>
			<div className={styles.content}>
				<h3 className={styles.title}>{repo.name}</h3>
				<p className={styles.description}>{repo.description}</p>
			</div>
			<div className={styles.stats}>
				<div className={styles.statRow}>
					<div className={styles.stat}>
						<StarIcon className={styles.icon} /> {repo.stargazers_count}
					</div>
					<div className={styles.stat}>
						<ForkIcon className={styles.icon} /> {repo.forks}
					</div>
					<div className={styles.stat}>
						<WatchIcon className={styles.icon} /> {repo.watchers}
					</div>
				</div>
				<div className={styles.links}>
					<Link
						href={repo.html_url}
						target='_blank'
						rel='noopener noreferrer'
						className={styles.link}>
						<GithubIcon height={20} width={20} className={styles.icon} />
						{isHovered && <span>View on GitHub</span>}
					</Link>
					{repo.homepage && (
						<Link
							href={repo.homepage}
							target='_blank'
							rel='noopener noreferrer'
							className={styles.link}>
							<LinkIcon height={20} width={20} className={styles.icon} />
							{isHovered && <span>Live Demo</span>}
						</Link>
					)}
				</div>
			</div>
		</div>
	)
}

export default RepoCard
