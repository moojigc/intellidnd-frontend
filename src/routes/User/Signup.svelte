<script lang='ts'>
    import { navigate, Link } from 'svelte-routing';
    import Button from '../../components/Button.svelte';
    import Flex from '../../components/Flex.svelte';
    import Form from '../../components/Form.svelte';
    import { user } from '../../stores/user';
import format from '../../utils/format';

    const fields: Form['$$prop_def']['fields'] = [
        {
            label: 'Username',
            name: 'username',
            type: 'text',
            required: true,
            validate(v) {
                if (v.length >= 20) {
                    return {
                        ok: false,
                        message: 'Username cannot be greater than 20 characters.'
                    };
                }
                else if (v.split('').filter(l => /\d/.test(l)).length === v.length) {
                    return {
                        ok: false,
                        message: 'Username cannot be all numbers.'
                    };
                }
                else if (/^\S+@\S+$/.test(v)) {
                    return {
                        ok: false,
                        message: 'Username cannot be an email address.'
                    };
                }
                return { ok: true };
            }
        },
        {
            label: 'Email',
            name: 'email',
            type: 'email',
            validate: (v) => ({
                ok: /^\S+@\S+$/.test(v),
                message: 'Please enter a valid email address.'
            }),
        },
        {
            label: 'Phone',
            name: 'phone',
            type: 'phone',
            validate: (v) => ({
                ok: /^\d{10,11}$/.test(v.split('').filter(p => /\d/.test(p)).join('')),
                message: 'Please enter a valid US phone number (I\'m too broke for international support).'
            }),
        },
        {
            label: 'Password',
            name: 'password',
            type: 'password',
            errorMessage: null,
            validate(v, values) {
                if (v.length <= 8 && !/\d/.test(v)) {
                    return {
                        ok: false,
                        message: 'Password must be at least 8 characters with 1 number.'
                    };
                }
                for (const f in values) {
                    if (!['password', 'verify'].includes(f) && values[f] === v) {
                        return {
                            ok: false,
                            message: 'Are you TRYING to get hacked?'
                        };
                    }
                }
                return {
                    ok: true
                };
            }
        },
        {
            label: 'Verify Password',
            name: 'verify',
            type: 'password',
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

        if (!values.email && !values.phone) {

            ;[1,2].forEach(n => fields[n].errorMessage = 'Please enter either an email or a phone number.');
        }
        
        user.signup(values)
            .then(() => {
                const params = new URLSearchParams();
                if (values.email) {
                    params.append('email', values.email);
                }
                if (values.phone) {
                    params.append('phone', values.phone);
                }
                navigate('/verify?' + params.toString());
                user.notify(
                    'Thank you for signing up! A verification code will be sent to you shortly.', 'success', false
                );
            })
            .catch(e => {
                if (e.response?.status === 403) {
                    const taken = e.response.data.message.split(',');
                    fields.forEach((f, i) => {
                        if (taken.includes(f.name)) {
                            f.errorMessage = 'That one\'s taken!'
                            fields[i] = f;
                        }
                    });
                }
            });
    }

</script>

<main>
    <Form 
        maxWidth='500px'
        fields={fields}
        {handleSubmit}
    >
        <Flex margin='1rem' column>
            <Button type='submit'>Continue</Button>
        </Flex>
    </Form>
    <small>
        Have an account already? <Link to='/login'>Login here</Link>
    </small>
</main>

<style>
    main {
        max-width: 550px;
    }
</style>