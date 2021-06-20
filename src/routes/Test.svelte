<script lang="ts">
	import Button from '../components/Button.svelte';
	export let theme: 'light' | 'dark' | null = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

	const setTheme = (t: typeof theme) => theme = t;

	let name = 'Moojig'; 
	function setName(e: Event & {
		currentTarget: EventTarget & HTMLInputElement;
	}) {

		e.preventDefault();

		// @ts-ignore
		name = e.target.value;
	}
</script>

<div id='root' class={theme}>
	<main>
		<h1>Hello {name}!</h1>
		{#if (name.toLowerCase() === 'there')}
		<h2>GENERAL KENOBI!</h2>
		{/if}
		
		<Button onClick={() => setTheme('light')}>
			Set light theme
		</Button>
		<Button color='dark' onClick={() => setTheme('dark')}>
			Set dark theme
		</Button>
		<form action="">
			<input type="text" value={name} on:input={setName}>
		</form>
	</main>
</div>

<style lang="scss">
	#root {
		height: 100vh;
	}

	main {
		* {
			margin: 1rem 0;
		}
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1, h2 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
	h2 {
		font-size: 3em;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
