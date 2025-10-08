<script>
	import { tetracolors } from '$lib/stores/TetraColors';

	let { onclick, onkeydown, grid = 4, radius = 3, shape, piece_colors_length } = $props();
	let tetraSVG;

	$effect(() => {
		tetraSVG.innerHTML = '';

		let shapeWidth = shape[0].length;
		let shapeHeight = shape.length;
		grid = Math.max(shapeHeight, shapeWidth) < grid ? grid : Math.max(shapeHeight, shapeWidth);

		let gap, rad;
		if (grid < 5) {
			gap = 2;
			rad = 3;
		} else {
			gap = 0.5;
			rad = 2;
		}
		rad = radius ? radius : rad;
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
				square.setAttribute('rx', `${rad}%`);
				square.style.fill =
					cell == 'X'
						? $tetracolors['X']
						: $tetracolors[
								((cell - 1) % piece_colors_length) + 1
							]; /*cell != 0 ? shape.color : emptyColor*/ // Set the color
				shapeGroup.appendChild(square);
			});
		});

		tetraSVG.appendChild(shapeGroup);
	});
</script>

<div
	class="pb-[100%] w-full box-border relative bg-tbrown-50"
	style="border-radius: inherit;"
	role="button"
	tabindex="-1"
	{onclick}
	{onkeydown}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		bind:this={tetraSVG}
		class="w-full h-full absolute top-0 bottom-0 left-0 right-0"
	></svg>
</div>
