<script lang="ts">
	import Nav from './Navigation/Nav.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import SideMenu from './Navigation/SideMenu.svelte';

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
	<div id='app'>
		<ProgressBar />
		{#if displayTitle}
			<h1>{displayTitle}</h1>
		{/if}
		<svelte:component this={comp} />
	</div>
</div>

<style lang='scss'>
	#app {
		h1 {
			text-align: center;
		}
		width: 100%;
	}
</style>
