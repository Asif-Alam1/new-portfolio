module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}'
	],
	theme: {
		extend: {
			animation: {
				blink: 'blink 0.7s infinite'
			},
			keyframes: {
				blink: {
					'0%, 100%': { opacity: 0 },
					'50%': { opacity: 1 }
				}
			}
		}
	},
	plugins: []
}
