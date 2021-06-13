<script lang='typescript'>

    export let disabled = false;
    export let style: svelte.JSX.HTMLProps<any>['style'] = '';
    export let color: 'light' | 'dark' = 'light';
    export let type: 'submit' | 'button' = 'submit';
    export let onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> = () => {};
</script>

<button
    {style}
    {disabled}
    class='large button-{color}'
    type={type}
    on:click={onClick}
>
    <slot />
</button>

<style lang='scss'>
    button:disabled {
        border-color: var(--color-disabled);
        background-color: var(--color-disabled) !important;
    }
    .button-light {
        background-color: var(--color-2);
        color: black;
    }
    .button-dark {
        background-color: var(--color-4);
        color: white;
    }
</style>