<script lang='ts'>
    import { Link, navigate } from 'svelte-routing';
    import Button from '../../components/Button.svelte';
    import Form from '../../components/Form.svelte';
    import Flex from '../../components/Flex.svelte';
    import { user } from '../../stores/user';

    const fields = [
        {
            label: 'Username, email, or phone #',
            name: 'identifier',
            type: 'text' as const,
            required: true,
            defaultValue: $user.email
        }
    ];

    $: fields;

    async function handleSubmit(values: { identifier: string; }) {
        
        await user.recover(values.identifier);
        navigate('/recover/verify');
        user.notify(`If your account exists, we'll send you a text message or email with a recovery code.`, 'success');
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
</main>

<style>
    main {
        max-width: 550px;
    }
</style>