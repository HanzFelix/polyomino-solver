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
	let pieceRotations = generateRotations(pieces[combination[comboIndex] - 1].shape);
	let minPieceDim = Math.min(pieceRotations[0].length, pieceRotations[0][0].length);
	for (let row = 0; row <= board.length - minPieceDim; row++) {
		for (let col = 0; col <= board[0].length - minPieceDim; col++) {
			for (const rotated of pieceRotations) {
				if (piecePlaced(board, rotated, row, col)) {
					// proceed to next piece if successfully placed
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

function piecePlaced(board, piece, row, col) {
	if (board.length - piece.length - row < 0 || board[0].length - piece[0].length - col < 0)
		return false;

	let placeable = true;
	let i_r, j_r;
	looprow: for (let i = 0; i < piece.length; i++) {
		for (let j = 0; j < piece[0].length; j++) {
			//??
			if (piece[i][j] && board[row + i][col + j]) {
				placeable = false;
				i_r = i;
				j_r = j - 1;
				break looprow;
			}

			if (piece[i][j]) {
				board[row + i][col + j] = piece[i][j];
			}
		}
	}

	if (placeable) return true;

	// undo placement so far,
	for (let i = i_r; i >= 0; i--) {
		for (let j = j_r; j >= 0; j--) {
			if (piece[i][j] == board[row + i][col + j]) {
				board[row + i][col + j] = 0;
			}
		}
		j_r = piece[0].length - 1;
	}

	return false;
}
