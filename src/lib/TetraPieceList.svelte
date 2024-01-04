<script>
	import { tetrapieces } from '$lib/stores/TetraPieces.js';
	import TetraRender from '$lib/TetraRender.svelte';

	export let pieces;
</script>

<div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
	{#each pieces as piece}
		<div class="flex flex-col justify-end gap-1 rounded-t-md">
			<TetraRender shape={piece.shape} grid={4} />
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
				class="px-2 basis-full bg-tbrown-50 rounded-b-md text-center {piece.quantity <= 0
					? 'text-tbrown-500'
					: 'text-tbrown-900'}"
			/>
		</div>
	{/each}
</div>
