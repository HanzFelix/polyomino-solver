<script>
	import { onMount } from 'svelte';
	import TetraRender from '$lib/TetraRender.svelte';

	export let pieces;
</script>

<div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
	{#each pieces as piece}
		<div class="flex flex-col justify-end gap-2">
			<TetraRender shape={piece.shape} grid={4} />
			<input
				type="text"
				name={'piece' + piece.id}
				placeholder="0"
				inputmode="numeric"
				pattern="\\d*"
				size="1"
				class="px-2 basis-full bg-tbrown-50 rounded-md text-center"
			/>
		</div>
	{/each}
</div>
