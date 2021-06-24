<script lang='ts'>
    import { navigate } from 'svelte-routing';
    import user from '../../stores/user';

    const code = new URLSearchParams(location.search).get('code');

    user.discordLogin(code)
        .then(() => {
            navigate('/');
        })
        .catch((e) => {
            console.error(e);
            user.notify('How did we get here?', 'error', false);            
        });
</script>