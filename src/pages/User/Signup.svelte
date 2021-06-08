<script lang='ts'>
    import { navigate } from 'svelte-routing';
    import Button from '../../components/Button.svelte';
    import Form from '../../components/Form.svelte';
    import { user } from '../../stores/user';

    const fields: Form['$$prop_def']['fields'] = [
        {
            label: 'Email',
            name: 'email',
            type: 'text' as const,
            required: true,
            validate: (v) => ({
                ok: /^\S+@\S+$/.test(v as string),
                message: 'Please enter a valid email address.'
            }),
        },
        {
            label: 'Password',
            name: 'password',
            type: 'password' as const,
            errorMessage: null,
            validate: (v: string) => ({
                ok: v.length >= 8 && /\d/.test(v),
                message: 'Password must be at least 8 characters with 1 number.'
            }),
            required: true
        },
        {
            label: 'Verify Password',
            name: 'verify',
            type: 'password' as const,
            errorMessage: null,
            validate: (v, values) => ({
                ok: v === values.password,
                message: 'Passwords must match.'
            }),
            required: true
        }
    ];

    $: fields;

    async function handleSubmit(values) {

        user.signup(values)
            .then(() => {

                navigate('/login');
            })
            .catch(e => {

                if (e.response?.status === 403) {

                    fields[0].errorMessage = 'That email\'s taken!';
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