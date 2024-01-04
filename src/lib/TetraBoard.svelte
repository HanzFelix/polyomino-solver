<script>
	export let board;
	export let rows;
	export let cols;
	//visual transpose if col < row
</script>

<div
	class="md:max-w-md md:max-h-[28rem] m-auto bg-tbrown-50 aspect-square flex flex-col justify-center rounded-lg"
>
	<div
		class="grid rounded-lg
		{cols < rows ? '-scale-x-100 -rotate-90' : ''} 
		{Math.max(rows, cols) < 7 ? 'gap-1 p-4 ' : 'p-2'}"
		style="grid-template-columns: {`repeat(${Math.max(rows, cols)}, minmax(auto, 1fr))`};"
	>
		{#each board as blocked, i}
			<button
				class="transition-colors border border-tbrown-50 duration-200 rounded-md aspect-square {blocked
					? 'bg-tcyan-400'
					: 'bg-tcyan-300'} "
				on:click={() => {
					blocked = !blocked;
				}}
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
