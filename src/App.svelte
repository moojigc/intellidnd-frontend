<script>
	import { Router, Link, Route } from 'svelte-routing';
    import ErrorBox from './components/ErrorBox.svelte';
	import Nav from './components/Nav.svelte';
    import Dashboard from './pages/User/Dashboard.svelte';
    import Login from './pages/User/Login.svelte';
    import Renderer from './components/Renderer.svelte';
    import Logout from './pages/Logout.svelte';

    const routes = {
        '/login': {
            name: 'Login',
            comp: Login
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
        }
    };

	export let url = '';
</script>
<ErrorBox/>
<Router {url}>
	<Nav />
	<div>
        {#each Object.entries(routes) as [route, props]}
            <Route path={route}>
                <Renderer comp={props.comp} title={props.name} />
            </Route>
        {/each}
	</div>
</Router>
