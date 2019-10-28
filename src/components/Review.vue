<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Question</th>
                    <th scope="col">Point total</th>
                    <th scope="col">Point gagner</th>
                </tr>
            </thead>
            <tbody>
                <tr v-bind:key="question.id" v-for="(question, index) in q">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ question.question }}</td>
                    <td>{{ question.responses | earnablePoint }}</td>
                    <td>{{ question.points }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th scope="row">Total</th>
                    <th></th>
                    <th></th>
                    <th>{{ total }}</th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script>
    export default {
        name: 'Review',
        props: ['q'],
        computed: {
            /**
             * return the total points earned by the user
             * @returns Int
             */
            total: function () {
                return this.q.reduce((points, question) => points += question.responses.reduce((points, response) => points += response.checked ? response.points : 0, 0), 0)
            }
        },
        filters: {
            /**
             * return the total of point you can earn on the question
             * @param responses Array
             * @returns Int
             */
            earnablePoint: function (responses) {
                return responses.reduce((points, response) => points += response.points > 0 ? response.points : 0, 0)
            }
        }
    }
</script>

<style>

</style>