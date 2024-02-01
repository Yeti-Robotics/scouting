/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			colors: {
				'yeti-blue': '#54B6E5',
				'bubble-gum': '#ff77e9',
				bermuda: '#78dcca',
				'eerie-black': '#1A1B1E',
			},
			fontFamily: {
				sans: ['Open Sans', 'sans-serif'],
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
