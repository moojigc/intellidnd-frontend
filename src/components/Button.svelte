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
