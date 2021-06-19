<script>
	import { Router, Link, Route } from 'svelte-routing';
	import Notification from './components/Notification.svelte';
	import Dashboard from './pages/User/Dashboard.svelte';
	import Login from './pages/User/Login.svelte';
	import Renderer from './components/Renderer.svelte';
	import Logout from './pages/User/Logout.svelte';
	import Error from './pages/User/Error.svelte';
	import Signup from './pages/User/Signup.svelte';
	import VerifyEmail from './pages/User/VerifyEmail.svelte';
	import InternalServerError from './pages/User/InternalServerError.svelte';
	import browser from './stores/browser';

	const routes = {
		'/login': {
			name: 'Login',
			comp: Login
		},
		'/signup': {
			name: 'Signup',
			comp: Signup
		},
		'/': {
			name: 'Welcome',
			comp: Dashboard
		},
		'/dashboard': {
			name: 'Home',
			comp: Dashboard
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
		'/signup/verify/email': {
			name: 'Verify',
			comp: VerifyEmail
		}
	};

	export let url = '';
</script>

<svelte:window
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
