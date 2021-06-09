<script lang="ts">
    export let direction: 'row' | 'column' = 'column';
    export let alignX: 'flex-start' | 'flex-end' | 'center' = 'center';
    export let alignY: 'flex-start' | 'flex-end' | 'center' = 'center';
    export let margin: string = '0';
    
    const alignItems = direction === 'row'
        ? alignX
        : alignY;

    const justifyContent = direction === 'row'
        ? alignY
        : alignX;
</script>

<div style='display: flex; flex-direction: row; align-items: {alignItems}; justify-content: {justifyContent}; margin: {margin}'>
    <slot />
</div>