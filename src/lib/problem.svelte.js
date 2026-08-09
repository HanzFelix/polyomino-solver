import { Board } from './board.svelte';
import { Piece } from './piece.svelte';

export class Problem {
	pieces = $state([]);
	piece_colors_length = $state(0); // TODO: get number from tetracolors

	constructor() {
		this.pieces = this.initializePieces();
		this.piece_colors_length = 14;
		this.board = new Board();
	}

	initializePieces() {
		return [
			new Piece([
				[0, 1, 0],
				[1, 1, 1],
				[0, 1, 0]
			]),
			new Piece([
				[1, 1, 0],
				[0, 1, 0],
				[0, 1, 1]
			]),
			new Piece([
				[0, 1, 0],
				[0, 1, 0],
				[1, 1, 1]
			]),
			new Piece([
				[1, 0, 1],
				[1, 1, 1]
			]),
			new Piece([
				[1, 0],
				[1, 0],
				[1, 1]
			]),
			new Piece([
				[0, 1],
				[0, 1],
				[1, 1]
			]),
			new Piece([
				[0, 1, 1],
				[1, 1, 0]
			]),
			new Piece([
				[1, 1, 0],
				[0, 1, 1]
			]),
			new Piece([
				[1, 1],
				[1, 1]
			]),
			new Piece([
				[0, 1, 0],
				[1, 1, 1]
			]),
			new Piece([[1], [1], [1], [1]]),
			new Piece([
				[1, 1],
				[1, 0]
			]),
			new Piece([[1, 1]]),
			new Piece([[1]])
		];
	}

	setQuantity(index, quantity) {
		this.pieces.at(index).quantity = quantity;
	}

	getTotalPieceWeights() {
		return this.pieces.reduce((sum, piece) => sum + piece.quantity * piece.weight, 0);
	}

	getPlainPieces() {
		return this.pieces.map((piece) => ({
			id: piece.id,
			quantity: piece.quantity,
			weight: piece.weight,
			orientations: piece.orientations
		}));
	}

	resetPieceQuantities() {
		for (let piece of this.pieces) {
			piece.quantity = 0;
		}
	}
}
