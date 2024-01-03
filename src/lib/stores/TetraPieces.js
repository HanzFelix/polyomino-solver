import { writable } from 'svelte/store';

function createTetraPieceStore() {
	let uid = 1;
	const tetrapieces = {};

	const { subscribe, update, set } = writable(tetrapieces);

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
		init: (pieces) => {
			uid = 1;
			const p = pieces.map((shape) => {
				return {
					id: uid++,
					shape,
					quantity: 0,
					weight: shape.reduce((count, row) => count + row.filter((x) => x !== 0).length, 0)
				};
			});
			set(p);
		},
		remove: (id) => {
			update(($tetrapieces) => $tetrapieces.filter((t) => t.id !== id));
		}
	};
}

export const tetrapieces = createTetraPieceStore();
