<script>
	import TetraBoard from '$lib/TetraBoard.svelte';
	import { Board } from '$lib/board.svelte';
	import TetraPieceList from '$lib/TetraPieceList.svelte';
	import { uid as pieceid, Piece } from '$lib/piece.svelte.js';
	import { pieces, board, resetPieceQuantities } from '$lib/problem.svelte.js';
	import { solve, getSolverStatus, solver } from '$lib/solver.svelte.js';

	// board stuff
	let hasBlocked = $derived(board.blocked_cells.includes(true));
	let pieceweights = $derived(
		pieces.reduce((sum, piece) => sum + piece.quantity * piece.weight, 0)
	);

	let in_rows = $state(board.rows);
	let in_cols = $state(board.cols);

	$effect(() => {
		board.updateBoardSize(in_rows, in_cols);
	});

	let addPieceWindow = $state();
	let newPiece = new Board(6, 6);

	function convertToPieceShape() {
		let grid = newPiece.boardifyBlocked(pieceid).board;
		if (grid.length === 0) return [];

		const rows = grid.length;
		const cols = grid[0].length;

		// Find top boundary (first row with non-zero)
		let top = 0;
		while (top < rows && grid[top].every((val) => val === 0)) {
			top++;
		}
		if (top === rows) return []; // All zeros

		// Find bottom boundary (last row with non-zero)
		let bottom = rows - 1;
		while (bottom >= 0 && grid[bottom].every((val) => val === 0)) {
			bottom--;
		}

		// Find left boundary (first column with non-zero)
		let left = 0;
		while (left < cols) {
			let hasNonZero = false;
			for (let i = top; i <= bottom; i++) {
				if (grid[i][left] !== 0) {
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
				if (grid[i][right] !== 0) {
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
			cropped.push(grid[i].slice(left, right + 1));
		}

		//return cropped;
		console.log(cropped);
		pieces.push(new Piece(cropped));
	}
</script>

<div class="md:basis-4/12 flex flex-col justify-between bg-tbrown-300 rounded-xl">
	<div class="flex gap-6 flex-col p-4 md:pr-2 bg-tbrown-300 rounded-t-lg md:overflow-y-auto">
		<!-- Title -->
		<header class="flex justify-between">
			<h1 class="text-xl font-bold">Polyomino Solver</h1>
			<a
				aria-label="github"
				href="https://github.com/HanzFelix/polyomino-solver"
				class="fill-tbrown-900 transition-colors hover:fill-tbrown-50"
			>
				<svg
					height="24"
					aria-hidden="true"
					viewBox="0 0 16 16"
					version="1.1"
					width="24"
					data-view-component="true"
					class="octicon octicon-mark-github"
				>
					<path
						d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
					></path>
				</svg>
			</a>
		</header>
		<!-- Board size -->
		<section>
			<div class="flex justify-between mb-2 items-end flex-wrap">
				<h2 class="text-xl">Board size</h2>
			</div>
			<div class="flex gap-4">
				<div class="basis-full flex">
					<label
						for="boardx"
						class="py-1 px-2 font-black text-tbrown-50 bg-tbrown-500 rounded-l-md"
					>
						X
					</label>
					<input
						onchange={(e) => {
							let c = e.target.value;
							c = c < 4 ? 4 : c;
							in_cols = c > 12 ? 12 : c;
						}}
						type="number"
						name="boardx"
						class="basis-full px-2 bg-tbrown-50 rounded-r-md"
						size="1"
						min="4"
						max="12"
						placeholder="4-12"
						bind:value={in_cols}
					/>
				</div>
				<div class="basis-full flex">
					<label
						for="boardy"
						class="py-1 px-2 font-black text-tbrown-50 bg-tbrown-500 rounded-l-md"
					>
						Y
					</label>
					<input
						type="number"
						name="boardy"
						class="px-2 basis-full bg-tbrown-50 rounded-r-md"
						size="1"
						min="4"
						max="12"
						placeholder="4-12"
						bind:value={in_rows}
						onchange={(e) => {
							let r = e.target.value;
							r = r < 4 ? 4 : r;
							in_rows = r > 12 ? 12 : r;
						}}
					/>
				</div>
			</div>
		</section>
		<!-- Board shape -->
		<section>
			<div class="flex justify-between mb-2">
				<h2 class="text-xl">Board shape</h2>
				<button
					onclick={() => board.clearBlocked()}
					class="p-1 rounded-md text-tbrown-50 {hasBlocked
						? 'bg-tcyan-900'
						: 'bg-tbrown-500'} material-symbols-rounded transition-colors"
				>
					remove_selection
				</button>
			</div>
			<div class="flex">
				<label
					for="boardx"
					class="py-2 px-2 text-tbrown-50 bg-tbrown-500 material-symbols-rounded rounded-l-md"
				>
					info
				</label>
				<p class="basis-full px-2">Optional: Select cells in the board to block</p>
			</div>
		</section>
		<!-- Piece list -->
		<section>
			<div class="flex justify-between mb-2">
				<h2 class="text-xl">Pieces</h2>
				<div class="flex gap-1">
					<button
						class="p-1 rounded-md text-tbrown-50 bg-tcyan-900 material-symbols-rounded"
						onclick={() => {
							newPiece.updateBoardSize(6, 6);
							addPieceWindow.showModal();
						}}>add</button
					>
					<button
						class="p-1 rounded-md text-tbrown-50 {pieceweights > 0
							? 'bg-tcyan-900'
							: 'bg-tbrown-500'} transition-colors material-symbols-rounded"
						onclick={() => {
							resetPieceQuantities();
						}}
					>
						variable_remove
					</button>
				</div>
			</div>
			<TetraPieceList {pieces} />
		</section>
	</div>
	<!-- Problem info & worker controls -->
	<div class="flex bg-tbrown-500 rounded-b-lg text-tbrown-50">
		<p class="py-2 px-4 transition-colors basis-full">
			{getSolverStatus()
				? 'Required: ' + pieceweights + '/' + board.free_space
				: 'Pending: ' + solver.pending_validation}
		</p>
		<button
			onclick={solve}
			class="{getSolverStatus() ? 'bg-tcyan-900' : 'bg-red-800'} {board.free_space <= pieceweights
				? ''
				: 'bg-transparent'} font-black py-2 px-4 basis-36 text-left rounded-br-lg"
		>
			{getSolverStatus() ? 'START' : 'ABORT'}
		</button>
	</div>
</div>

<dialog
	bind:this={addPieceWindow}
	class="rounded-lg backdrop:backdrop-brightness-50 m-auto bg-tbrown-500 w-full max-w-lg overflow-y-auto"
>
	<div class="flex justify-between px-8 items-center">
		<h2 class="text-xl">Add Piece</h2>
		<button
			class="material-symbols-rounded font-black text-tbrown-50 bg-red-800 px-6 py-2"
			onclick={() => {
				addPieceWindow.close();
			}}>close</button
		>
	</div>
	<div class="rounded-lg">
		<TetraBoard bind:board={newPiece.blocked_cells} rows={newPiece.rows} cols={newPiece.cols} />
	</div>
	<div class="flex justify-end px-8 items-center">
		<button
			class="material-symbols-rounded font-black text-tbrown-50 bg-tcyan-900 px-6 py-2 items-center"
			onclick={() => {
				convertToPieceShape();
				addPieceWindow.close();
			}}>check</button
		>
	</div>
</dialog>
