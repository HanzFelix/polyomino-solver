import { writable } from 'svelte/store';

export function createTetraSolutionStore(initial) {
	let uid = 1;

	const tetrasolutions = initial.map((shape) => {
		return {
			id: uid++,
			shape
		};
	});

	const { subscribe, update, set } = writable(tetrasolutions);

	return {
		subscribe,
		add: (shape) => {
			const tetrasolution = {
				id: uid++,
				shape
			};

			update(($tetrasolutions) => [...$tetrasolutions, tetrasolution]);
		},
		remove: (tetrasolution) => {
			update(($tetrasolutions) => $tetrasolutions.filter((t) => t !== tetrasolution));
		},
		reset: () => set([])
	};
}
