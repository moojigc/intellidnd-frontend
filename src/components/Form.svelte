<script lang="ts">
    import { onMount } from 'svelte';
    import format from '../utils/format';
    type InputEvent = Event & {
        currentTarget: EventTarget & HTMLInputElement;
    };
	interface Field {
		name: string;
		label: string;
		type?: 'text' | 'number' | 'positive_number' | 'date' | 'password' | 'email' | 'phone' | 'code';
        max?: number;
		validate?: (e: string, values: any) => { ok: boolean; message?: string; };
        errorMessage?: string;
        defaultValue?: string;
        required?: boolean;
	}

    export let maxWidth: string | number = 500;
    export let onInput: (event: InputEvent, values: Record<string, any>) => void = null;
	export let fields: Field[];
	export let handleSubmit: (values: any) => void | Promise<void>;
    
    let submittable = true;
	const values: Record<string, any> = {};
    $: values;
    
    const _handleSubmit = (_) => {

        fields.forEach((f, i) => {

            f.errorMessage = null;
            fields[i] = f;

            if (f.validate && values[f.name]) {

                const { ok, message } = f.validate(values[f.name], values);

                if (!ok) {

                    f.errorMessage = message;
                    fields[i] = f;
                }
            }

            if (!values[f.name] && f.required) {

                f.errorMessage = 'required';
                fields[i] = f;
            }

            if (f.type) {

                switch (f.type) {
                    case 'number':
                        values[f.name] = Number(values[f.name]);
                        break;
                    case 'positive_number':
                        values[f.name] = Number(values[f.name]);

                        if (values[f.name] < 0) {

                            f.errorMessage = 'Cannot be below 0';
                        }
                        break;
                    default: 
                        break;
                }
            }
        });

        submittable = fields.filter(f => (f.required && !values[f.name]) || f.errorMessage).length === 0;

        if (submittable) {

            handleSubmit(values);
        }
    }
	const handleInput = (
		e: InputEvent,
		field: Field
	) => {
		const target = e.target as EventTarget & {
			value: string;
			name: string;
		};

        let value: any = target.value;

        if (field.max && target.value.length > field.max) {
            value = target.value = target.value.substring(0, field.max);
        }

        // @ts-ignore
        if (e.which === 8) {

            values[target.name] = target.value;
            return;
        }

        if (field.type) {

            switch (field.type) {
                case 'positive_number':
                case 'number':
                    value = Number(value.replace(/,/g, ''));
                    if (isNaN(value)) { return; }
                    target.value = value.toLocaleString();
                    break;
                case 'phone':
                    target.value = format.phone(value);
                    break;
                default: 
                    break;
            }
        }

        values[target.name] = value;

        if (onInput) {

            onInput(e, values);
        }
	};

    const handleValidate = (field: Field) => {
        
        if (field.validate && values[field.name]) {
            
            let ok = false;
            let errorMsg = null;
            
            const ret = field.validate(values[field.name], values);
            console.log(values[field.name])

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
        
        if (field.required && !values[field.name]) {

            submittable = false;
            field.errorMessage = 'required';
        }
    }

    const handleClearErrorMessage = (field: Field) => {

        field.errorMessage = null;
        fields[fields.indexOf(field)] = field;
    }

    const getType = (t: Field['type']) => {
        switch (t) {
            case 'number':
            case 'positive_number':
            case 'phone':
                return 'text';
            case 'code':
                return 'number';
            default:
                return t;
        }
    };

    onMount(() => {

        fields.forEach(f => {
            
            values[f.name] = f.defaultValue ?? '';
            const formatted = /number|integer/.test(f.type)
                ? (Number(values[f.name])
                    ? Number(values[f.name]).toLocaleString()
                    : '')
                : values[f.name]; 

            if (formatted) {
                document.getElementById('user-' + f.name).setAttribute('value', formatted);
            }
            document.getElementById('user-' + f.name).setAttribute('type', getType(f.type));
        });
    })
</script>

<form on:submit|preventDefault={_handleSubmit} style='max-width: {maxWidth ?? 'initial'};'>
    {#each fields as field}
        <div class='row'>
            <label for={field.name}>{field.label}</label>
            <input
                id={'user-' + field.name}
                type={getType(field.type)}
                min={field.type === 'positive_number' ? 0 : null}
                maxlength={field.max}
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

<style lang="scss">
    form {
        margin: 1rem auto 0;
    }
    .form-error {
        color: var(--color-red);
        font-size: 0.9em;
        font-weight: 400;
    }
</style>