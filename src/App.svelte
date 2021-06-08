<script>
	import { Router, Link, Route } from 'svelte-routing';
	import ErrorBox from './components/ErrorBox.svelte';
	import Nav from './components/Nav.svelte';
	import Dashboard from './pages/User/Dashboard.svelte';
	import Login from './pages/User/Login.svelte';
	import Renderer from './components/Renderer.svelte';
	import Logout from './pages/Logout.svelte';
	import Error from './pages/User/Error.svelte';
	import Signup from './pages/User/Signup.svelte';

	const routes = {
		'/login': {
			displayTitle: 'Login',
			name: 'Login',
			comp: Login
		},
		'/signup': {
			displayTitle: 'Sign up with IntelliDnD',
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
		}
	};

	export let url = '';
</script>

<ErrorBox />
<Router {url}>
	<Nav />
	{#each Object.entries(routes) as [route, props]}
		<Route path={route}>
			<Renderer displayTitle={props.displayTitle} comp={props.comp} title={props.name} />
		</Route>
	{/each}
</Router>
