import Link from 'next/link'
import styles from '../styles/404.module.css'

const NotFoundPage = () => {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>404 - Page Not Found</h1>
			<p className={styles.description}>
				Oops! The file you are looking for does not exist in this project.
			</p>
			<Link href='/'>
				<a className={styles.button}>Go back to homepage</a>
			</Link>
		</div>
	)
}

export default NotFoundPage
