<script lang="ts">
	import Nav from './Navigation/Nav.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import SideMenu from './Navigation/SideMenu.svelte';
	import user from '../stores/user';
	import { navigate } from 'svelte-routing';

	export let displayTitle: string;
	export let title: string;
	export let comp: any;
	export let isPublic = false;

	if (title) {
		document.title = title + ' | IntelliDnD';
	}
	if (!isPublic && !$user.id) {

		navigate('/login', { replace: true });
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
