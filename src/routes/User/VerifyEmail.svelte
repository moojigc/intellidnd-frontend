<script lang="ts">
	import { onMount } from 'svelte';
	import { navigate } from 'svelte-routing';

	import user from '../../stores/user';

	onMount(() => {

		const token = new URLSearchParams(window.location.search).get('token');

		user.validateEmail(token).then(() => {

			navigate('/dashboard');
		});
	});
</script>

