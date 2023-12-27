import { writable } from 'svelte/store';

export function createTetraPieceStore(initial) {
	let uid = 1;

	const tetrapieces = initial.map((shape) => {
		return {
			id: uid++,
			shape
		};
	});

	const { subscribe, update } = writable(tetrapieces);

	return {
		subscribe,
		add: (shape) => {
			const tetrapiece = {
				id: uid++,
				shape
			};

			update(($tetrapieces) => [...$tetrapieces, tetrapiece]);
		},
		remove: (tetrapiece) => {
			update(($tetrapieces) => $tetrapieces.filter((t) => t !== tetrapiece));
		}
	};
}
