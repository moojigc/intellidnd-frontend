<script lang="ts">
	import Text from './Text.svelte';
	import Clicker from './Clicker.svelte';

	export let icon: string;
	export let size: 'tiny' | 'small' | 'medium' | 'large' = 'medium';
	export let hideText = false;
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
	<Clicker onClick={handleClick || to}>
		<div style="height: {dimensions[size]}; width: {dimensions[size]} ">
			<i
				class="material-icons"
				style="font-size: {fontSize[size]}; {color
					? 'color: ' + color
					: ''};">{icon}</i
			>
		</div>
		{#if !hideText && $$slots.default}
			<Text bold variant="t4" style='margin-left: 1rem'>
				<slot />
			</Text>
		{/if}
	</Clicker>
</li>

<style lang="scss">
	li {
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
