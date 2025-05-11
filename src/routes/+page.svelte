<script>
	import TetraSolutionList from '$lib/TetraSolutionList.svelte';
	import TetraBoard from '$lib/TetraBoard.svelte';
	import { tetracolors } from '$lib/stores/TetraColors.js';
	import { tetrapieces, pieceweights } from '$lib/stores/TetraPieces.js';
	import { board } from '$lib/problem.svelte.js';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import ProblemManager from './ProblemManager.svelte';
	import { solver } from '$lib/solver.svelte.js';

	tetracolors.init([
		'#8862B2',
		'#538076',
		'#67BF6A',
		'#726938',
		'#CE7647',
		'#194166',
		'#437921',
		'#BD2F3E',
		'#CC993C',
		'#663280',
		'#5B8EC7',
		'#59372F',
		'#47C1A2',
		'#D499AE'
	]);
</script>

<svelte:head>
	<title>Polyomino Solver</title>
	<meta name="description" content="Tetra Solver" />
</svelte:head>
<div class="container mx-auto flex flex-col md:flex-row gap-4 py-8 px-4 md:px-0 h-full">
	<ProblemManager />
	<div class="bg-tbrown-300 md:basis-8/12 rounded-lg flex flex-col-reverse md:flex-row">
		<div class="md:self-center p-4 w-full">
			<TetraBoard rows={board.rows} cols={board.cols} bind:board={board.blocked_cells} />
		</div>
		<div class="lg:basis-1/4 md:basis-1/3 flex flex-col min-w-48">
			<div class="flex justify-between items-end gap-2 p-4 md:pl-4">
				<h1 class="font-semibold w-min">
					Solution{solver.solutions.length == 1 ? '' : 's'} Found:
				</h1>
				<h1 class="text-5xl font-bold">{solver.solutions.length}</h1>
			</div>
			<TetraSolutionList bind:solutions={solver.solutions} />
		</div>
	</div>
</div>
<!-- Completion notification -->
<div class="fixed top-0 right-0 flex flex-col gap-2 items-end mt-12 select-none md:pr-2">
	{#if solver.just_finished}
		<div
			class=" bg-tbrown-500 text-white px-4 py-4 min-w-48 flex items-center gap-2 rounded-md"
			in:fly={{ duration: 200, x: '100%', opacity: 0.5, easing: cubicOut }}
			out:fly={{ delay: 2000, duration: 200, x: '100%', opacity: 0.5, easing: cubicOut }}
			onintroend={() => {
				solver.just_finished = false;
			}}
		>
			<span class="material-symbols-rounded">check</span>
			<span>Finished</span>
		</div>
	{/if}
</div>
