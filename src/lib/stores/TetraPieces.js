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
				weight: shape.reduce((count, row) => count + row.filter((x) => x !== 0).length, 0),
				orientations: generateOrientations(shape)
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
					weight: pieceshape.reduce((count, row) => count + row.filter((x) => x !== 0).length, 0),
					orientations: generateOrientations(pieceshape)
				};
			});
			set(p);
		},
		refresh: () => {
			update(($tetrapieces) => $tetrapieces);
		},
		resetQuantity: () => {
			update(($tetrapieces) => $tetrapieces.map((piece) => ({ ...piece, quantity: 0 })));
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

function generateOrientations(piece) {
	const rotations = [];
	const rotationSet = new Set();
	let currentPiece = piece;

	for (let i = 0; i < 4; i++) {
		// Convert the to string
		const rotationS = JSON.stringify(currentPiece);

		// Add unique shape
		if (!rotationSet.has(rotationS)) {
			rotations.push(currentPiece);
			rotationSet.add(rotationS);
		}

		currentPiece = rotatePiece(currentPiece);
	}
	return rotations;
}

function rotatePiece(matrix) {
	const rows = matrix.length;
	const cols = matrix[0].length;
	const rotated = [];

	for (let j = 0; j < cols; j++) {
		rotated.push([]);
		for (let i = rows - 1; i >= 0; i--) {
			rotated[j].push(matrix[i][j]);
		}
	}

	return rotated;
}
