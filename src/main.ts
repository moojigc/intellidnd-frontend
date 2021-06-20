import App from './App.svelte';

if ('serviceWorker' in navigator) {
	if (!window.location.origin.match(/localhost/)) {
		window.navigator.serviceWorker.register('serviceWorker.js');
	}
}
const app = new App({
	target: document.body,
	hydrate: true
});

export default app;