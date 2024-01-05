<script>
	import TetraRender from '$lib/TetraRender.svelte';
	export let solutions;
	let solutionPreview;
	let openedSolution = [[]];

	function previewSolution(index) {
		openedSolution = solutions[index];
		solutionPreview.showModal();
	}
</script>

<div
	class="grid overflow-x-auto py-2 pr-8 pl-4 md:pr-0 md:overflow-x-visible grid-rows-2 md:grid-rows-none md:grid-cols-2 grid-flow-col md:grid-flow-row md:overflow-y-auto gap-4 justify-start"
>
	{#each solutions as solution, i}
		<button
			class="w-20 md:w-auto rounded-sm"
			on:click={() => {
				previewSolution(i);
			}}
		>
			<TetraRender shape={solution} grid={4} />
		</button>
	{/each}
</div>

<dialog
	bind:this={solutionPreview}
	class="rounded-lg backdrop:backdrop-brightness-50 bg-tbrown-500 w-full max-w-lg overflow-y-auto"
>
	<div class="flex justify-end">
		<button
			class="material-symbols-rounded font-black text-tbrown-50 bg-tcyan-900 px-8 py-3 mr-2"
			on:click={() => {
				solutionPreview.close();
			}}>close</button
		>
	</div>
	<div class="rounded-lg aspect-square ml-4 mb-4">
		<TetraRender shape={openedSolution} radius={1} />
	</div>
</dialog>
