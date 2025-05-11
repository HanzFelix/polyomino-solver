import { writable } from 'svelte/store';

function createTetraColorStore() {
	const tetracolors = {
		0: /*'var(--color-tbrown-50)'*/ '#f9eee5',
		X: /*'var(--color-tcyan-400)'*/ '#949baa'
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
					0: /*'var(--color-tbrown-50)'*/ '#f9eee5',
					X: /*'var(--color-tcyan-400)'*/ '#949baa'
				};
				for (const color of initialcolors) {
					colors[uid++] = color;
				}
				set(colors);
			} else if (initialcolors instanceof Object) {
				initialcolors[0] = /*'var(--color-tbrown-50)'*/ '#f9eee5';
				initialcolors['X'] = /*'var(--color-tcyan-400)'*/ '#949baa';
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
