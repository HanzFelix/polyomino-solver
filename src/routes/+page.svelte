<script>
	import TetraPieceList from '$lib/TetraPieceList.svelte';
	import { fade } from 'svelte/transition';
	import TetraSolutionList from '$lib/TetraSolutionList.svelte';
	import { tetracolors } from '$lib/stores/TetraColors.js';
	import { createTetraPieceStore } from '$lib/stores/TetraPieces.js';
	import { createTetraSolutionStore } from '$lib/stores/TetraSolutions.js';

	tetracolors.init({
		1: '#CC993C',
		2: '#47C1A2',
		3: '#BD4F5A',
		4: '#217958',
		5: '#4D78A9',
		6: '#CE7647',
		7: '#664A74',
		8: '#65A156',
		9: '#BF7A7E'
	});

	const pieces = createTetraPieceStore([
		[
			[1, 1],
			[1, 1]
		],
		[[2, 2, 2, 2]],
		[
			[3, 3, 0],
			[0, 3, 3]
		],
		[
			[0, 4, 4],
			[4, 4, 0]
		],
		[
			[5, 0, 0],
			[5, 5, 5]
		],
		[
			[0, 0, 6],
			[6, 6, 6]
		],
		[
			[0, 7, 0],
			[7, 7, 7]
		],
		[
			[0, 8, 0],
			[8, 8, 8],
			[0, 8, 0]
		],
		[[9]]
	]);

	const solutions = createTetraSolutionStore([
		[
			['X', 4, 4, 'X'],
			[4, 4, 1, 1],
			[3, 3, 1, 1],
			['X', 3, 3, 'X']
		],
		[
			['X', 4, 4, 'X'],
			[4, 4, 9, 9],
			[3, 3, 9, 9],
			['X', 3, 3, 'X']
		],
		[
			['X', 9, 9, 'X'],
			[1, 1, 1, 1],
			[1, 1, 1, 1],
			['X', 9, 9, 'X']
		],
		[
			['X', 4, 4, 'X'],
			[4, 4, 1, 1],
			[3, 3, 1, 1],
			['X', 3, 3, 'X']
		],
		[
			['X', 4, 4, 'X'],
			[4, 4, 9, 9],
			[3, 3, 9, 9],
			['X', 3, 3, 'X']
		],
		[
			['X', 9, 9, 'X'],
			[1, 1, 1, 1],
			[1, 1, 1, 1],
			['X', 9, 9, 'X']
		],
		[
			['X', 4, 4, 'X'],
			[4, 4, 1, 1],
			[3, 3, 1, 1],
			['X', 3, 3, 'X']
		],
		[
			['X', 4, 4, 'X'],
			[4, 4, 9, 9],
			[3, 3, 9, 9],
			['X', 3, 3, 'X']
		],
		[
			['X', 9, 9, 'X'],
			[1, 1, 1, 1],
			[1, 1, 1, 1],
			['X', 9, 9, 'X']
		]
	]);

	let blockedCells = new Array(16).fill(false);
</script>

<div
	class="container mx-auto flex flex-col md:max-h-screen md:flex-row gap-4 py-8 px-4 md:px-0 h-full"
>
	<div class="md:basis-4/12 flex flex-col justify-between bg-tbrown-300 rounded-md">
		<div class="flex gap-6 flex-col p-4 bg-tbrown-300 rounded-t-md md:overflow-y-auto">
			<section>
				<div class="flex justify-between mb-2 items-end flex-wrap">
					<h2 class="text-xl">Board size</h2>
					<div
						id="color-apply"
						class="text-tbrown-50 bg-tcyan-900 px-2 relative rounded-md flex overflow-hidden"
					>
						<div id="size-apply" class="max-w-xl truncate py-1">
							<button>Apply changes&nbsp;</button>
						</div>
						<span class="font-bold py-1">&check;</span>
						<!--svg
              width="6"
              height="15"
              viewBox="0 0 4 10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0.5 7.5V10H3.5V7.5H0.5Z" fill="#FCF5E5" />
              <path d="M3.5 6H0.5L0 0H4L3.5 6Z" fill="#FCF5E5" />
            </svg-->
					</div>
				</div>
				<div class="flex gap-4">
					<div class="basis-full flex rounded-md overflow-hidden">
						<label for="boardx" class="py-1 px-2 font-black text-tbrown-50 bg-tbrown-500">
							X
						</label>
						<input
							type="text"
							name="boardx"
							class="basis-full px-2 bg-tbrown-50"
							size="1"
							placeholder="4"
						/>
					</div>
					<div class="basis-full flex rounded-md overflow-hidden">
						<label for="boardy" class="py-1 px-2 font-black text-tbrown-50 bg-tbrown-500">
							Y
						</label>
						<input
							type="text"
							name="boardy"
							class="px-2 basis-full bg-tbrown-50"
							size="1"
							placeholder="4"
						/>
					</div>
				</div>
			</section>
			<section>
				<div class="flex justify-between mb-2">
					<h2 class="text-xl">Board shape</h2>
					<span class="px-2 py-1 rounded-md font-black text-tbrown-50 bg-tbrown-500">
						&check;
						<!--svg
              width="6"
              height="15"
              viewBox="0 0 4 10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0.5 7.5V10H3.5V7.5H0.5Z" fill="#FCF5E5" />
              <path d="M3.5 6H0.5L0 0H4L3.5 6Z" fill="#FCF5E5" />
            </svg-->
					</span>
				</div>
				<div class="flex rounded-md overflow-hidden">
					<label for="boardx" class="py-1 px-2 font-black text-tbrown-50 bg-tbrown-500"> ⓘ </label>
					<p class="basis-full px-2">Select squares on the board to block</p>
				</div>
			</section>
			<section>
				<div class="flex justify-between mb-2">
					<h2 class="text-xl">Pieces</h2>
					<span class="px-2 py-1 rounded-md text-tbrown-50 bg-tcyan-900"> Add + </span>
				</div>
				<TetraPieceList pieces={$pieces} />
			</section>
		</div>
		<div class="flex rounded-b-md overflow-hidden">
			<p class="bg-tbrown-500 py-2 px-4 text-tbrown-50 basis-full">Ready</p>
			<button id="temp" class="bg-tcyan-900 font-black py-2 px-4 basis-36 text-left text-tbrown-50">
				START
			</button>
		</div>
	</div>
	<div class="bg-tbrown-300 md:basis-8/12 rounded-md flex flex-col-reverse md:flex-row">
		<div class="md:self-center p-4 basis-full w-full">
			<div
				id="gridresult"
				class="m-auto grid grid-cols-4 gap-3 p-4 md:max-w-md rounded-lg aspect-square bg-tbrown-50"
			>
				{#each blockedCells as blocked, i}
					<button
						class="transition-colors duration-200 rounded-md p-3 {blocked
							? 'bg-tcyan-400'
							: 'bg-tcyan-300'}"
						on:click={() => (blocked = !blocked)}
					>
						<!--svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
							<path
								class="fill-tbrown-50 {blocked ? 'opacity-40' : 'opacity-0'}"
								d="M18 0C8.059 0 0 8.059 0 18s8.059 18 18 18s18-8.059 18-18S27.941 0 18 0zm13 18c0 2.565-.753 4.95-2.035 6.965L11.036 7.036A12.916 12.916 0 0 1 18 5c7.18 0 13 5.821 13 13zM5 18c0-2.565.753-4.95 2.036-6.964l17.929 17.929A12.93 12.93 0 0 1 18 31c-7.179 0-13-5.82-13-13z"
							></path>
						</svg-->
					</button>
				{/each}
			</div>
		</div>
		<div class="lg:basis-1/4 md:basis-1/3 flex flex-col">
			<div class="flex justify-between items-end gap-2 p-4 md:pl-2">
				<h1 class="font-semibold">Solution(s) Found:</h1>
				<h1 id="count-el" class="text-5xl font-bold">99</h1>
			</div>
			<TetraSolutionList solutions={$solutions} />
		</div>
	</div>
</div>
