<script>
	import TetraRender from '$lib/TetraRender.svelte';
	/** @type {{solutions: any}} */
	let { solutions, piece_colors_length } = $props();
	let solutionPreview = $state();
	let openedSolution = $state([[]]);

	function previewSolution(index) {
		openedSolution = solutions[index];
		solutionPreview.showModal();
	}
</script>

<div
	class="grid overflow-x-auto py-2 px-4 md:pr-2 md:overflow-x-visible grid-rows-2 md:grid-rows-none md:grid-cols-2 grid-flow-col md:grid-flow-row md:overflow-y-auto gap-4 justify-start"
>
	{#each solutions as solution, i (solution)}
		<button
			title="Solution"
			class="w-20 md:w-auto rounded-xs"
			onclick={() => {
				previewSolution(i);
			}}
		>
			<TetraRender shape={solution} grid={4} {piece_colors_length} />
		</button>
	{/each}
</div>

<dialog
	bind:this={solutionPreview}
	class="rounded-lg backdrop:backdrop-brightness-40 bg-tbrown-900 w-full max-w-lg overflow-y-auto m-auto p-4 pt-0"
>
	<div class="flex justify-end px-2">
		<button
			class="material-symbols-rounded font-black text-tbrown-50 bg-red-800 px-8 py-2"
			onclick={() => {
				solutionPreview.close();
			}}>close</button
		>
	</div>
	<div class="rounded-lg aspect-square">
		<TetraRender shape={openedSolution} radius={1} {piece_colors_length} grid={8} fill={true} />
	</div>
</dialog>
