// worker stuff
import comboWorkerUrl from '$lib/workers/TetraComboWorker.js?url';
import validWorkerUrl from '$lib/workers/TetraValidWorker.js?url';

export class Solver {
	solutions = $state([]);
	just_finished = $state(false);
	pending_validation = $state(0);
	#finalBoard;
	#comboWorker;
	#validWorker;
	#hypotheticalCombos = 0;

	solve(problem) {
		if (this.getSolverStatus() && problem.board.free_space <= problem.getTotalPieceWeights()) {
			this.#loadWorkers(problem);
			this.hypotheticalCombos = 0;
			this.solutions = [];
			this.#finalBoard = problem.board.boardifyBlocked();
			this.pending_validation = 1;
			this.#comboWorker.postMessage({
				// TODO: safely remove $state from Piece object
				pieces: problem.getPlainPieces(),
				maxWeight: this.#finalBoard.free_space
			});
		} else if (!getSolverStatus()) {
			this.#stopWorkers();
		}
	}

	getSolverStatus() {
		return this.pending_validation == 0;
	}

	#loadWorkers(problem) {
		if (!this.#comboWorker) {
			this.#comboWorker = new Worker(comboWorkerUrl);
			this.#comboWorker.onmessage = (event) => {
				const { state, combo } = event.data;
				if (state == 'found') {
					this.#hypotheticalCombos++;
					this.pending_validation++;
					this.#validWorker.postMessage({
						tetraBag: problem.getPlainPieces(),
						tetraBoard: this.#finalBoard,
						combination: combo
					});
				} else {
					this.pending_validation--;
					if (!this.pending_validation) {
						this.just_finished = true;
						this.#stopWorkers();
					}
				}
			};
		}

		if (!this.#validWorker) {
			this.#validWorker = new Worker(validWorkerUrl);
			this.#validWorker.onmessage = (event) => {
				const { state, result } = event.data;
				if (state == 'found') {
					this.solutions = [...this.solutions, result];
				}
				this.pending_validation--;
				if (!this.pending_validation) {
					this.just_finished = true;
					this.#stopWorkers();
				}
			};
		}
	}

	#stopWorkers() {
		this.#comboWorker.terminate();
		this.#validWorker.terminate();

		this.#comboWorker = undefined;
		this.#validWorker = undefined;

		this.#hypotheticalCombos = 0;
		this.pending_validation = 0;
	}
}
