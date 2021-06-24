<script lang='ts'>
    import { Link, navigate } from 'svelte-routing';
    import Button from '../../components/Button.svelte';
    import Form from '../../components/Form.svelte';
    import Flex from '../../components/Flex.svelte';
    import { user } from '../../stores/user';

    const fields: Form['$$prop_def']['fields'] = [
        {
            label: 'Verification code',
            name: 'code',
            type: 'text',
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
        <Flex margin='1rem' column>
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