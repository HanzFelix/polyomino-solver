<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let username = 'anon';

	function sayHello() {
		dispatch('message', { text: 'Hello!' });
	}
</script>

<div class="bg-yellow-500">
	<p>Oh hi {username}!</p>
	<button on:click={sayHello} class="bg-blue-400 px-4 py-1 rounded-md my-2">Click?</button>
	<img src="https://placehold.co/64x64" alt="full of text" />
</div>
