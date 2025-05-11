// worker stuff
import comboWorkerUrl from '$lib/workers/TetraComboWorker.js?url';
import validWorkerUrl from '$lib/workers/TetraValidWorker.js?url';
import { board, getTotalPieceWeights, getPlainPieces } from './problem.svelte';

let finalBoard;
let hypotheticalCombos = 0;
let comboWorker, validWorker;
export let solver = $state({ solutions: [], just_finished: false, pending_validation: 0 });

export function solve() {
	if (getSolverStatus() && board.free_space <= getTotalPieceWeights()) {
		loadWorkers();
		hypotheticalCombos = 0;
		solver.solutions = [];
		finalBoard = board.boardifyBlocked();
		solver.pending_validation = 1;
		comboWorker.postMessage({
			// TODO: safely remove $state from Piece object
			pieces: getPlainPieces(),
			maxWeight: finalBoard.free_space
		});
	} else if (!getSolverStatus()) {
		stopWorkers();
	}
}

export function getSolverStatus() {
	return solver.pending_validation == 0;
}

function loadWorkers() {
	if (!comboWorker) {
		comboWorker = new Worker(comboWorkerUrl);
		comboWorker.onmessage = (event) => {
			const { state, combo } = event.data;
			if (state == 'found') {
				hypotheticalCombos++;
				solver.pending_validation++;
				validWorker.postMessage({
					tetraBag: getPlainPieces(),
					tetraBoard: finalBoard,
					combination: combo
				});
			} else {
				solver.pending_validation--;
				if (!solver.pending_validation) {
					solver.just_finished = true;
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
				solver.solutions = [...solver.solutions, result];
			}
			solver.pending_validation--;
			if (!solver.pending_validation) {
				solver.just_finished = true;
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
	solver.pending_validation = 0;
}
