<script lang='ts'>
    import Form from "../../components/Form.svelte";

    const fields: Form['$$prop_def']['fields'] = [
        {
            label: 'Add phone',
            name: 'phone',
            type: 'phone',
            required: true
        }
    ]
</script>

<main>
    <Form
        {fields}
    ></Form>
</main>