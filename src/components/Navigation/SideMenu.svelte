<script lang="ts">
	import menu from '../../stores/menu';
	import Icon from '../Icon.svelte';
	import user from '../../stores/user';
	import browser from '../../stores/browser';

	// @ts-ignore
	$: size = ($menu ? 'medium' : 'small') as const;

	function changeMode() {

		document.body.className = $browser.mode === 'dark' ? 'light' : 'dark';
		// @ts-ignore
		browser.set({ mode: document.body.className });
	}
</script>

<aside id="menu" class={$menu ? 'open' : 'shrunk'}>
	<ul>
		{#if $user.id}
			<Icon expanded={$menu} icon="account_circle" {size}>Account</Icon>
			<Icon
				expanded={$menu}
				color="var(--color-red)"
				icon="exit_to_app"
				to="/logout"
				{size}>Log out</Icon
			>
		{:else if location.pathname !== '/login'}
			<Icon
				expanded={$menu}
				color="var(--color-green)"
				icon="chevron_right"
				to="/login"
				{size}>Log in</Icon
			>
		{:else}
			<Icon
				expanded={$menu}
				color="var(--color-green)"
				icon="chevron_right"
				to="/signup"
				{size}>Sign up</Icon
			>
		{/if}
		<Icon
			{size}
			expanded={$menu}
			icon={$browser.mode === 'dark' ? 'wb_sunny' : 'wb_incandescent'}
			handleClick={changeMode}
			>{$browser.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}</Icon
		>
	</ul>
</aside>

<style lang="scss">
	#menu {
		background-color: var(--color-5);
		border-top: 3px solid var(--color-3);
		height: 100vh;
		z-index: 1;
		margin-top: 0px;
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
			0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
		& > ul {
			display: flex;
			flex-direction: column;
			margin: 0;
		}
	}
	.open {
		width: 16rem;
	}
	.shrunk {
		width: 4rem;
	}

	@media screen and (max-width: 800px) {
		#menu {
			margin-top: -1px;
			height: 100%;
		}
		.open {
			position: absolute;
			z-index: 5;
		}
		.shrunk {
			width: 0rem;
			display: none;
		}
	}
</style>
