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
	import Recover from './routes/User/Recover.svelte';
	import VerifyCode from './routes/User/VerifyCode.svelte';

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
			comp: Login,
			isPublic: true
		},
		'/signup': {
			displayTitle: 'Sign up!',
			name: 'Signup',
			comp: Signup,
			isPublic: true
		},
		'/logout': {
			name: 'Logout',
			comp: Logout,
			isPublic: true
		},
		'/error': {
			name: 'Error',
			comp: Error,
			isPublic: true
		},
		'/error/server': {
			name: 'Error',
			comp: InternalServerError,
			isPublic: true
		},
		'/verify/email': {
			name: 'Verify',
			comp: VerifyEmail,
			isPublic: false
		},
		'/oauth/discord': {
			name: 'Discord Login',
			comp: DiscordOAuth,
			isPublic: true
		},
		'/recover': {
			name: 'Recover',
			displayTitle: 'Account Recovery',
			comp: Recover,
			isPublic: true
		},
		'/verify': {
			name: 'Verify',
			displayTitle: 'Enter code',
			comp: VerifyCode,
			isPublic: false
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
				isPublic={props.isPublic}
			/>
		</Route>
	{/each}
</Router>
