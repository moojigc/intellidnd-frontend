<script lang="ts">
    import menu from '../stores/menu';

</script>

<aside id='menu' class={$menu ? 'open' : 'shrunk'}>
    menu
</aside>

<style>
	#menu {
		background-color: var(--color-5);
		border-radius: 3px;
		height: 100vh;
		z-index: 1;
        margin-top: -4px;
	}
    .open {
        width: 16rem;
    }
    .shrunk {
        width: 4rem;
    }

    @media screen and (max-width: 800px) {
        .open {
            position: absolute;
            z-index: 5;
        }
        .shrunk {
            width: 0rem;
            display: none;
        }
    }
</style>
