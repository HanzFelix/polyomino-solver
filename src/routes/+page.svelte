<script>
	import TetraPieceList from '$lib/TetraPieceList.svelte';
	import comboWorkerUrl from '$lib/workers/TetraComboWorker?url';
	import ValidWorkerUrl from '$lib/workers/TetraValidWorker?url';
	import timerWorkerUrl from '$lib/workers/TimerWorker?url';
	import TetraSolutionList from '$lib/TetraSolutionList.svelte';
	import TetraBoard from '$lib/TetraBoard.svelte';
	import { tetracolors } from '$lib/stores/TetraColors.js';
	import { createTetraPieceStore } from '$lib/stores/TetraPieces.js';
	import { createTetraSolutionStore } from '$lib/stores/TetraSolutions.js';
	import { onMount, tick } from 'svelte';

	tetracolors.init({
		1: '#CC993C',
		2: '#47C1A2',
		3: '#BD4F5A',
		4: '#217958',
		5: '#4D78A9',
		6: '#CE7647',
		7: '#664A74',
		8: '#65A156',
		9: '#BF7A7E'
	});

	const pieces = createTetraPieceStore([
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

	const solutions = createTetraSolutionStore([]);

	// board stuff
	let rows = 4;
	let cols = 4;
	let in_rows = 4;
	let in_cols = 4;
	function updateBoardSize() {
		rows = in_rows;
		cols = in_cols;
	}
	let blockedCells = [];
	$: if (blockedCells.length != rows * cols) {
		blockedCells = new Array(rows * cols).fill(false);
	}
	$: isCurrentDims = rows == in_rows && cols == in_cols;
	$: hasBlocked = blockedCells.includes(true);

	function clearBlocked() {
		blockedCells = blockedCells.fill(false);
	}

	//pieces stuff, move to comboworker? with param $pieces
	function tallyPieceWeights() {
		const weights = [];
		for (let i = 0; i < $pieces.length; i++) {
			for (let j = 0; j < $pieces[i].quantity; j++) {
				weights.push({ id: $pieces[i].id, weight: $pieces[i].weight });
			}
		}
		return weights;
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
	function findSolutions() {
		readyCombos = [];
		solutions.reset();
		finalBoard = boardifyBlocked();
		comboWorker.postMessage({
			pieceWeights: tallyPieceWeights(),
			maxWeight: finalBoard.free_space
		});
		//timerWorker.postMessage(3000);
	}

	function terminateWorkers() {
		comboWorker.terminate();
		validWorker.terminate();
		timerWorker.terminate();
		workerStatus = 'Terminated';
	}

	function updateQueue() {
		if (readyCombos.length > 0 && busyValidationWorkers < maxValidationWorkers) {
			validWorker.postMessage({
				tetraBag: $pieces,
				tetraBoard: finalBoard,
				combination: readyCombos.shift()
			});
			busyValidationWorkers++;
		}
		// TODO: update to stop only when comboworker and validworker is done
		if (readyCombos.length == 0 && busyValidationWorkers == 0) {
			timerWorker.terminate();
			workerStatus = 'Finished calculating';
		}
	}

	let comboWorker, validWorker, timerWorker;
	const maxValidationWorkers = 4;
	let busyValidationWorkers = 0;
	let readyCombos = [];
	let workerStatus = 'Ready';

	onMount(() => {
		comboWorker = new Worker(comboWorkerUrl);
		comboWorker.onmessage = (event) => {
			const { state, combo } = event.data;
			if (state == 'found') {
				readyCombos.push(combo);
			} else {
				console.log(state);
			}
			updateQueue();
			tick();
		};

		validWorker = new Worker(ValidWorkerUrl);
		validWorker.onmessage = (event) => {
			const { state, result } = event.data;
			if (state == 'found') {
				solutions.add(result);
				//printBoard(result);
				//console.log("===========");
			}
			busyValidationWorkers--;
			updateQueue();
			tick();
		};

		timerWorker = new Worker(timerWorkerUrl);
		timerWorker.onmessage = (event) => {
			console.log(
				'ready: ' +
					readyCombos.length +
					', working: ' +
					busyValidationWorkers +
					', found: ' +
					$solutions.length
			);
		};
	});
	function tempAdd() {
		solutions.add([
			['X', 4, 4, 'X'],
			[4, 4, 1, 1],
			[3, 3, 1, 1],
			['X', 3, 3, 'X']
		]);
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
							<button on:click={updateBoardSize}>Apply changes&nbsp;</button>
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
				<div class="flex rounded-md overflow-hidden">
					<label
						for="boardx"
						class="py-1 px-2 text-tbrown-50 bg-tbrown-500 material-symbols-rounded"
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
				<TetraPieceList pieces={$pieces} />
			</section>
		</div>
		<div class="flex rounded-b-md overflow-hidden">
			<p class="bg-tbrown-500 py-2 px-4 text-tbrown-50 basis-full">{workerStatus}</p>
			<button
				on:click={findSolutions}
				class="bg-tcyan-900 font-black py-2 px-4 basis-36 text-left text-tbrown-50"
			>
				START
			</button>
		</div>
	</div>
	<div class="bg-tbrown-300 md:basis-8/12 rounded-xl flex flex-col-reverse md:flex-row">
		<div class="md:self-center p-4 w-full">
			<TetraBoard {rows} {cols} bind:board={blockedCells} />
		</div>
		<div class="lg:basis-1/4 md:basis-1/3 flex flex-col min-w-48">
			<div class="flex justify-between items-end gap-2 p-4 md:pl-2">
				<h1 class="font-semibold">Solution{$solutions.length == 1 ? '' : 's'} Found:</h1>
				<h1 id="count-el" class="text-5xl font-bold">{$solutions.length}</h1>
			</div>
			<TetraSolutionList solutions={$solutions} />
		</div>
	</div>
</div>
