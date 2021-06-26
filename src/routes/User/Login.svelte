<script lang='ts'>
    import { Link, navigate } from 'svelte-routing';
    import Button from '../../components/Button.svelte';
    import Form from '../../components/Form.svelte';
    import Flex from '../../components/Flex.svelte';
    import { user } from '../../stores/user';

    const REDIRECT = /localhost/.test(window.origin)
        ? 'http://localhost:5000'
        : 'https://new.intellidnd.com';
    const DISCORD_LOGIN =
        `https://discord.com/api/oauth2/authorize?client_id=825446130484510780&redirect_uri=${encodeURIComponent(REDIRECT)}%2Foauth%2Fdiscord&response_type=code&scope=identify%20email`;
    const DISCORD_W_GUILDS = DISCORD_LOGIN + '%20guilds';
    const fields = [
        {
            label: 'Username, email, or phone #',
            name: 'identifier',
            type: 'text' as const,
            required: true,
            defaultValue: $user.email
        },
        {
            label: 'Password',
            name: 'password',
            type: 'password' as const,
            errorMessage: null,
            required: true
        }
    ];

    $: fields;

    async function handleSubmit(values) {

        user.login(values.identifier, values.password)
            .then(() => {

                user.set({ fetching: false });
                navigate('/dashboard');
            })
            .catch(e => {

                switch (e.response.status) {
                    case 401:
                        user.notify('Please double-check login credentials!', 'error');
                        break;
                    case 429:
                        break;
                    default:
                        user.notify('Login failed.', 'error');
                }
            });
    }

</script>

<main>
    <Form 
        fields={fields}
        {handleSubmit}
    >
        <Flex margin='1rem' column>
            <Button type='submit'>Continue</Button>
        </Flex>
    </Form>
    <Flex column alignX='flex-start'>
        <small>
            <Link to='/recover?type=password'>Forgot password?</Link>
        </small>
        <small>
            Don't have an account yet? <Link to='/signup'>Sign up here!</Link>
        </small>
        <small>
            Or sign in with Discord instead:
            <div>
                <a href={DISCORD_W_GUILDS} referrer-policy='no-referrer'>
                    Grant permissions to see what servers you're in
                </a>
            </div>
            <div>
                <a href={DISCORD_LOGIN} referrer-policy='no-referrer'>
                    Grant email and id only
                </a>
            </div>
        </small>
    </Flex>
</main>

<style>
    main {
        max-width: 550px;
    }
    small {
        margin-bottom: 1em;
    }
</style>