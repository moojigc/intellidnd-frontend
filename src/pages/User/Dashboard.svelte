<script lang="ts">
	import type { Character, Coins, Wallet } from '../../types';
	import { onMount } from 'svelte';
	import Button from '../../components/Button.svelte';
	import Form from '../../components/Form.svelte';
	import user from '../../stores/user';
	import { writable } from 'svelte/store';
	import Flex from '../../components/Flex.svelte';

	const status = writable<{
		wallet: 'changed' | 'saved' | 'loaded'
	}>({
		wallet: 'loaded'
	});

	const fields = (char: Character): Form['$$prop_def']['fields'] =>
		['copper', 'silver', 'gold', 'electrum', 'platinum'].map((coin) => ({
			name: coin,
			label: coin[0].toUpperCase() + coin.substring(1),
			defaultValue: char.inventory.wallet[coin],
			type: 'positive_number',
			validate: (v: number) => {
				let ok = true;
				let message: string;

				if (!Number.isInteger(v)) {
					ok = false;
					message = 'Cannot accept decimals.';
				} else if (!Number.isSafeInteger(v)) {
					ok = false;
					message = `Cannot exceed ${Number.MAX_SAFE_INTEGER.toLocaleString()}`;
				}
				return {
					ok,
					message
				};
			}
		}));

	onMount(async () => {
		await Promise.all(
			[
				user.getProfile(),
				user.getCharacters()
			]
		);
	});

	function handleChangeCharName(e) {

		if (e.which == 13) { e.preventDefault() }
		const name = e.target.innerText;
		console.log(name)
	}

	function handleEnter(e, char: Character) {
		if (e.which == 13) {
			e.preventDefault()
			char.update({ name: e.target.innerText });
			return;
		}
	}
</script>

<main>
	{#if $user.token}
		<h1>Welcome, {$user.name}</h1>
		{#each Object.values($user.characters || {}) as character}
			<div class='character'>
				<h2 contenteditable on:keyup={handleChangeCharName} on:keydown={(e) => handleEnter(e, character)}>{character.name}</h2>
				<Form
					maxWidth='500px'
					onInput={(_, values) => {

						const changed = Object.keys(values).filter(k => {
							return character.inventory.wallet[k] != values[k];
						}).length > 0;

						$status.wallet = (changed ? 'changed' : 'loaded');
					}}
					handleSubmit={async (values) => {

                        await character.inventory.wallet.update(values);
						$status.wallet = 'saved';
                    }}
					fields={fields(character)}
				>
					<Flex>
						<Button type="submit" disabled={$status.wallet !== 'changed'}>
							{$status.wallet === 'saved' ? 'Saved' : 'Save'}
						</Button>
					</Flex>
				</Form>
			</div>
		{/each}
	{:else}
		<h1>Redirecting you...</h1>
	{/if}
</main>

<style lang='scss'>
	.character {
		h2 {
			text-align: center;
		}
		margin-bottom: 2rem;
	}
</style>