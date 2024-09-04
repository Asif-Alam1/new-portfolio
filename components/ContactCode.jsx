import Link from 'next/link'
import styles from '../styles/ContactCode.module.css'

const contactItems = [
	{
		social: 'website',
		link: 'asifalam.tech',
		href: 'https://asifalam.tech'
	},
	{
		social: 'email',
		link: 'asiftalukder151@gmail.com',
		href: 'mailto:asiftalukder151@gmail.com'
	},
	{
		social: 'github',
		link: 'asif-alam1',
		href: 'https://github.com/asif-alam1'
	},
	{
		social: 'linkedin',
		link: 'asif-alam-talukder',
		href: 'https://www.linkedin.com/in/asif-alam-talukder'
	},
	{
		social: 'instagram',
		link: 'asif_.alam',
		href: 'https://www.instagram.com/asif_.alam'
	}
]

const ContactCode = () => {
	return (
		<div className={styles.code}>
			<p className={styles.line}>
				<span className={styles.className}>.socials</span> &#123;
			</p>
			{contactItems.map((item, index) => (
				<p className={styles.line} key={index}>
					&nbsp;&nbsp;<span className={styles.property}>{item.social}</span>:{' '}
					<span className={styles.value}>
						<Link href={item.href} target='_blank' rel='noopener noreferrer'>
							{item.link}
						</Link>
					</span>
					;
				</p>
			))}
			<p className={styles.line}>&#125;</p>
		</div>
	)
}

export default ContactCode
