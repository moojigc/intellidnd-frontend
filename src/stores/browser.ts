import { writable } from 'svelte/store';

export default writable({
    width: window.innerWidth,
    height: window.innerHeight
});