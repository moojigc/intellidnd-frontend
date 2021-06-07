<script lang="ts">
import { onMount } from "svelte";
import App from "../App.svelte";



	interface Field {
		name: string;
		label: string;
		type?: 'text' | 'number' | 'positive_number' | 'date' | 'password' | 'email';
		validate?: (e: string) => { ok: boolean; message?: string; };
        errorMessage?: string;
        defaultValue?: string;
        required?: boolean;
	}

	export let fields: Field[];
	export let handleSubmit: (values: Record<string, string>) => void;
    
    let submittable = true;
	const values: Record<string, string> = {};
    $: values;
    $: submittable = fields.filter(f => f.required && !values[f.name]).length === 0;
    
    const _handleSubmit = (_) => {

        fields.forEach((f, i) => {

            if (!values[f.name] && f.required) {

                submittable = false;
                f.errorMessage = 'required';
                fields[i] = f;
            }
        });

        if (submittable) {

            handleSubmit(values);
        }
    }
	const handleInput = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		},
		field: Field
	) => {
		const target = e.target as EventTarget & {
			value: string;
			name: string;
		};
        const { type, validate } = field;

        let value: any = target.value;

        if (type) {

            switch (type) {
                case 'number':
                    value = Number(value);
                    break;
                default: 
                    break;
            }
        }

        values[target.name] = target.value;
	};

    const handleValidate = (field: Field) => {

        if (field.validate) {

            let ok = false;
            let errorMsg = null;

            const ret = field.validate(values[field.name]);

            ok = ret.ok;
            errorMsg = ret.message;

            if (!ok) {

                submittable = false;
                field.errorMessage = errorMsg;
            }
            else {

                field.errorMessage = null;
            }

            fields[fields.indexOf(field)] = field;
        }
    }

    const handleClearErrorMessage = (field: Field) => {

        field.errorMessage = null;
        fields[fields.indexOf(field)] = field;
    }

    onMount(() => {

        fields.forEach(f => {
            
            values[f.name] = f.defaultValue || '';
            document.getElementById('user-' + f.name).setAttribute('value', f.defaultValue || '');
        });
    })
</script>

<style lang="scss">
    form {
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    }
    .form-error {
        color: rgb(255, 104, 104);
        font-size: 0.75em;
    }
</style>

<form class='form' on:submit|preventDefault={_handleSubmit}>
	{#each fields as field}
        <div class='row'>
            <label for={field.name}>{field.label}</label>
            <input
                id={'user-' + field.name}
                type={field.type === 'positive_number' ? 'number' : field.type}
                min={field.type === 'positive_number' ? 0 : null}
                name={field.name}
                on:focus={() => handleClearErrorMessage(field)}
                on:keydown={() => handleClearErrorMessage(field)}
                on:blur={() => handleValidate(field)}
                on:input={(e) => handleInput(e, field)}
            />
            {#if field.errorMessage}
                <div class='form-error'>{field.errorMessage}</div>
            {/if}
        </div>
	{/each}
	<slot />
</form>
