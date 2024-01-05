/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				tcyan: {
					300: '#CED5D5',
					400: '#9BAAAA',
					900: '#325453'
				},
				tbrown: {
					50: '#F9EEE5',
					300: '#DCB79F',
					500: '#9C664B',
					900: '#47342B'
				}
			}
		}
	},
	plugins: []
};
