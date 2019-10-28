<template>
    <div class="form-group">
        <div class="input-group mb-2">
            <div class="input-group-prepend">
                <div class="input-group-text input-label d-flex justify-content-center">{{ label }}</div>
            </div>
            <input v-on:keyup="changeHandler" v-model="val" type="text" class="form-control" id="inlineFormInputGroup" v-bind:placeholder="label">
        </div>
    </div>
</template>

<script>
    export default {
        name: "bootstrap-input",
        props: ['label', 'value'],
        data: function() {
            return {
                val: ""
            };
        },
        // handle v-model
        model: {
            prop: 'value',
            event: 'modified'
        },
        methods: {
            changeHandler() {
                this.$emit('modified', this.val)
            }
        }
    }
</script>

<style>
    .input-label { width: 100px }
</style>