import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Head from '../components/Head'
import '../styles/globals.css'
import '../styles/themes.css'
import CustomCursor from '../components/CustomCursor'

function MyApp({ Component, pageProps }) {
	useEffect(() => {
		const savedTheme = localStorage.getItem('theme')
		if (savedTheme) {
			document.documentElement.setAttribute('data-theme', savedTheme)
		} else {
			// Set your desired default theme here
			const defaultTheme = 'ayu-dark' // You can change this to any available theme
			document.documentElement.setAttribute('data-theme', defaultTheme)
			localStorage.setItem('theme', defaultTheme)
		}
	}, [])

	return (
		<Layout>
			<Head title={`Asif Alam | ${pageProps.title}`} />
			<Component {...pageProps} />
			<CustomCursor />
		</Layout>
	)
}

export default MyApp
