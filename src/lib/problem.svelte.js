import { Board } from './board.svelte';
import { Piece } from './piece.svelte';
import { tetracolors } from './stores/TetraColors';

// TODO: get number from tetracolors
export const piece_colors_length = $state(14);

export const board = new Board();

export const pieces = $state([
	new Piece([
		[0, 1, 0],
		[1, 1, 1],
		[0, 1, 0]
	]),
	new Piece([
		[2, 2, 0],
		[0, 2, 0],
		[0, 2, 2]
	]),
	new Piece([
		[0, 3, 0],
		[0, 3, 0],
		[3, 3, 3]
	]),
	new Piece([
		[4, 0, 4],
		[4, 4, 4]
	]),
	new Piece([
		[5, 0],
		[5, 0],
		[5, 5]
	]),
	new Piece([
		[0, 6],
		[0, 6],
		[6, 6]
	]),
	new Piece([
		[0, 7, 7],
		[7, 7, 0]
	]),
	new Piece([
		[8, 8, 0],
		[0, 8, 8]
	]),
	new Piece([
		[9, 9],
		[9, 9]
	]),
	new Piece([
		[0, 10, 0],
		[10, 10, 10]
	]),
	new Piece([[11], [11], [11], [11]]),
	new Piece([
		[12, 12],
		[12, 0]
	]),
	new Piece([[13, 13]]),
	new Piece([[14]])
]);

export function getTotalPieceWeights() {
	return pieces.reduce((sum, piece) => sum + piece.quantity * piece.weight, 0);
}

export function getPlainPieces() {
	return pieces.map((piece) => ({
		id: piece.id,
		quantity: piece.quantity,
		weight: piece.weight,
		orientations: piece.orientations
	}));
}

export function resetPieceQuantities() {
	for (let piece of pieces) {
		piece.quantity = 0;
	}
}
