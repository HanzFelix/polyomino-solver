<script>
	import '../app.css';
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<div class="text-tbrown-900 bg-tbrown-900 md:h-screen md:p-2">
	{@render children?.()}
</div>
