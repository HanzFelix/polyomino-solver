<script>
	import TestPreview from '../lib/TestPreview.svelte';
	let name = 'Person';
	let placehold = 'https://placehold.co/128x128';
	let isChecked = false;
	export let data;

	let count = 1;
	function increment() {
		count += 1;
	}

	// computed value
	$: doubled = count * 2;
	// multiline computed value
	$: {
		console.log(`count updated value: ${count}`);
		console.log('this is also logged');
	}

	$: if (count >= 10) {
		count = 1;
	}

	let numbers = [];
	function pushNumber() {
		numbers = [...numbers, numbers.length + 1];
	}

	function popNumber() {
		numbers = numbers.slice(1);
	}

	function daEvent(event) {
		name = event.detail.text;
	}
</script>

<h1>Hello {name.toUpperCase()}</h1>
<img src={placehold} alt="{name} full of text" />
<TestPreview username="person" on:message={daEvent} />
<button
	class="bg-blue-400 px-4 py-1 rounded-md my-2 active:bg-blue-500 hover:bg-blue-300"
	on:click={increment}
>
	Clicked {count} {count < 2 ? 'time' : 'times'}.</button
>
<p>That's half of {doubled}!</p>
{#if count > 8}
	<p>Restarting in the next click.</p>
{:else if count > 6}
	<p>Approaching danger levels</p>
{:else}
	<p>...</p>
{/if}

<img src={'https://placehold.co/' + count * 20 + 'x' + count * 20} alt="{name} full of text" />
<button on:click={pushNumber}>click!</button>
<button on:click|preventDefault={popNumber}>Pop!</button>
{#each numbers as number, index}
	<p>[{index}] {number}</p>
{/each}
<div class="flex flex-col items-start gap-2">
	<input
		type="text"
		bind:value={name}
		class="bg-gray-100 border border-blue-800 px-2 py-1 rounded-md"
	/>
	<input
		type="number"
		bind:value={count}
		class="bg-gray-100 border border-blue-800 px-2 py-1 rounded-md"
	/>
	<div>
		<input type="checkbox" bind:checked={isChecked} />
		<label for="">This is a checkbox</label>
	</div>
</div>
<h1>Hello {data.visited ? 'friend' : 'stranger'}!</h1>
