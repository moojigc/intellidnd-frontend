<script lang="ts">
	import Nav from './Nav.svelte';

	export let displayTitle: string;
	export let title: string;
	export let comp: any;

	if (title) {
		document.title = title + ' | IntelliDnD';
	}
</script>

<Nav {title}/>
{#if displayTitle}
	<h1>{displayTitle}</h1>
{/if}
<svelte:component this={comp} />

<style>
	h1 {
		margin: 0.5em auto;
		text-align: center;
	}
</style>
