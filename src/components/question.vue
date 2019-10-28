<template>
    <div class="d-flex justify-content-center">
        <form class="text-center">
            <h5>{{ q.question }}</h5>
            <div v-bind:key="response | id" v-for="response in q.responses" class="form-check d-flex flex-column p-0">
                <input v-on:change="changeHandler" v-model="response.checked" class="form-check-input" type="checkbox" v-bind:id="response | id">
                <label class="form-check-label text-center mb-2" v-bind:for="response | id">
                    {{ response.response }}
                </label>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: 'question',
        props: ['q'],
        filters: {
            /**
             * generate a unique key for each response ( not sure if its needed, but it works )
             * @param res Object
             * @returns String ( unique key )
             */
            id: function(res) {
                return btoa(res.response.replace(/\s/g, ''))
            }
        },
        // handle v-model
        model: {
            prop: 'q', // Object : question
            event: 'modified'
        },
        methods: {
            changeHandler() {
                this.$emit('modified', this.q)
            }
        }
    }
</script>

<style>
    input[type=checkbox] {
        display: none;
    }
    input[type=checkbox] + label {
        cursor: pointer;
        border: 1px solid #4287f5;
        border-radius: 5px;
        padding: 5px 10px;
        transition: .2s all ease;
    }
    input[type=checkbox]:checked + label {
        border-color: #4287f5;
        background-color: #4287f5;
        color: #fff;
    }
</style>