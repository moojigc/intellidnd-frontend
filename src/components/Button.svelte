<script lang='typescript'>

    const colors = {
        background: {
            light: '--color-2',
            dark: '--color-4'
        },
        text: {
            light: 'black',
            dark: 'white'
        }
    };

    export let color: 'light' | 'dark' = 'light';
    export let type: 'submit' | 'button';
    export let onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> = () => {};
</script>

<button
    style="background-color: var({colors.background[color]}); color: {colors.text[color]};"
    class='large'
    type={type}
    on:click={onClick}
>
    <slot />
</button>