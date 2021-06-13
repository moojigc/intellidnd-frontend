<script>
	import { user } from '../stores/user';
	import menu from '../stores/menu';
	import { Link } from 'svelte-routing';
	import Text from './Text.svelte';

	const handleOpen = (e) => {
		console.log(e.target);
		menu.set(!$menu);
	};

	export let title = '';
</script>

<div>
	<nav>
		<ul>
            <li>
                <i
                    aria-haspopup="menu"
                    id="menu-trigger"
                    class="material-icons"
                    on:click={handleOpen}>menu</i
                >
            </li>
			<li>
				<Link
					to="/"
					style="display: flex; align-items: center; padding: 0;"
				>
					<img src="../assets/images/primary-icon.png" alt="logo" />
				</Link>
			</li>
			<li>
				<Link
					style="flex-grow: {$user.id ? '20%' : '0.5'}"
					to={title ? window.location.pathname : '/'}
				>
					<Text type="span" variant="t4">{title || 'Home'}</Text>
				</Link>
			</li>
		</ul>
	</nav>
</div>

<style lang="scss">
	#menu-trigger {
		font-size: 2.5rem;
		cursor: pointer;
	}
	nav {
		img {
			width: 2rem;
			height: auto;
		}
		background-color: var(--color-5);
		color: var(--color-text);
		font-weight: 500;
		font-size: larger;
		ul {
			a {
				font-size: 2rem;
			}
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 1rem;
		}
	}
</style>
