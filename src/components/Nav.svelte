<script>
    import { user } from '../stores/user';
    import { Link } from "svelte-routing";
import Button from './Button.svelte';
</script>

<nav>
    <div>
        <img src="../assets/images/primary-icon.png" alt="logo">
    </div>
    <Link to={$user.isLoggedOut ? '/' : '/dashboard'}>Home</Link>
    {#if $user.isLoggedOut}
        <Link to="/login">Login</Link>
    {:else}
        <Link to="/logout">Logout</Link>
    {/if}
</nav>
<div class="progress bar {$user.fetching ? 'slide-in' : 'slide-out'}">
    <div class="indeterminate"></div>
</div>

<style lang='scss'>
    @keyframes slide-in {
        from { height: 0; }
        to { height: 4px; }
    }
    @keyframes slide-out {
        from { height: 4px; }
        to { height: 0px; }
    }
    .bar {
        margin: 0;
        &.slide-in {
            animation: slide-in 500ms;
        }
        &.slide-out {
            animation: slide-out 250ms;
            height: 0px;
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