<template>
    <div class="container mt-5">
        <div class="jumbotron">
            <h1 class="display-4">{{ title }}</h1>
            <hr class="my-4">
            <div v-if="!finished">
                <question v-bind:key="questionIndex" v-model="questions[questionIndex]" />
                <button class="btn btn-success" v-on:click="next">{{ questionIndex + 1 !== questionsNumber ? 'Question Suivante' : 'fin' }}</button>
            </div>
            <div v-if="finished">
                <review v-if="finished" v-bind:q="questions" />
                <router-link to="/">Retour</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import questions from '../questions.json'
    import Question from '../components/question'
    import Review from '../components/Review'

    export default {
        name: 'Questionnaire',
        components: {
            'question': Question,
            'review': Review
        },
        data() {
            // number of question to ask
            const numberOfQuestions = 10
            // shuffle the `questions` array
            const RandomQuestions = questions.sort(() => Math.random() - 0.5).slice(0, numberOfQuestions)
            return {
                questionIndex: 0,
                questionsNumber: numberOfQuestions,
                // add some information to the object such as the `checked` boolean in the responses or the `points`
                questions: RandomQuestions.map(it =>
                    Object.assign(it, {points: 0, responses: it.responses.map(res => Object.assign(res, {checked: false}))})),

                nom: this.$route.params.nom,
                prenom: this.$route.params.prenom,
                societe: this.$route.params.societe,

                finished: false
            }
        },
        computed: {
            /**
             * return the title of the page determined by the `finished` flag and the `questionIndex` index
             * @returns {string}
             */
            title: function() {
                if (this.finished) {
                    return 'Récapitulatif'
                }
                return `Question ${this.questionIndex + 1} sur ${this.questionsNumber}`
            }
        },
        methods: {
            next() {
                // check if at least one element is check
                if (this.questions[this.questionIndex].responses.some(it => it.checked)) {

                    // calcul the point earned in the question
                    this.questions[this.questionIndex].points = this.questions[this.questionIndex].responses.reduce((points, res) => res.checked ? points + res.points : points, 0)

                    // check for the end of the questions
                    if (this.questionIndex === this.questionsNumber - 1) {
                        const { nom, prenom, societe, questions } = this

                        // post the result in the DB
                        this.$pouchdb.post({ nom, prenom, societe, questions })

                        // trigger the view of the result
                        this.finished = true
                    } else {
                        this.questionIndex += 1
                    }
                } else {
                    alert('Selectionnez au moins une réponse')
                }
            }
        }
    }
</script>

<style>
    
</style>