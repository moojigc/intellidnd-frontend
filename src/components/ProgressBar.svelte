<script>
	import user from '../stores/user';
</script>

<div class="progress bar {$user.fetching ? 'slide-in' : 'slide-out'}">
	<div class="indeterminate" />
</div>

<style lang='scss'>
	@keyframes slide-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes slide-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
    .bar {
		position: relative;
		z-index: 2;

		margin: 0;
		&.slide-in {
			animation: slide-in 500ms;
		}
		&.slide-out {
			animation: slide-out 250ms;
			opacity: 0;
		}
	}
</style>
