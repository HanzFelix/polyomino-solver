<script>
	import TetraRender from '$lib/TetraRender.svelte';

	/** @type {{pieces: any, piece_colors_length: number, deleteMode?: boolean, onDeletePiece: (piece_id: number) => void}} */
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
					class="absolute right-1 top-1 z-10 rounded-sm bg-red-800 px-1.5 text-sm text-tbrown-50"
					onclick={() => {
						onDeletePiece(piece.id);
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
				piece_id={piece.id-1}
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
			</div>
		</div>
	{/each}
</div>
