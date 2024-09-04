import { useState } from 'react'
import ContactCode from '../components/ContactCode'
import styles from '../styles/ContactPage.module.css'
import CustomHead from '../components/Head'

const ContactPage = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [message, setMessage] = useState('')
	const [submitted, setSubmitted] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async e => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name, email, message })
			})

			if (response.ok) {
				console.log('Email sent successfully')
				setName('')
				setEmail('')
				setMessage('')
				setSubmitted(true)
			} else {
				console.error('Failed to send email')
				setError('Failed to send message. Please try again.')
			}
		} catch (error) {
			console.error('Error:', error)
			setError('An unexpected error occurred. Please try again.')
		}

		setIsLoading(false)
	}

	return (
		<>
			<CustomHead
				title='Contact and Socials Page'
				description='Get in touch with Asif Alam. Send a message or connect via social media to discuss web development projects or opportunities.'
			/>
			<div className={styles.container}>
				<div className={styles.codeContainer}>
					<h3 className={styles.heading}>Connect With Me</h3>
					<ContactCode />
				</div>
				<div className={styles.formContainer}>
					<h3 className={styles.heading}>Send Me a Message</h3>
					{submitted ? (
						<div className={styles.thankYou}>
							<h4>Thank you for your message!</h4>
							<p>I'll get back to you as soon as possible.</p>
						</div>
					) : (
						<form className={styles.form} onSubmit={handleSubmit}>
							<div className={styles.formGroup}>
								<label htmlFor='name'>Name</label>
								<input
									type='text'
									id='name'
									value={name}
									onChange={e => setName(e.target.value)}
									required
								/>
							</div>
							<div className={styles.formGroup}>
								<label htmlFor='email'>Email</label>
								<input
									type='email'
									id='email'
									value={email}
									onChange={e => setEmail(e.target.value)}
									required
								/>
							</div>
							<div className={styles.formGroup}>
								<label htmlFor='message'>Message</label>
								<textarea
									id='message'
									value={message}
									onChange={e => setMessage(e.target.value)}
									required></textarea>
							</div>
							{error && <p className={styles.error}>{error}</p>}
							<button type='submit' disabled={isLoading}>
								{isLoading ? 'Sending...' : 'Send Message'}
							</button>
						</form>
					)}
				</div>
			</div>
		</>
	)
}

export async function getStaticProps() {
	return {
		props: { title: 'Contact and Socials' }
	}
}

export default ContactPage
