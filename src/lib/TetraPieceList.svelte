<script>
	import TetraRender from '$lib/TetraRender.svelte';

	/** @type {{pieces: any, piece_colors_length: number, deleteMode?: boolean, onDeletePiece?: (piece: any) => void}} */
	let { pieces, piece_colors_length, deleteMode = false, onDeletePiece } = $props();
</script>

<div
	class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-2 items-end"
>
	{#each pieces as piece, i (piece.id)}
		<div class="relative flex flex-col justify-end gap-1 rounded-t-md">
			{#if deleteMode}
				<button
					type="button"
					aria-label={`delete piece ${i}`}
					class="absolute right-1 top-1 z-10 rounded-full bg-red-800 px-2 py-1 text-xs font-black text-tbrown-50"
					onclick={(event) => {
						event.stopPropagation();
						onDeletePiece?.(piece);
					}}
				>
					×
				</button>
			{/if}
			<TetraRender
				{piece_colors_length}
				shape={piece.shape}
				grid={4}
				title={`piece-${i}`}
				onclick={() => {
					piece.quantity++;
				}}
			/>
			<div class="flex">
				<input
					type="text"
					name={'piece' + piece.id}
					aria-label={'piece' + piece.id}
					size="1"
					onfocusin={() => {
						if (piece.quantity == 0) {
							piece.quantity = '';
						}
					}}
					onfocusout={() => {
						if (piece.quantity == '') {
							piece.quantity = 0;
						}
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
