<script lang="ts">
	import menu from '../../stores/menu';
	import Icon from '../Icon.svelte';
	import user from '../../stores/user';

	// @ts-ignore
	$: size = ($menu ? 'medium' : 'small') as const;
</script>

<aside id="menu" class={$menu ? 'open' : 'shrunk'}>
	<ul>
		{#if $user.id}
			<Icon hideText={!$menu} icon="account_circle" {size}>Account</Icon>
			<Icon
				hideText={!$menu}
				color="var(--color-red)"
				icon="exit_to_app"
				to="/logout"
				{size}>Log out</Icon
			>
		{:else if location.pathname !== '/login'}
			<Icon
				hideText={!$menu}
				color="var(--color-green)"
				icon="chevron_right"
				to="/login"
				{size}>Log in</Icon
			>
		{:else}
			<Icon
				hideText={!$menu}
				color="var(--color-green)"
				icon="chevron_right"
				to="/signup"
				{size}>Sign up</Icon
			>
		{/if}
	</ul>
</aside>

<style lang="scss">
	#menu {
		background-color: var(--color-5);
		border-top: 3px solid var(--color-3);
		height: 100vh;
		z-index: 1;
		margin-top: 0px;
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
