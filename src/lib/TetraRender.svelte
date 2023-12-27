<script>
	import { onMount } from 'svelte';
	import { tetracolors } from '$lib/stores/TetraColors';
	export let grid = 4;
	export let shape;

	let tetraSVG;

	onMount(() => {
		let gap = 3;
		let pad = 3;
		let squareSize = (100 - (grid + 1) * gap - pad * 2) / grid; // 8 + 30
		let pieceWidth = shape[0].length;
		let pieceHeight = shape.length;

		const xOffset =
			gap * ((grid - pieceWidth) / 2 + 1) + squareSize * ((grid - pieceWidth) / 2) + pad;
		const yOffset =
			gap * ((grid - pieceHeight) / 2 + 1) + squareSize * ((grid - pieceHeight) / 2) + pad;
		const pieceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		shape.forEach((row, rowIndex) => {
			row.forEach((cell, colIndex) => {
				const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
				square.setAttribute('x', `${colIndex * (squareSize + gap) + xOffset}%`);
				square.setAttribute('y', `${rowIndex * (squareSize + gap) + yOffset}%`);
				square.setAttribute('width', `${squareSize}%`);
				square.setAttribute('height', `${squareSize}%`);
				square.setAttribute('rx', '3%');
				square.style.fill = $tetracolors[cell]; /*cell != 0 ? piece.color : emptyColor*/ // Set the color
				pieceGroup.appendChild(square);
			});
		});

		tetraSVG.appendChild(pieceGroup);
	});
</script>

<div class="pb-[100%] w-full rounded-md box-border relative bg-tbrown-50">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		bind:this={tetraSVG}
		class="w-full h-full absolute top-0 bottom-0 left-0 right-0"
	></svg>
</div>
