<template>
    <div>
        <nav class="navbar navbar-dark bg-dark">
            <router-link class="btn btn-secondary" to="/admin">Administration</router-link>
        </nav>
        <div class="form-container container">
            <h3 class="mt-5">Questionnaire sous-traitant EEV SAS</h3>
            <form v-on:submit="submitHandler" class="mt-4">
                <bootstrap-input label="Prenom" v-model="prenom" />
                <bootstrap-input label="Nom" v-model="nom" />
                <bootstrap-input label="Société" v-model="societe" />
                <div class="form-group">
                    <input class="form-control btn btn-outline-success" type="submit" value="Commencer">
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import bootstrapInput from '../components/bootstrap-input.vue'

    export default {
        name: 'home',
        components: {
            'bootstrap-input': bootstrapInput
        },
        data: function() {
            return {
                nom: '',
                prenom: '',
                societe: ''
            };
        },
        methods: {
            submitHandler(e) {
                e.preventDefault()
                this.$router.push(`/questionnaire/${this.prenom}/${this.nom}/${this.societe}`)
            }
        }
    }
</script>

<style>
    .form-container { width: 600px; max-width: 90% }
</style>