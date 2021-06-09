<script>
    import { user } from '../stores/user';
    import { Link } from "svelte-routing";

    export let title = '';
</script>

<div>
    <nav>
        <div>
            <img src="../assets/images/primary-icon.png" alt="logo">
        </div>
        {#if title}
            <Link style='flex-grow: 0.5' to={window.location.pathname}>{title}</Link>
        {:else}
            <Link style='flex-grow: 0.5' to={$user.token ? '/dashboard' : '/'}>Home</Link> 
        {/if}
    </nav>
    <div class="progress bar {$user.fetching ? 'slide-in' : 'slide-out'}">
        <div class="indeterminate"></div>
    </div>
</div>

<style lang='scss'>
    @keyframes slide-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slide-out {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    .bar {
        position: relative;

        margin: 0;
        &.slide-in {
            animation: slide-in 500ms;
        }
        &.slide-out {
            animation: slide-out 250ms;
            opacity: 0;
        }
    }
    nav {
        img {
            width: 2rem;
            height: auto;
        }
        & a:visited {
            color: inherit;
            text-decoration: none;
        } 
        background-color: var(--color-5);
        color: var(--color-text);
        font-weight: 500;
        font-size: larger;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>