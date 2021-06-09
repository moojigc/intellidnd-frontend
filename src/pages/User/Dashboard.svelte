<script lang="ts">
	import type { Character, Coins, Wallet } from '../../types';
	import { onMount } from 'svelte';
	import Button from '../../components/Button.svelte';
	import Form from '../../components/Form.svelte';
	import user from '../../stores/user';

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
		await user.getProfile();
		await user.getCharacters();
	});
</script>

<main>
	{#if $user.token}
		<h1>
			Welcome, {$user.name}.
		</h1>
		{#each Object.values($user.characters || {}) as character}
			<div class='character'>
				<h2>{character.name}</h2>
				<Form
					handleSubmit={async (values) => {

                        await character.inventory.wallet.update(values);
                    }}
					fields={fields(character)}
				>
					<Button type="submit">Save</Button>
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
	}
</style>