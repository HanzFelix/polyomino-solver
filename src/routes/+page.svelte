<script>
	import TetraPieceList from '$lib/TetraPieceList.svelte';
	import comboWorkerUrl from '$lib/workers/TetraComboWorker?url';
	import validWorkerUrl from '$lib/workers/TetraValidWorker?url';
	import TetraSolutionList from '$lib/TetraSolutionList.svelte';
	import TetraBoard from '$lib/TetraBoard.svelte';
	import { tetracolors } from '$lib/stores/TetraColors.js';
	import { tetrapieces, pieceweights } from '$lib/stores/TetraPieces.js';
	import { onMount } from 'svelte';

	tetracolors.init([
		'#8862B2',
		'#538076',
		'#67BF6A',
		'#726938',
		'#CE7647',
		'#194166',
		'#437921',
		'#BD2F3E',
		'#CC993C',
		'#663280',
		'#47C1A2',
		'#59372F',
		'#5B8EC7',
		'#C46965'
	]);

	tetrapieces.init([
		[
			[0, 1, 0],
			[1, 1, 1],
			[0, 1, 0]
		],
		[
			[2, 2, 0],
			[0, 2, 0],
			[0, 2, 2]
		],
		[
			[0, 3, 0],
			[0, 3, 0],
			[3, 3, 3]
		],
		[
			[4, 0, 4],
			[4, 4, 4]
		],
		[
			[5, 0],
			[5, 0],
			[5, 5]
		],
		[
			[0, 6],
			[0, 6],
			[6, 6]
		],
		[
			[0, 7, 7],
			[7, 7, 0]
		],
		[
			[8, 8, 0],
			[0, 8, 8]
		],
		[
			[9, 9],
			[9, 9]
		],
		[
			[0, 10, 0],
			[10, 10, 10]
		],
		[[11], [11], [11], [11]],
		[
			[12, 12],
			[12, 0]
		],
		[[13, 13]],
		[[14]]
	]);

	// board stuff
	let rows = 4,
		cols = 4,
		in_rows = 4,
		in_cols = 4;

	let blockedCells = [];

	//$: isCurrentDims = rows == in_rows && cols == in_cols;
	$: hasBlocked = blockedCells.includes(true);

	function updateBoardSize() {
		in_rows = in_rows < 4 ? 4 : in_rows;
		in_cols = in_cols < 4 ? 4 : in_cols;
		in_rows = in_rows > 12 ? 12 : in_rows;
		in_cols = in_cols > 12 ? 12 : in_cols;

		rows = in_rows;
		cols = in_cols;
		blockedCells = new Array(rows * cols).fill(false);
	}

	function clearBlocked() {
		blockedCells = blockedCells.fill(false);
	}

	// board translations stuff
	// would prefer the [{x: 0, y:0}] way instead of blockedCells.length
	function boardifyBlocked() {
		const board = Array.from({ length: rows }, () => Array(cols).fill(0));
		let free_space = rows * cols;

		for (let index = 0; index < blockedCells.length; index++) {
			if (blockedCells[index]) {
				let i, j;
				if (cols < rows) {
					i = Math.floor(index / rows);
					j = index % rows;
					board[j][i] = 'X';
				} else {
					i = Math.floor(index / cols);
					j = index % cols;
					board[i][j] = 'X';
				}
				free_space--;
			}
		}

		return { board: board, free_space: free_space };
	}

	// worker stuff
	let finalBoard;
	let hypotheticalCombos = 0;
	let validCombos = [];
	let pendingValidation = 0;
	$: workersDone = pendingValidation == 0;
	function findSolutions() {
		if (workersDone && rows * cols <= $pieceweights) {
			hypotheticalCombos = 0;
			validCombos = [];
			finalBoard = boardifyBlocked();
			pendingValidation = 1;
			comboWorker.postMessage({
				pieces: $tetrapieces,
				maxWeight: finalBoard.free_space
			});
		} else {
			// need a better "pause/stop" implementation
			/*
			comboWorker.terminate();
			validWorker.terminate();
			pendingValidation = 0;
			*/
		}
	}

	let comboWorker, validWorker;
	function loadWorkers() {
		if (!comboWorker) {
			comboWorker = new Worker(comboWorkerUrl);
			comboWorker.onmessage = (event) => {
				const { state, combo } = event.data;
				if (state == 'found') {
					hypotheticalCombos++;
					pendingValidation++;
					validWorker.postMessage({
						tetraBag: $tetrapieces,
						tetraBoard: finalBoard,
						combination: combo
					});
				} else {
					pendingValidation--;
				}
			};
		}

		if (!validWorker) {
			validWorker = new Worker(validWorkerUrl);
			validWorker.onmessage = (event) => {
				const { state, result } = event.data;
				if (state == 'found') {
					validCombos = [...validCombos, result];
				}
				pendingValidation--;
			};
		}
	}

	onMount(() => {
		updateBoardSize();
		loadWorkers();
		tempAdd();
	});
	function tempAdd() {
		validCombos = [
			...validCombos,
			[
				[12, 12, 1, 5, 5, 14],
				[12, 1, 1, 1, 5, 6],
				[6, 6, 1, 14, 5, 6],
				[6, 6, 5, 7, 6, 6],
				[6, 6, 5, 7, 7, 13],
				[6, 6, 5, 5, 7, 13]
			],
			[
				[12, 12, 1, 5, 5, 14, 11],
				[12, 1, 1, 1, 5, 6, 11],
				[6, 6, 1, 14, 5, 6, 11],
				[6, 6, 5, 7, 6, 6, 11],
				[6, 6, 5, 7, 7, 9, 9],
				[6, 6, 5, 5, 7, 9, 9],
				[14, 13, 13, 11, 11, 11, 11]
			]
		];
	}
</script>

<svelte:head>
	<title>Tetra Solver</title>
	<meta name="description" content="Tetra Solver" />
</svelte:head>
<div
	class="container mx-auto flex flex-col md:max-h-screen md:flex-row gap-4 py-8 px-4 md:px-0 h-full"
>
	<div class="md:basis-4/12 flex flex-col justify-between bg-tbrown-300 rounded-xl overflow-hidden">
		<div class="flex gap-6 flex-col p-4 bg-tbrown-300 rounded-t-md md:overflow-y-auto">
			<section>
				<div class="flex justify-between mb-2 items-end flex-wrap">
					<h2 class="text-xl">Board size</h2>
					<!--div
						class="text-tbrown-50 {isCurrentDims
							? 'bg-tbrown-500'
							: 'bg-tcyan-900'} px-2 relative rounded-md flex overflow-hidden transition-colors"
					>
						<div class="{isCurrentDims ? 'w-0' : ''} truncate py-1">
							<button on:click={updateBoardSize}>Update&nbsp;</button>
						</div>
						<span class="font-bold py-1">&check;</span>
					</div-->
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
							type="number"
							name="boardx"
							class="basis-full px-2 bg-tbrown-50 rounded-r-md"
							size="1"
							min="4"
							max="12"
							placeholder="4-12"
							bind:value={in_cols}
							on:focusout={updateBoardSize}
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
							on:focusout={updateBoardSize}
						/>
					</div>
				</div>
			</section>
			<section>
				<div class="flex justify-between mb-2">
					<h2 class="text-xl">Board shape</h2>
					<button
						on:click={clearBlocked}
						class="p-1 rounded-md text-tbrown-50 {hasBlocked
							? 'bg-tcyan-900'
							: 'bg-tbrown-500'} material-symbols-rounded transition-colors"
					>
						remove_selection
					</button>
				</div>
				<div class="flex overflow-hidden">
					<label
						for="boardx"
						class="py-2 px-2 text-tbrown-50 bg-tbrown-500 material-symbols-rounded rounded-l-md"
					>
						info
					</label>
					<p class="basis-full px-2">Optional: Select cells in the board to block</p>
				</div>
			</section>
			<section>
				<div class="flex justify-between mb-2">
					<h2 class="text-xl">Pieces</h2>
					<!--button
						class="px-2 py-1 rounded-md text-tbrown-50 bg-tcyan-900 opacity-20"
						on:click={tempAdd}
					>
						Add +
					</button-->
				</div>
				<TetraPieceList pieces={$tetrapieces} />
			</section>
		</div>
		<div class="flex rounded-b-md">
			<p class="bg-tbrown-500 py-2 px-4 text-tbrown-50 basis-full">
				{workersDone
					? 'Need: ' + $pieceweights + '/' + rows * cols
					: 'Pending: ' + pendingValidation}
			</p>
			<button
				on:click={findSolutions}
				class="{workersDone && rows * cols <= $pieceweights
					? 'bg-tcyan-900'
					: 'bg-tbrown-500'}  font-black py-2 px-4 basis-36 text-left text-tbrown-50"
			>
				{workersDone ? 'START' : 'PROCESSING'}
			</button>
		</div>
	</div>
	<div class="bg-tbrown-300 md:basis-8/12 rounded-xl flex flex-col-reverse md:flex-row">
		<div class="md:self-center p-4 w-full">
			<TetraBoard {rows} {cols} bind:board={blockedCells} />
		</div>
		<div class="lg:basis-1/4 md:basis-1/3 flex flex-col min-w-48">
			<div class="flex justify-between items-end gap-2 p-4 md:pl-2">
				<h1 class="font-semibold w-min">Solution{validCombos.length == 1 ? '' : 's'} Found:</h1>
				<h1 class="text-5xl font-bold cursor-pointer">{validCombos.length}</h1>
			</div>
			<TetraSolutionList bind:solutions={validCombos} />
		</div>
	</div>
</div>
