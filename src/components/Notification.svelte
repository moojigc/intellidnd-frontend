<script lang="ts">
	import user from '../stores/user';

	let type: string;
	let message: string;

	if ($user.notification) {

		const [t, dismiss, m] = $user.notification.split('|');

		console.log(t, dismiss, m)

		type = t;
		message = m;

		if (dismiss === 'true') {

			setTimeout(() => {
	
				user.set({ notification: null });
			}, 5000);
		}
	}

	const onClick = () => {
		user.set({ notification: null });
	};
</script>

<div
	hidden={!$user.notification}
	on:click={onClick}
	id="notification"
	class={type || 'error'}
>
	{message || ''}
</div>

<style lang="scss">
	#notification {
		position: absolute;
		padding: 1em;
		left: calc(50% - 3em);
		top: 1vh;
		color: white;
		font-size: 1em;
		font-weight: 500;
		border-radius: 5%;
		cursor: pointer;
	}
	.error {
		background-color: red;
	}
	.success {
		background-color: greenyellow;
	}
	.warning {
		background-color: yellow;
	}
</style>
