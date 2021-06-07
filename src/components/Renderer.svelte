<script lang="ts">

    export let title: string;
    export let comp: any;

    if (title) {

        document.title = title + ' | IntelliDnD';
    }
</script>

<svelte:component this={comp} />