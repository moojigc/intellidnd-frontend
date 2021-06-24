<script>
	import { Router, Link, Route } from 'svelte-routing';
	import Notification from './components/Notification.svelte';
	import Dashboard from './routes/User/Dashboard.svelte';
	import Login from './routes/User/Login.svelte';
	import Renderer from './components/Renderer.svelte';
	import Logout from './routes/User/Logout.svelte';
	import Error from './routes/User/Error.svelte';
	import Signup from './routes/User/Signup.svelte';
	import VerifyEmail from './routes/User/VerifyEmail.svelte';
	import InternalServerError from './routes/User/InternalServerError.svelte';
	import browser from './stores/browser';
	import user from './stores/user';
import DiscordOAuth from './routes/User/DiscordOAuth.svelte';

	document.documentElement.className = $user.mode;

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		document.documentElement.className = $user.mode;
	});

	const routes = {
		'/': {
			name: 'Welcome',
			displayTitle: 'Welcome!',
			comp: Dashboard
		},
		'/login': {
			displayTitle: 'Login!',
			name: 'Login',
			comp: Login
		},
		'/signup': {
			displayTitle: 'Sign up!',
			name: 'Signup',
			comp: Signup
		},
		'/logout': {
			name: 'Logout',
			comp: Logout
		},
		'/error': {
			name: 'Error',
			comp: Error
		},
		'/error/server': {
			name: 'Error',
			comp: InternalServerError
		},
		'/verify/email': {
			name: 'Verify',
			comp: VerifyEmail
		},
		'/oauth/discord': {
			name: 'Discord Login',
			comp: DiscordOAuth
		}
	};

	export let url = '';
</script>

<svelte:window
	on:pre
	on:resize={() => {
		browser.set({
			width: window.innerWidth,
			height: window.innerHeight
		});
	}}
/>

<Notification />
<Router {url}>
	{#each Object.entries(routes) as [route, props]}
		<Route path={route}>
			<Renderer
				displayTitle={props.displayTitle}
				comp={props.comp}
				title={props.name}
			/>
		</Route>
	{/each}
</Router>
