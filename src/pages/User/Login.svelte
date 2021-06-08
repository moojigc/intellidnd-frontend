<script lang='ts'>
    import { navigate } from 'svelte-routing';
    import Button from '../../components/Button.svelte';
    import Form from '../../components/Form.svelte';
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
        <Button type='submit'>Login</Button>
    </Form>
</main>