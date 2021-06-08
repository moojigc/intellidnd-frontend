<script lang='ts'>
    export let message = 'Unknown server error.';
    export let hidden = true;

    function onClick() {

        hidden = true;
    }
</script>

<style lang='scss'>
    #error-box {
        position: absolute;
        background: red;
        padding: 1em;
        left: calc(50% - 3em);
        top: 1vh;
        color: white;
        font-size: 1em;
        font-weight: 500;
        border-radius: 5%;
        cursor: pointer;
    }
</style>

<div hidden={hidden} on:click={onClick} id='error-box'>{message}</div>