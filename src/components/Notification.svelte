<script lang="ts">
	import user from '../stores/user';

	$: type = $user.notification?.split('|')[0];
	$: message = $user.notification?.split('|')[1];

	const onClick = () => {
		user.set({ notification: null });
	};
</script>

<div id="notif-wrapper" hidden={!$user.notification} on:click={onClick}>
	<div id="notification" on:click={onClick} class={type || 'error'}>
		{message || ''}
	</div>
</div>

<style lang="scss">
	#notif-wrapper {
		position: absolute;
		bottom: 1vh;
		z-index: 5;
		width: 100%;
		padding: 0 0.5rem;

	}
	#notification {
		margin: 0 auto;
		padding: 1em;
		color: white;
		font-size: 1em;
		font-weight: 500;
		border-radius: 3px;
		cursor: pointer;
		color: black;
		min-width: min-content;
		max-width: max-content;
		text-align: center;
	}
	.error {
		background-color: red;
	}
	.success {
		background-color: rgba(0, 255, 21, 0.815);
	}
	.warning {
		background-color: yellow;
	}
</style>
