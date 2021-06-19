<script lang="ts">
	import { Link } from 'svelte-routing';
	import browser from '../stores/browser';
	import menu from '../stores/menu';

	export let style = '';
	export let onClick: ((e) => any) | string = () => {};

	const handleClick = (e) => {
		if ($browser.width <= 800) {
			menu.set(false);
		}
		if (typeof onClick === 'function') {
			onClick(e);
		}
	};

	const templateStyle = `
        background-color: unset;
		border: unset;
		padding: 0;
		width: 100%;
		display: flex;
		align-items: center;
		color: var(--color-text);
    `;
</script>

{#if typeof onClick === 'function'}
	<button
		on:click={handleClick}
		class="menu-action"
		style={templateStyle + style}
	>
		<slot />
	</button>
{:else}
	<Link
		class="menu-action"
		to={onClick}
		on:click={handleClick}
		style={templateStyle + style}
	>
		<slot />
	</Link>
{/if}
