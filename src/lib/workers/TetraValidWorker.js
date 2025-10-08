onmessage = (event) => {
	const { tetraBag, tetraBoard, combination } = event.data;
	validateCombination(tetraBag, tetraBoard, combination);
};

function validateCombination(tetraBag, tetraBoard, combination) {
	if (solveBoard(tetraBag, tetraBoard, combination, 0)) {
		postMessage({ state: 'found', result: tetraBoard });
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
	let pieceRotations = pieces[combination[comboIndex] - 1].orientations;
	let minPieceDim = Math.min(pieceRotations[0].length, pieceRotations[0][0].length);
	for (let row = 0; row <= board.length - minPieceDim; row++) {
		for (let col = 0; col <= board[0].length - minPieceDim; col++) {
			for (const rotated of pieceRotations) {
				if (piecePlaced(board, rotated, row, col, (comboIndex % 14) + 1)) {
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

function removePiece(board, piece, row, col) {
	for (let i = 0; i < piece.length; i++) {
		for (let j = 0; j < piece[0].length; j++) {
			if (piece[i][j]) {
				board[row + i][col + j] = 0;
			}
		}
	}
}

function piecePlaced(board, piece, row, col, pieceIndex) {
	// TODO: eliminate redundant dimension check
	if (board.length - piece.length - row < 0 || board[0].length - piece[0].length - col < 0)
		return false;

	let placeable = true;
	let i_r, j_r;
	looprow: for (let i = 0; i < piece.length; i++) {
		for (let j = 0; j < piece[0].length; j++) {
			// conflicting cell placement?
			if (piece[i][j] && board[row + i][col + j]) {
				placeable = false;
				i_r = i;
				j_r = j - 1;
				break looprow;
			}

			if (piece[i][j]) {
				board[row + i][col + j] = pieceIndex;
			}
		}
	}

	// placement successful?
	if (placeable) return true;

	// undo placement so far,
	for (let i = i_r; i >= 0; i--) {
		for (let j = j_r; j >= 0; j--) {
			if (piece[i][j] && board[row + i][col + j]) {
				board[row + i][col + j] = 0;
			}
		}
		j_r = piece[0].length - 1;
	}

	return false;
}
