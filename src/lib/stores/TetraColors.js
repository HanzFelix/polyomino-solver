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
			initialcolors[0] = configColors.tbrown['50'];
			initialcolors['X'] = configColors.tcyan['400'];
			set(initialcolors);
			uid = 1 + Object.keys(initialcolors).length;
		},
		remove: (tetrapiece) => {
			update(($tetrapieces) => $tetrapieces.filter((t) => t !== tetrapiece));
		}
	};
}

export const tetracolors = createTetraColorStore();
