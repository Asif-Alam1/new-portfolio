import Head from 'next/head'

const CustomHead = ({ title, description, image }) => {
	const defaultTitle = 'Asif Alam | Software Engineer'
	const defaultDescription =
		'Asif Alam is a top computer engineering student and full stack Engineer with experience in Next.js, React.js, and Nest.js. Explore his portfolio of innovative web projects.'
	const defaultImage = 'https://asif-alam-portfolio.vercel.app/export.png' // Replace with your actual OG image URL

	return (
		<Head>
			<title>{title ? `${title} | Asif Alam` : defaultTitle}</title>
			<meta name='description' content={description || defaultDescription} />
			<meta name='viewport' content='width=device-width, initial-scale=1' />
			<meta charSet='utf-8' />
			{/* Keywords based on skills and experience */}
			<meta
				name='keywords'
				content='Asif Alam, Software Engineer, Full Stack Engineer, Next.js, React.js, Nest.js, Tailwind CSS, React Native, Database Management, Software Engineering, MERN Stack, QWERTY, Stitches Studio'
			/>
			{/* Open Graph / Facebook */}
			<meta property='og:type' content='website' />
			<meta
				property='og:url'
				content='https://asif-alam-portfolio.vercel.app'
			/>{' '}
			{/* Replace with your actual website URL */}
			<meta property='og:title' content={title || defaultTitle} />
			<meta
				property='og:description'
				content={description || defaultDescription}
			/>
			<meta property='og:image' content={image || defaultImage} />
			{/* Twitter */}
			<meta name='twitter:card' content='summary_large_image' />
			<meta
				name='twitter:url'
				content='https://asif-alam-portfolio.vercel.app'
			/>{' '}
			{/* Replace with your actual website URL */}
			<meta name='twitter:title' content={title || defaultTitle} />
			<meta
				name='twitter:description'
				content={description || defaultDescription}
			/>
			<meta name='twitter:image' content={image || defaultImage} />
			{/* LinkedIn */}
			<meta property='og:site_name' content="Asif Alam's Portfolio" />
			<meta property='og:locale' content='en_US' />
			{/* Favicon */}
			<link rel='icon' href='/favicon.ico' />
			{/* Apple Touch Icon */}
			<link
				rel='apple-touch-icon'
				sizes='180x180'
				href='/apple-touch-icon.png'
			/>
			{/* Canonical URL */}
			<link
				rel='canonical'
				href='https://asif-alam-portfolio.vercel.app'
			/>{' '}
			{/* Replace with your actual website URL */}
			{/* Schema.org for Google */}
			<script type='application/ld+json'>
				{`
          {
            "@context": "http://schema.org",
            "@type": "Person",
            "name": "Asif Alam",
            "url": "https://asif-alam-portfolio.vercel.app",
            "sameAs": [
              "https://github.com/asif-alam1",
              "https://www.linkedin.com/in/asif-alam-talukder"
            ],
            "jobTitle": "Software Engineer",
            "worksFor": {
              "@type": "Organization",
              "name": "QWERTY"
            },
            "alumniOf": {
              "@type": "CollegeOrUniversity",
              "name": "Holy Spirit University of Kaslik USEK"
            }
          }
        `}
			</script>
		</Head>
	)
}

export default CustomHead

CustomHead.defaultProps = {
	title: '',
	description: '',
	image: ''
}
