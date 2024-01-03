import { writable } from 'svelte/store';
import tailwindConfig from 'tailwindConfig';
import resolveConfig from 'tailwindcss/resolveConfig';

const configColors = resolveConfig(tailwindConfig).theme.colors;

function createTetraColorStore() {
	const tetracolors = {
		0: configColors.tbrown['50'],
		X: configColors.tcyan['400']
	};
	let uid = 1;

	const { subscribe, set, update } = writable(tetracolors);

	return {
		subscribe,
		add: (color) => {
			update((tetracolors) => (tetracolors[uid++] = color));
		},
		init: (initialcolors) => {
			if (initialcolors instanceof Array) {
				uid = 1;
				let colors = {
					0: configColors.tbrown['50'],
					X: configColors.tcyan['400']
				};
				for (const color of initialcolors) {
					colors[uid++] = color;
				}
				set(colors);
			} else if (initialcolors instanceof Object) {
				initialcolors[0] = configColors.tbrown['50'];
				initialcolors['X'] = configColors.tcyan['400'];
				uid = 1 + Object.keys(initialcolors).length;
				set(initialcolors);
			} else {
				// throw an error?
			}
		}
		// TODO: how to implement remove:
	};
}

export const tetracolors = createTetraColorStore();
