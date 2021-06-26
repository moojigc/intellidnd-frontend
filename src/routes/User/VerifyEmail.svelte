<script lang="ts">
	import { onMount } from 'svelte';
	import { navigate } from 'svelte-routing';

	import user from '../../stores/user';

	onMount(() => {

		const params = new URLSearchParams(window.location.search);
		const [token, email] = [params.get('token'), params.get('email')];

		user.verifyEmail(email, token).then(() => {

			navigate('/');
		});
	});
</script>

