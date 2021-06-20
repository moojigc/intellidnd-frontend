<script lang='ts'>
    import { Link, navigate } from 'svelte-routing';
    import Button from '../../components/Button.svelte';
    import Form from '../../components/Form.svelte';
    import Flex from '../../components/Flex.svelte';
    import { user } from '../../stores/user';

    const fields = [
        {
            label: 'Email',
            name: 'email',
            type: 'text' as const,
            required: true,
            validate: (v) => ({
                ok: /^\S+@\S+$/.test(v),
                message: 'Please enter a valid email address.'
            }),
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

        user.login(values.email, values.password)
            .then(() => {

                user.set({ fetching: false });
                navigate('/dashboard');
            })
            .catch(e => {

                if (e.response?.status === 401) {

                    fields.forEach((f, i) => {

                        f.errorMessage = `That wasn't right! Try again?`;
                        fields[i] = f;
                    });
                }
            });
    }

</script>

<main>
    <Form 
        fields={fields}
        {handleSubmit}
    >
        <Flex margin='1rem' direction='column'>
            <Button type='submit'>Continue</Button>
        </Flex>
    </Form>
    <small>
        Don't have an account yet? <Link to='/signup'>Sign up here!</Link>
    </small>
</main>

<style>
    main {
        max-width: 550px;
    }
</style>