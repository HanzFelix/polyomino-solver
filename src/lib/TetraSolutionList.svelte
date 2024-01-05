<script>
	import TetraRender from '$lib/TetraRender.svelte';
	export let solutions;
</script>

<div
	class="grid overflow-x-auto py-2 pr-8 md:pr-0 md:overflow-x-visible grid-rows-2 md:grid-rows-none md:grid-cols-2 grid-flow-col md:grid-flow-row md:overflow-y-auto gap-4 justify-start"
>
	{#each solutions as solution}
		<div class="w-20 md:w-auto rounded-sm">
			<TetraRender shape={solution} grid={4} />
		</div>
	{/each}
</div>
