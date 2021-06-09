<script>
    import { user } from '../stores/user';
    import { Link } from "svelte-routing";

    export let title = '';
</script>

<div>
    <nav>
        <Link to='/'>
            <img src="../assets/images/primary-icon.png" alt="logo">
        </Link>
        <Link style='flex-grow: {$user.id ? '20%' : '0.5'}' to={title ? window.location.pathname : '/'}>
            {title || 'Home'}
        </Link> 
        {#if $user.id}
            <Link style='flex-grow: 0' to='/logout'>Logout</Link> 
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