export class Board {
	rows = $state();
	cols = $state();
	blocked_cells = $state([]);
	blocked_count = $derived(this.blocked_cells.reduce((sum, cell) => sum + cell, 0));
	free_space = $derived(this.rows * this.cols - this.blocked_count);

	constructor(rows = 4, cols = 4) {
		this.updateBoardSize(rows, cols);
	}

	// board translations stuff
	boardifyBlocked(cell_value = 'X') {
		let r = this.rows;
		let c = this.cols;
		const board = Array.from({ length: r }, () => Array(c).fill(0));
		let free_space = r * c; // remove if not needed

		for (let index = 0; index < this.blocked_cells.length; index++) {
			if (this.blocked_cells[index]) {
				let i, j;
				if (c < r) {
					i = Math.floor(index / r);
					j = index % r;
					board[j][i] = cell_value;
				} else {
					i = Math.floor(index / c);
					j = index % c;
					board[i][j] = cell_value;
				}
				free_space--;
			}
		}

		return { board: board, free_space: free_space };
	}

	updateBoardSize(rows, cols) {
		let r = Number(rows);
		let c = Number(cols);
		this.rows = r;
		this.cols = c;
		this.blocked_cells = new Array(r * c).fill(false);
	}

	clearBlocked() {
		this.blocked_cells = this.blocked_cells.fill(false);
	}
}
