<script>
	import { tetrapieces } from '$lib/stores/TetraPieces.js';
	import TetraRender from '$lib/TetraRender.svelte';

	export let pieces;
</script>

<div
	class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-2 lg:gap-x-4 items-end"
>
	{#each pieces as piece}
		<div class="flex flex-col justify-end gap-1 rounded-t-md">
			<TetraRender
				shape={piece.shape}
				grid={4}
				on:click={() => {
					piece.quantity++;
					tetrapieces.refresh();
				}}
			/>
			<div class="flex">
				<input
					type="text"
					name={'piece' + piece.id}
					size="1"
					on:focusin={() => {
						if (piece.quantity == 0) {
							piece.quantity = '';
						}
					}}
					on:focusout={() => {
						if (piece.quantity == '') {
							piece.quantity = 0;
						}
						tetrapieces.refresh();
					}}
					placeholder="0"
					bind:value={piece.quantity}
					class="px-2 flex-1 min-w-1 bg-tbrown-50 rounded-b-md text-center {piece.quantity <= 0
						? 'text-tbrown-500'
						: 'text-tbrown-900'}"
				/>
				<!--button
					class="bg-red-500 rounded-br-md"
					on:click={() => {
						piece.quantity = 0;
						tetrapieces.refresh();
					}}>x</button
				-->
			</div>
		</div>
	{/each}
</div>
