onmessage = (event) => {
	const { pieceWeights, maxWeight } = event.data;
	generatePieceCombos(pieceWeights, maxWeight);
	postMessage({ state: 'done', combo: [] });
};

// search combinations from bag (via sum of piece weight == free_space)
function generatePieceCombos(pieceWeights, maxWeight) {
	let totalWeight = 0;

	pieceWeights.forEach((piece) => {
		totalWeight += piece.weight;
	});

	// impossible to fill the board?
	if (totalWeight < maxWeight) {
		return []; // TODO: prob end the worker some way
	}

	// generate hypothetical combinations
	let foundCombos = new Set();
	let curCombo = [];
	findCombo(pieceWeights, foundCombos, curCombo, maxWeight, totalWeight, 0, 0);

	// parse array of strings
	/*let filteredList = [];
    for (let combo of filteredBag) {
      filteredList.push(combo.split("-").map(Number));
    }
  
    return filteredList;*/
}

function findCombo(pieceWeights, foundCombos, curCombo, maxWeight, remWeight, curWeight, curIndex) {
	// already valid combo? add
	if (curWeight == maxWeight) {
		combo = curCombo.slice().sort();
		comboS = combo.join('-');
		if (!foundCombos.has(comboS)) {
			foundCombos.add(comboS);
			postMessage({ state: 'found', combo: combo });
		}
		return;
	}

	// test all next possible sequence
	let rWeight = remWeight;
	for (let i = curIndex; i < pieceWeights.length; i++) {
		let newWeight = pieceWeights[i].weight + curWeight;
		rWeight -= pieceWeights[i].weight;

		// not enough pieces to fill the board
		if (rWeight + newWeight < maxWeight) {
			return;
		}

		// skip oversized combo
		if (newWeight > maxWeight) {
			continue;
		}

		// test next combo sequence
		curCombo.push(pieceWeights[i].id);
		findCombo(pieceWeights, foundCombos, curCombo, maxWeight, rWeight, newWeight, i + 1);
		curCombo.pop();

		// skip current piece
		findCombo(pieceWeights, foundCombos, curCombo, maxWeight, rWeight, curWeight, i + 1);
	}
}
