import { writable, derived } from 'svelte/store';

function createTetraPieceStore() {
	let uid = 1;
	const tetrapieces = [];

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
			const p = pieces.map((pieceshape) => {
				return {
					id: uid++,
					shape: pieceshape,
					quantity: 0,
					weight: pieceshape.reduce((count, row) => count + row.filter((x) => x !== 0).length, 0)
				};
			});
			set(p);
		},
		refresh: () => {
			update(($tetrapieces) => $tetrapieces);
		},
		remove: (id) => {
			update(($tetrapieces) => $tetrapieces.filter((t) => t.id !== id));
		}
	};
}

export const tetrapieces = createTetraPieceStore();
export const pieceweights = derived(tetrapieces, ($tetrapieces) =>
	$tetrapieces.reduce((sum, piece) => sum + piece.quantity * piece.weight, 0)
);
