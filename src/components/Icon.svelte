<script lang="ts">
	import Text from './Text.svelte';
	import Clicker from './Clicker.svelte';

	export let icon: string;
	export let size: 'tiny' | 'small' | 'medium' | 'large' = 'medium';
	export let expanded = false;
	export let color: string = '';
	export let handleClick: (event: any) => void = null;
	export let to = '';

	const fontSize = {
		tiny: '1rem',
		small: '2rem',
		medium: '3rem',
		large: '5rem'
	};
	const dimensions = {
		tiny: '1.5rem',
		small: '3rem',
		medium: '4rem',
		large: '5.5rem'
	};
</script>

<li>
	<Clicker style='flex-direction: {expanded ? 'row' : 'column'};' onClick={handleClick || to}>
		<div style="height: {dimensions[size]}; width: {dimensions[size]} ">
			<i
				class="material-icons"
				style="font-size: {fontSize[size]}; color: {color
					? color
					: 'var(--color-1)'};">{icon}</i
			>
		</div>
		{#if $$slots.default}
			{#if expanded}
				<Text type='span' variant="t4" style='text-align: center; width: 100%; font-weight: 400;'>
					<slot />
				</Text>
			{:else}
				<Text type='span' variant="t6" style='text-align: center; font-weight: 400;'>
					<slot />
				</Text>
			{/if}
		{/if}
	</Clicker>
</li>

<style lang="scss">
	li {
		padding: 0.5rem;
		list-style: none;
		cursor: pointer;
		&:hover {
			background-color: var(--color-4);
		}
		div {
			color: var(--color-text);
			background-color: var(--color-3);
			padding: 0.5rem;
			margin: 0.5rem;
			border-radius: 50%;
			border-color: var(--color-3);
		}
	}
</style>
