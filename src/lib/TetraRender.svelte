<script lang="ts">
	import { polyominoConfig } from './config.svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface PolyominoSVGProps extends HTMLAttributes<HTMLDivElement> {
		grid: number;
		shape: Array<Array<number | string>>;
		radius: number;
		piece_colors_length: number;
		fill?: boolean;
	}

	let {
		grid = 4,
		radius = 3,
		shape,
		piece_colors_length,
		fill = false,
		...rest
	}: PolyominoSVGProps = $props();
	let tetraSVG: SVGElement;

	$effect(() => {
		tetraSVG.innerHTML = '';

		const shapeWidth = shape[0].length;
		const shapeHeight = shape.length;
		const shapeMaxDim = Math.max(shapeHeight, shapeWidth);
		grid = shapeMaxDim < grid ? grid : shapeMaxDim;

		const gap = grid < 5 ? 2 : 0.5;
		const rad = grid < 5 ? 2 : grid < 8 ? 1 : 0;

		const pad = 3;
		const squareSize = (100 - (grid + 1) * gap - pad * 2) / grid; // 8 + 30

		const xOffset =
			gap * ((grid - shapeWidth) / 2 + 1) + squareSize * ((grid - shapeWidth) / 2) + pad;
		const yOffset =
			gap * ((grid - shapeHeight) / 2 + 1) + squareSize * ((grid - shapeHeight) / 2) + pad;
		const shapeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		if (fill) {
			const blackrect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			blackrect.setAttribute('x', `${xOffset - (pad - 1) / 2}%`);
			blackrect.setAttribute('y', `${yOffset - (pad - 1) / 2}%`);
			blackrect.setAttribute('width', `${100 - xOffset * 2 + pad - 1}%`);
			blackrect.setAttribute('height', `${100 - yOffset * 2 + pad - 1}%`);
			blackrect.setAttribute('rx', `${rad + 1}%`);
			blackrect.style.fill = 'black';
			blackrect.style.opacity = '75%';
			shapeGroup.appendChild(blackrect);
		}
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
						? polyominoConfig.colors['X']
						: polyominoConfig.colors[
								((Number(cell) - 1) % piece_colors_length) + 1
							]; /*cell != 0 ? shape.color : emptyColor*/ // Set the color
				shapeGroup.appendChild(square);
			});
		});

		tetraSVG.appendChild(shapeGroup);
	});
</script>

<div
	class={['pb-[100%] w-full box-border relative', fill ? 'bg-tbrown-500' : 'bg-tbrown-50']}
	style="border-radius: inherit;"
	role="button"
	tabindex="-1"
	{...rest}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		bind:this={tetraSVG}
		class="w-full h-full absolute top-0 bottom-0 left-0 right-0"
	></svg>
</div>
