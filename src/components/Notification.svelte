<script lang="ts">
	import user from '../stores/user';

	$: type = $user.notification?.split('|')[0];
	$: message = $user.notification?.split('|')[1];

	const onClick = () => {
		user.set({ notification: null });
	};
</script>

<div id="notif-wrapper" hidden={!$user.notification}>
	<div id="notification" on:click={onClick} class={type || 'error'}>
		<div style="margin: auto 0;">
			{message || ''}
		</div>
		<button on:click={onClick}>
			Dismiss
		</button>
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
		button {
			background-color: var(--color-5);
			color: white;
			border-color: var(--color-5);
			box-shadow: var(--fancy-box-shadow);
			font-size: 0.75em;
			padding: 0.5em 0.6em;
			margin-left: 0.5em;
		}
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
		display: flex;
		flex-direction: row;
		box-shadow: var(--fancy-box-shadow);
	}
	.error {
		background-color: rgb(168, 0, 0);
		color: white !important;
	}
	.success {
		background-color: var(--color-2);
	}
	.warning {
		background-color: yellow;
	}

	@media screen and (max-width: 800px) {
		#notification {
			button {
				margin-left: 0;
			}
		}
	}
</style>
