<script>
	import TetraPieceList from '$lib/TetraPieceList.svelte';
	import comboWorkerUrl from '$lib/workers/TetraComboWorker?url';
	import validWorkerUrl from '$lib/workers/TetraValidWorker?url';
	import TetraSolutionList from '$lib/TetraSolutionList.svelte';
	import TetraBoard from '$lib/TetraBoard.svelte';
	import { tetracolors } from '$lib/stores/TetraColors.js';
	import { tetrapieces, pieceweights } from '$lib/stores/TetraPieces.js';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

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
		'#5B8EC7',
		'#59372F',
		'#47C1A2',
		'#D499AE'
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
	let blockedCount = 0;

	$: hasBlocked = blockedCells.includes(true);

	function updateBoardSize() {
		in_rows = in_rows < 4 ? 4 : in_rows;
		in_cols = in_cols < 4 ? 4 : in_cols;
		in_rows = in_rows > 12 ? 12 : in_rows;
		in_cols = in_cols > 12 ? 12 : in_cols;

		rows = in_rows;
		cols = in_cols;
		blockedCells = new Array(rows * cols).fill(false);
		blockedCount = 0;
	}

	function clearBlocked() {
		blockedCells = blockedCells.fill(false);
		blockedCount = 0;
	}

	// board translations stuff
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
	let showFinishNotif = false;
	$: workersDone = pendingValidation == 0;
	$: freeSpace = rows * cols - blockedCount;
	function findSolutions() {
		if (workersDone && freeSpace <= $pieceweights) {
			loadWorkers();
			hypotheticalCombos = 0;
			validCombos = [];
			finalBoard = boardifyBlocked();
			pendingValidation = 1;
			comboWorker.postMessage({
				pieces: $tetrapieces,
				maxWeight: finalBoard.free_space
			});
		} else if (!workersDone) {
			stopWorkers();
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
					if (!pendingValidation) {
						showFinishNotif = true;
						stopWorkers();
					}
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
				if (!pendingValidation) {
					showFinishNotif = true;
					stopWorkers();
				}
			};
		}
	}

	function stopWorkers() {
		comboWorker.terminate();
		validWorker.terminate();

		comboWorker = undefined;
		validWorker = undefined;

		hypotheticalCombos = 0;
		pendingValidation = 0;
	}

	onMount(() => {
		updateBoardSize();
	});
</script>

<svelte:head>
	<title>Polyomino Solver</title>
	<meta name="description" content="Tetra Solver" />
</svelte:head>
<div class="container mx-auto flex flex-col md:flex-row gap-4 py-8 px-4 md:px-0 h-full">
	<div class="md:basis-4/12 flex flex-col justify-between bg-tbrown-300 rounded-xl">
		<div class="flex gap-6 flex-col p-4 md:pr-2 bg-tbrown-300 rounded-t-lg md:overflow-y-auto">
			<!-- Title -->
			<header class="flex justify-between">
				<h1 class="text-xl font-bold">Polyomino Solver</h1>
				<a
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
			<!-- Board shape -->
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
					<button
						class="p-1 rounded-md text-tbrown-50 bg-tcyan-900 material-symbols-rounded"
						on:click={() => {
							tetrapieces.resetQuantity();
						}}
					>
						variable_remove
					</button>
				</div>
				<TetraPieceList pieces={$tetrapieces} />
			</section>
		</div>
		<!-- Problem info & worker controls -->
		<div class="flex bg-tbrown-500 rounded-b-lg text-tbrown-50">
			<p class="py-2 px-4 transition-colors basis-full">
				{workersDone
					? 'Required: ' + $pieceweights + '/' + freeSpace
					: 'Pending: ' + pendingValidation}
			</p>
			<button
				on:click={findSolutions}
				class="{workersDone ? 'bg-tcyan-900' : 'bg-red-800'} {freeSpace <= $pieceweights
					? 'bg-opacity-100'
					: 'bg-opacity-0'} font-black py-2 px-4 basis-36 text-left rounded-br-lg"
			>
				{workersDone ? 'START' : 'ABORT'}
			</button>
		</div>
	</div>
	<div class="bg-tbrown-300 md:basis-8/12 rounded-lg flex flex-col-reverse md:flex-row">
		<div class="md:self-center p-4 w-full">
			<TetraBoard
				{rows}
				{cols}
				bind:board={blockedCells}
				on:update={(event) => {
					blockedCount += event.detail.value;
				}}
			/>
		</div>
		<div class="lg:basis-1/4 md:basis-1/3 flex flex-col min-w-48">
			<div class="flex justify-between items-end gap-2 p-4 md:pl-4">
				<h1 class="font-semibold w-min">Solution{validCombos.length == 1 ? '' : 's'} Found:</h1>
				<h1 class="text-5xl font-bold">{validCombos.length}</h1>
			</div>
			<TetraSolutionList bind:solutions={validCombos} />
		</div>
	</div>
</div>
<!-- Completion notification -->
<div class="fixed top-0 right-0 flex flex-col gap-2 items-end mt-12 select-none md:pr-2">
	{#if showFinishNotif}
		<div
			class=" bg-tbrown-500 text-white px-4 py-4 min-w-48 flex items-center gap-2 rounded-md"
			in:fly={{ duration: 200, x: '100%', opacity: 0.5, easing: cubicOut }}
			out:fly={{ delay: 2000, duration: 200, x: '100%', opacity: 0.5, easing: cubicOut }}
			on:introend={() => {
				showFinishNotif = false;
			}}
		>
			<span class="material-symbols-rounded">check</span>
			<span>Finished</span>
		</div>
	{/if}
</div>
