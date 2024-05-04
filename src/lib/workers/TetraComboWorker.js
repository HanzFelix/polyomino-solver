let foundCombos;
let curCombo;

onmessage = (event) => {
	const { pieces, maxWeight } = event.data;
	searchPieceCombos(tallyPieceWeights(pieces), maxWeight);
	postMessage({ state: 'done', combo: [] });
};

function tallyPieceWeights(pieces) {
	const weights = [];
	for (let i = 0; i < pieces.length; i++) {
		for (let j = 0; j < pieces[i].quantity; j++) {
			weights.push({ id: pieces[i].id, weight: pieces[i].weight });
		}
	}
	return weights;
}

// search combinations from bag (using sum of piece weights == free_space)
function searchPieceCombos(pieceWeights, maxWeight) {
	let totalWeight = 0;

	pieceWeights.forEach((piece) => {
		totalWeight += piece.weight;
	});

	// impossible to fill the board?
	if (totalWeight < maxWeight) {
		return []; // TODO: prob end the worker some way
	}

	// generate hypothetical combinations
	foundCombos = new Set();
	curCombo = [];
	findCombo(pieceWeights, maxWeight, totalWeight, 0, 0);
}

// recursively search for possible set of pieces as solution
function findCombo(pieceWeights, maxWeight, remWeight, curWeight, curIndex) {
	// already valid combo? add
	if (curWeight == maxWeight) {
		combo = curCombo.slice().sort((a, b) => {
			return a - b;
		});
		comboS = combo.join('-');
		if (!foundCombos.has(comboS)) {
			foundCombos.add(comboS);
			postMessage({ state: 'found', combo: combo });
		}
		return;
	}

	// skip oversized combo
	if (curWeight > maxWeight || curIndex == pieceWeights.length) {
		return;
	}

	// test all next possible sequence
	let rWeight = remWeight;
	for (let i = curIndex; i < pieceWeights.length; i++) {
		let newWeight = pieceWeights[i].weight + curWeight;
		rWeight -= pieceWeights[i].weight;

		// not enough remaining pieces to fill the board
		if (rWeight + newWeight < maxWeight) {
			return;
		}

		// test next combo sequence
		curCombo.push(pieceWeights[i].id);
		findCombo(pieceWeights, maxWeight, rWeight, newWeight, i + 1);
		curCombo.pop();
	}

	// skip current piece
	findCombo(pieceWeights, maxWeight, rWeight, curWeight, curIndex + 1);
}
