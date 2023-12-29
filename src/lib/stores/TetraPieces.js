import { writable } from 'svelte/store';

export function createTetraPieceStore(initial) {
	let uid = 1;

	const tetrapieces = initial.map((shape) => {
		return {
			id: uid++,
			shape,
			quantity: 0,
			weight: shape.reduce((count, row) => count + row.filter((x) => x !== 0).length, 0)
		};
	});

	const { subscribe, update } = writable(tetrapieces);

	return {
		subscribe,
		add: (shape) => {
			const tetrapiece = {
				id: uid++,
				shape,
				quantity: 0,
				weight: shape.reduce((count, row) => count + row.filter((x) => x !== 0).length, 0)
			};

			update(($tetrapieces) => [...$tetrapieces, tetrapiece]);
		},
		remove: (tetrapiece) => {
			update(($tetrapieces) => $tetrapieces.filter((t) => t !== tetrapiece));
		}
	};
}
