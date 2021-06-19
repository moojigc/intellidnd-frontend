<script lang="ts">
	export let type: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'small' = 'p';
    export let variant: 't1' | 't2' | 't3' | 't4' | 't5' | 't6' = 't5';
	export let bold = false;
	export let style: svelte.JSX.HTMLAttributes<any>['style'] = ''; 

	$: className = variant + (bold ? ' bold' : '');
</script>

{#if type === 'span'}
	<span {style} class={className}>
		<slot />
	</span>
{:else if type === 'h1'}
	<h1 {style} class={className}>
		<slot />
	</h1>
{:else if type === 'h2'}
	<h2 {style} class={className}>
		<slot />
	</h2>
{:else if type === 'h3'}
	<h3 {style} class={className}>
		<slot />
	</h3>
{:else if type === 'h4'}
	<h4 {style} class={className}>
		<slot />
	</h4>
{:else if type === 'h5'}
	<h5 {style} class={className}>
		<slot />
	</h5>
{:else if type === 'p'}
	<p {style} class={className}>
		<slot />
	</p>
{:else if type === 'small'}
	<small {style} class={className}>
		<slot />
	</small>
{/if}

<style>
	.bold {
		font-weight: 900;
	}
    .t1 {
        font-size: 5rem !important;
    }
    .t2 {
        font-size: 3rem !important;
    }
    .t3 {
        font-size: 2rem !important;
    }
	.t4 {
		font-size: 1.5rem !important;
	}
	.t5 {
		font-size: 1rem !important;
	}
	.t6 {
		font-size: 0.75rem !important;
	}
</style>