export let uid = 1;

export class Piece {
	quantity = $state();
	shape = $derived(this.orientations[0]);

	/** @type {{shape: Array}} */
	constructor(shape) {
		this.id = uid++;
		this.quantity = 0;
		this.weight = shape.reduce((count, row) => count + row.filter((x) => x !== 0).length, 0);
		this.orientations = generateOrientations(shape);
	}

	trim() {
		for (let o = 0; o < this.orientations.length; o++) {
			const shape = this.orientations[o];

			if (shape.length === 0) return this;

			const rows = shape.length;
			const cols = shape[0].length;

			// Find top boundary (first row with non-zero)
			let top = 0;
			while (top < rows && shape[top].every((val) => val === 0)) {
				top++;
			}
			if (top === rows) return []; // All zeros

			// Find bottom boundary (last row with non-zero)
			let bottom = rows - 1;
			while (bottom >= 0 && shape[bottom].every((val) => val === 0)) {
				bottom--;
			}

			// Find left boundary (first column with non-zero)
			let left = 0;
			while (left < cols) {
				let hasNonZero = false;
				for (let i = top; i <= bottom; i++) {
					if (shape[i][left] !== 0) {
						hasNonZero = true;
						break;
					}
				}
				if (hasNonZero) break;
				left++;
			}

			// Find right boundary (last column with non-zero)
			let right = cols - 1;
			while (right >= 0) {
				let hasNonZero = false;
				for (let i = top; i <= bottom; i++) {
					if (shape[i][right] !== 0) {
						hasNonZero = true;
						break;
					}
				}
				if (hasNonZero) break;
				right--;
			}

			// Slice the grid to get the cropped array
			const cropped = [];
			for (let i = top; i <= bottom; i++) {
				cropped.push(shape[i].slice(left, right + 1));
			}

			this.orientations[o] = cropped;
		}

		return this;
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
