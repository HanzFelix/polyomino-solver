<script>
	import { onMount } from 'svelte';
	import { tetracolors } from '$lib/stores/TetraColors';
	export let grid = 4;
	export let shape;

	let tetraSVG;

	onMount(() => {
		let shapeWidth = shape[0].length;
		let shapeHeight = shape.length;
		grid = Math.max(shapeHeight, shapeWidth) < grid ? grid : Math.max(shapeHeight, shapeWidth);

		let gap = grid < 6 ? 3 : 1;
		let pad = 3;
		let squareSize = (100 - (grid + 1) * gap - pad * 2) / grid; // 8 + 30

		const xOffset =
			gap * ((grid - shapeWidth) / 2 + 1) + squareSize * ((grid - shapeWidth) / 2) + pad;
		const yOffset =
			gap * ((grid - shapeHeight) / 2 + 1) + squareSize * ((grid - shapeHeight) / 2) + pad;
		const shapeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		shape.forEach((row, rowIndex) => {
			row.forEach((cell, colIndex) => {
				const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
				square.setAttribute('x', `${colIndex * (squareSize + gap) + xOffset}%`);
				square.setAttribute('y', `${rowIndex * (squareSize + gap) + yOffset}%`);
				square.setAttribute('width', `${squareSize}%`);
				square.setAttribute('height', `${squareSize}%`);
				square.setAttribute('rx', '3%');
				square.style.fill = $tetracolors[cell]; /*cell != 0 ? shape.color : emptyColor*/ // Set the color
				shapeGroup.appendChild(square);
			});
		});

		tetraSVG.appendChild(shapeGroup);
	});
</script>

<div class="pb-[100%] w-full rounded-md box-border relative bg-tbrown-50">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		bind:this={tetraSVG}
		class="w-full h-full absolute top-0 bottom-0 left-0 right-0"
	></svg>
</div>
