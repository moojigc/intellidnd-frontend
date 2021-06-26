<script lang="ts">
	import { Link, navigate } from 'svelte-routing';
	import Button from '../../components/Button.svelte';
	import Form from '../../components/Form.svelte';
	import Flex from '../../components/Flex.svelte';
	import { user } from '../../stores/user';

	const params = new URLSearchParams(window.location.search);
	const [phone, email, code] = [
		params.get('phone'),
		params.get('email'),
		params.get('code')
	];

	const phoneForm: Form['$$prop_def']['fields'] = [
		{
			label: 'SMS code',
			name: 'code',
			type: 'code',
            max: 6,
			required: true,
		}
	];
	const emailForm: Form['$$prop_def']['fields'] = [
		{
			label: 'Email code',
			name: 'code',
			type: 'code',
            max: 6,
			required: true,
		}
	];

	$: emailForm;
	$: phoneForm;

	async function handlePhoneSubmit(values) {
		await user.verifyPhone(phone, values.code);
        user.notify('Phone number ' + phone.substring(6) + ' verified.', 'success');
        navigate('/');
	}
	async function handleEmailSubmit(values) {
		await user.verifyEmail(email, values.email);
        user.notify('Email address ' + email + ' verified.', 'success');
		navigate('/');
	}

	if (code && email) {
		handleEmailSubmit({ code });
	}

    async function handleResend() {
        if (phone) {}
    }
</script>

<main>
	{#if phone}
		<Form fields={phoneForm} handleSubmit={handlePhoneSubmit}>
			<Flex margin="1rem" column>
				<Button type="submit">Submit</Button>
			</Flex>
		</Form>
	{/if}
	{#if email}
		<Form fields={emailForm} handleSubmit={handleEmailSubmit}>
			<Flex margin="1rem" column>
				<Button type="submit">Submit</Button>
			</Flex>
		</Form>
	{/if}
	<small>
		<a href='void' onclick={handleResend}>Resend code!</a>
	</small>
</main>

<style>
	main {
		max-width: 550px;
	}
</style>
