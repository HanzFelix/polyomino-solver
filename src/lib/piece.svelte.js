export let uid = 1;

export class Piece {
	quantity = $state();

	/** @type {{shape: Array}} */
	constructor(shape) {
		this.id = uid++;
		this.shape = shape;
		this.quantity = 0;
		this.weight = shape.reduce((count, row) => count + row.filter((x) => x !== 0).length, 0);
		this.orientations = generateOrientations(shape);
	}
}

function generateOrientations(piece) {
	const rotations = [];
	const rotationSet = new Set();
	let currentPiece = piece;

	for (let i = 0; i < 4; i++) {
		// Convert to string
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
