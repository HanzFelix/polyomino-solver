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
					50: '#F9F7F4',
					300: '#DCBE87',
					500: '#AB7954',
					900: '#58412A'
				}
			}
		}
	},
	plugins: []
};
