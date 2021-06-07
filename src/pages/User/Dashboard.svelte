<script>
    import { onMount } from "svelte";
    import Form from "../../components/Form.svelte";
    import user from "../../stores/user";

    onMount(async () => {

        await user.getProfile();
        await user.getCharacters();
    });
</script>

<main>
    <h1>
        Welcome, {$user.name}.
    </h1>
    {#each Object.values($user.characters || {}) as character}
        <div>
            <h2>{character.name}</h2>
            <Form
                fields={['copper', 'silver', 'gold', 'electrum', 'platinum'].map(c => ({
                    name: c,
                    label: c[0].toUpperCase() + c.substring(1),
                    defaultValue: character.inventory.wallet[c].toString(),
                    type: 'positive_number'
                }))} 
            />
        </div>
    {/each}
</main>