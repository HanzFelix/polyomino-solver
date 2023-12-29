onmessage = (event) => {
	const { tetraBag, tetraBoard, combination } = event.data;
	validateCombination(tetraBag, tetraBoard, combination);
};

function validateCombination(tetraBag, tetraBoard, combination) {
	if (solveBoard(tetraBag, tetraBoard.board, combination, 0)) {
		postMessage({ state: 'found', result: tetraBoard.board });
	} else {
		postMessage({ state: 'done', result: [] });
	}
}

function solveBoard(pieces, board, combination, comboIndex) {
	// successfully placed all pieces
	if (comboIndex >= combination.length) {
		return true;
	}
	// iterate thru rotations
	for (const rotated of generateRotations(pieces[combination[comboIndex] - 1].shape)) {
		for (let row = 0; row <= board.length - rotated.length; row++) {
			for (let col = 0; col <= board[0].length - rotated[0].length; col++) {
				if (canPlacePiece(board, rotated, row, col)) {
					// placing...
					placePiece(board, rotated, row, col);

					// proceed to next piece
					if (solveBoard(pieces, board, combination, comboIndex + 1)) return true;

					// removing... current placement is bad for next pieces
					removePiece(board, rotated, row, col);
				}
			}
		}
	}

	return false;
}

function generateRotations(piece) {
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

function canPlacePiece(board, piece, row, col) {
	for (let i = 0; i < piece.length; i++) {
		for (let j = 0; j < piece[0].length; j++) {
			if (piece[i][j] && board[row + i][col + j]) {
				return false;
			}
		}
	}

	return true;
}

function placePiece(board, piece, row, col) {
	for (let i = 0; i < piece.length; i++) {
		for (let j = 0; j < piece[0].length; j++) {
			if (piece[i][j]) {
				board[row + i][col + j] = piece[i][j];
			}
		}
	}
}

function removePiece(board, piece, row, col) {
	for (let i = 0; i < piece.length; i++) {
		for (let j = 0; j < piece[0].length; j++) {
			if (piece[i][j]) {
				board[row + i][col + j] = 0;
			}
		}
	}
}

function printBoard(board) {
	for (const row of board) {
		console.log(row.map((val) => (val ? val : '-')).join(' '));
	}
	console.log();
}
