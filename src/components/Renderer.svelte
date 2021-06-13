<script lang="ts">
	import Nav from './Nav.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import SideMenu from './SideMenu.svelte';

	export let displayTitle: string;
	export let title: string;
	export let comp: any;

	if (title) {
		document.title = title + ' | IntelliDnD';
	}
</script>

<Nav {title} />
<div style="display: flex;">
	<SideMenu />
	{#if displayTitle}
	<h1>{displayTitle}</h1>
	{/if}
	<div id='app'>
		<ProgressBar />
		<svelte:component this={comp} />
	</div>
</div>

<style>
	#app {
		width: 100%;
	}
</style>
