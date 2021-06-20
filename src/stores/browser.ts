import { writable } from 'svelte/store';

export default writable({
    mode: window.matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light',
    width: window.innerWidth,
    height: window.innerHeight
});