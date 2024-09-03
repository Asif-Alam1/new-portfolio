// pages/api/contact.js

import nodemailer from 'nodemailer'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { name, email, message } = req.body

		// Create a transporter using Gmail
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS
			}
		})

		// Define email options
		const mailOptions = {
			from: 'noreply@notqwerty.com', // Replace with your email
			to: 'asif.k.alam@net.usek.edu.lb', // Replace with your email
			subject: 'New Contact Form Submission',
			text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
			html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
		}

		try {
			// Send mail
			await transporter.sendMail(mailOptions)
			res.status(200).json({ message: 'Email sent successfully' })
		} catch (error) {
			console.error('Error sending email:', error)
			res.status(500).json({ error: 'Error sending email' })
		}
	} else {
		res.setHeader('Allow', ['POST'])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
