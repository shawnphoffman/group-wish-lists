/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './node_modules/preline/preline.js'],
	// darkMode: 'media',
	plugins: [require('@tailwindcss/forms'), require('preline/plugin')],
}
