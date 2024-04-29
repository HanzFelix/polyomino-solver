<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let board;
	export let rows;
	export let cols;

	function updateBlocked(index) {
		board[index] = !board[index];
		dispatch('update', { value: board[index] ? 1 : -1 });
	}
</script>

<div
	class="md:max-w-md md:max-h-[28rem] m-auto bg-tbrown-50 aspect-square flex flex-col justify-center rounded-lg"
>
	<div
		class="grid rounded-lg
		{cols < rows ? '-scale-x-100 -rotate-90' : ''} 
		{Math.max(rows, cols) < 7 ? 'gap-0.5 lg:gap-1 p-4 ' : 'p-2 lg:gap-0.5'}"
		style="grid-template-columns: {`repeat(${Math.max(rows, cols)}, minmax(auto, 1fr))`};"
	>
		{#each board as blocked, i}
			<button
				class="transition-colors border border-tbrown-50 duration-200 rounded-md aspect-square {blocked
					? 'bg-tcyan-400'
					: 'bg-tcyan-300'} "
				on:click={() => {
					updateBlocked(i);
				}}
			>
			</button>
		{/each}
	</div>
</div>
