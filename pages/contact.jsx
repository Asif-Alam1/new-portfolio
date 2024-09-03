import { useState } from 'react'
import ContactCode from '../components/ContactCode'
import styles from '../styles/ContactPage.module.css'
import CustomHead from '../components/Head'
const ContactPage = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [message, setMessage] = useState('')
	const [submitted, setSubmitted] = useState(false)

	const handleSubmit = e => {
		e.preventDefault()
		// Here you would typically send the form data to your backend
		console.log({ name, email, message })
		setSubmitted(true)
	}

	return (
		<>
			<CustomHead
				title='Contact'
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
							<button type='submit'>Send Message</button>
						</form>
					)}
				</div>
			</div>
		</>
	)
}

export async function getStaticProps() {
	return {
		props: { title: 'Contact' }
	}
}

export default ContactPage
