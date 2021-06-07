<script lang="ts">
	import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
	import user from '../stores/user';

	onMount(async () => {
		await user.logout();
        navigate('/login');
	});
</script>

<main>
    <h2>Logging you out...</h2>
</main>