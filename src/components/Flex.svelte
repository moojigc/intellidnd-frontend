<script lang="ts">
    export let column = false;
    export let alignX: 'flex-start' | 'flex-end' | 'center' = 'center';
    export let alignY: 'flex-start' | 'flex-end' | 'center' = 'center';
    export let margin: string = '0';
    
    const alignItems = column
        ? alignX
        : alignY;

    const justifyContent = column
        ? alignY
        : alignX;
</script>

<div style='display: flex; flex-direction: {column ? 'column' : 'row'}; align-items: {alignItems}; justify-content: {justifyContent}; margin: {margin}'>
    <slot />
</div>