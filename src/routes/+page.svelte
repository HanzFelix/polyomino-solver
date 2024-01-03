<script>
	import TetraPieceList from '$lib/TetraPieceList.svelte';
	import comboWorkerUrl from '$lib/workers/TetraComboWorker?url';
	import validWorkerUrl from '$lib/workers/TetraValidWorker?url';
	import TetraSolutionList from '$lib/TetraSolutionList.svelte';
	import TetraBoard from '$lib/TetraBoard.svelte';
	import { tetracolors } from '$lib/stores/TetraColors.js';
	import { tetrapieces } from '$lib/stores/TetraPieces.js';
	import { onMount, tick } from 'svelte';

	tetracolors.init([
		'#CC993C',
		'#47C1A2',
		'#BD4F5A',
		'#217958',
		'#4D78A9',
		'#CE7647',
		'#664A74',
		'#65A156',
		'#BF7A7E'
	]);

	tetrapieces.init([
		[
			[1, 1],
			[1, 1]
		],
		[[2, 2, 2, 2]],
		[
			[3, 3, 0],
			[0, 3, 3]
		],
		[
			[0, 4, 4],
			[4, 4, 0]
		],
		[
			[5, 0, 0],
			[5, 5, 5]
		],
		[
			[0, 0, 6],
			[6, 6, 6]
		],
		[
			[0, 7, 0],
			[7, 7, 7]
		],
		[
			[0, 8, 0],
			[8, 8, 8],
			[0, 8, 0]
		],
		[[9]]
	]);

	// board stuff
	let rows = 4,
		cols = 4,
		in_rows = 4,
		in_cols = 4;

	let blockedCells = [];

	$: isCurrentDims = rows == in_rows && cols == in_cols;
	$: hasBlocked = blockedCells.includes(true);

	function updateBoardSize() {
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
	let readyCombos = [];
	let validCombos = [];
	let pendingValidation = 0;
	$: workersDone = pendingValidation == 0;
	function findSolutions() {
		if (workersDone) {
			readyCombos = [];
			validCombos = [];
			finalBoard = boardifyBlocked();
			pendingValidation = 1;
			comboWorker.postMessage({
				pieces: $tetrapieces,
				maxWeight: finalBoard.free_space
			});
		} else {
			comboWorker.terminate();
			validWorker.terminate();
			pendingValidation = 0;
		}
	}

	let comboWorker, validWorker;

	onMount(() => {
		updateBoardSize();
		comboWorker = new Worker(comboWorkerUrl);
		comboWorker.onmessage = (event) => {
			const { state, combo } = event.data;
			if (state == 'found') {
				readyCombos = [...readyCombos, combo];
				pendingValidation++;
				validWorker.postMessage({
					tetraBag: $tetrapieces,
					tetraBoard: finalBoard,
					combination: readyCombos.shift()
				});
			} else {
				pendingValidation--;
			}
		};
		comboWorker.onmessageerror = (event) => {
			console.error(`Error receiving message from comboWorker: ${event}`);
		};

		validWorker = new Worker(validWorkerUrl);
		validWorker.onmessage = (event) => {
			const { state, result } = event.data;
			if (state == 'found') {
				validCombos = [...validCombos, result];
			}
			pendingValidation--;
		};
		validWorker.onmessageerror = (event) => {
			console.error(`Error receiving message from validWorker: ${event}`);
		};
	});
	function tempAdd() {
		validCombos = [
			...validCombos,
			[
				['X', 4, 4, 'X'],
				[4, 4, 1, 1],
				[3, 3, 1, 1],
				['X', 3, 3, 'X']
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
					<div
						id="color-apply"
						class="text-tbrown-50 {isCurrentDims
							? 'bg-tbrown-500'
							: 'bg-tcyan-900'} px-2 relative rounded-md flex overflow-hidden transition-colors"
					>
						<div id="size-apply" class="{isCurrentDims ? 'w-0' : ''} truncate py-1">
							<button on:click={updateBoardSize}>Update&nbsp;</button>
						</div>
						<span class="font-bold py-1">&check;</span>
					</div>
				</div>
				<div class="flex gap-4">
					<div class="basis-full flex rounded-md overflow-hidden">
						<label for="boardx" class="py-1 px-2 font-black text-tbrown-50 bg-tbrown-500">
							X
						</label>
						<input
							type="number"
							name="boardx"
							class="basis-full px-2 bg-tbrown-50"
							size="1"
							min="4"
							max="12"
							placeholder="4-12"
							bind:value={in_cols}
						/>
					</div>
					<div class="basis-full flex rounded-md overflow-hidden">
						<label for="boardy" class="py-1 px-2 font-black text-tbrown-50 bg-tbrown-500">
							Y
						</label>
						<input
							type="number"
							name="boardy"
							class="px-2 basis-full bg-tbrown-50"
							size="1"
							min="4"
							max="12"
							placeholder="4-12"
							bind:value={in_rows}
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
					<p class="basis-full px-2">Select cells in the board to block</p>
				</div>
			</section>
			<section>
				<div class="flex justify-between mb-2">
					<h2 class="text-xl">Pieces</h2>
					<button class="px-2 py-1 rounded-md text-tbrown-50 bg-tcyan-900" on:click={tempAdd}>
						Add +
					</button>
				</div>
				<TetraPieceList pieces={$tetrapieces} />
			</section>
		</div>
		<div class="flex rounded-b-md">
			<p class="bg-tbrown-500 py-2 px-4 text-tbrown-50 basis-full">
				{workersDone ? 'Ready' : 'Pending: ' + pendingValidation}
			</p>
			<button
				on:click={findSolutions}
				class="{workersDone
					? 'bg-tcyan-900'
					: 'bg-red-900'}  font-black py-2 px-4 basis-36 text-left text-tbrown-50"
			>
				{workersDone ? 'START' : 'ABORT'}
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
				<h1 id="count-el" class="text-5xl font-bold">{validCombos.length}</h1>
			</div>
			<TetraSolutionList bind:solutions={validCombos} />
		</div>
	</div>
</div>
