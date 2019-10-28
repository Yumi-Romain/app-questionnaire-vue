<template>
    <div>
        <nav class="navbar navbar-dark bg-dark">
            <router-link class="btn btn-secondary" to="/">Accueil</router-link>
        </nav>
        <div class="container" >

            <!-- connexion form -->
            <form class="text-left mt-5" v-on:submit="submitHandler" v-if="!identified">
                <div class="form-group">
                    <label class="display-4" for="pass">Mot de passe</label>
                    <input id="pass" class="form-control" v-bind:class="error ? 'is-invalid' : ''" v-model="password" type="password" placeholder="Mot de passe">
                    <small id="emailHelp" class="form-text text-muted"></small>
                </div>
                <button type="submit" class="btn btn-primary">Connexion</button>
            </form>

            <!-- user list -->
            <div v-if="identified && focusIndex === -1" class="mt-5">
                <input class="form-control" type="text" v-model="input" placeholder="nom, prenom, societe">
                <table class="table mt-2 table-hover sortedTable text-left">
                    <thead>
                        <tr v-bind:class="[sortedCol, sortedDirAsc ? 'asc' : 'desc']">
                            <th v-on:click="filterBy('nom')" class="nom" scope="col">Nom</th>
                            <th v-on:click="filterBy('prenom')" class="prenom" scope="col">Prenom</th>
                            <th v-on:click="filterBy('societe')" class="societe" scope="col">Société</th>
                            <th class="no-sort" scope="col">score</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-bind:key="user._id" v-for="(user, i) in sortedUsers" v-on:click="focus(i)">
                            <td>{{ user.nom }}</td>
                            <td>{{ user.prenom }}</td>
                            <td>{{ user.societe }}</td>
                            <td>{{ user | score }}</td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="filteredUsers.length > 10" class="d-flex justify-content-between align-items-center border-top p-3" colspan="4">
                    <div>Page {{ currentPage + 1 }} sur {{ maxPage }}</div>
                    <div class="d-flex align-items-center">
                        <button v-on:click="previousPage" class="btn btn-outline-secondary arrow"><i class="left"></i></button>
                        <div class="display-5 mr-2 ml-2">{{ currentPage + 1 }}</div>
                        <button v-on:click="nextPage" class="btn btn-outline-secondary arrow"><i class="right"></i></button>
                    </div>
                </div>
            </div>

            <!-- list of the questions -->
            <div class="container" v-if="focusIndex > -1">
                <div class="d-flex mt-5 align-items-center mb-3">
                    <div class="ml-2">{{users[focusIndex].nom}}</div>
                    <div class="ml-2">{{users[focusIndex].prenom}}</div>
                    <div class="ml-2">{{users[focusIndex].societe}}</div>
                    <div class="flex-grow-1"></div>
                    <button v-on:click="blur" type="button" class="close float-none text-danger" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <review v-bind:q="users[focusIndex].questions" />
            </div>

        </div>
    </div>
</template>

<script>
    import Review from '../components/Review'

    export default {
        name: 'Admin',
        components: {
            'review': Review
        },
        data() {
            return {
                password: '',
                identified: false,
                error: false,
                focusIndex: -1,
                sortedCol: 'nom',
                sortedDirAsc: false,
                currentPage: 0,
                input: '',
                users: []
            }
        },
        filters: {
            score: function (user) {
                // user's score
                const userScore = user.questions.reduce((points, question) => points += question.points, 0)
                // questions's max score
                const maxScore = user.questions.reduce((points, question) =>
                    // question's max score
                    points + question.responses.reduce((maxPts, response) => response.points > 0 ? maxPts + response.points : maxPts, 0),
                    0)
                return `${userScore} / ${maxScore}`
            }
        },
        computed: {
            /**
             * sort the filtered users
             */
            sortedUsers: function() {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                return this.filteredUsers.sort((a, b) => {
                    if (a[this.sortedCol] < b[this.sortedCol]) return this.sortedDirAsc ? 1 : -1
                    if (a[this.sortedCol] > b[this.sortedCol]) return this.sortedDirAsc ? -1 : 1
                    return 0
                }).slice(this.currentPage * 10, this.currentPage * 10 + 10)
            },
            /**
             * filter the users
             */
            filteredUsers: function() {
                return this.users.filter(user => {
                    return this.input !== ""
                        ? user.nom.includes(this.input) || user.prenom.includes(this.input) || user.societe.includes(this.input)
                        : true
                })
            },
            /**
             * number of page in the pagination
             */
            maxPage: function() {
                return Math.floor(this.filteredUsers.length / 10) + 1
            }
        },
        methods: {
            /**
             * go to the next page of the pagination
             */
            nextPage() {
                if (this.currentPage < this.maxPage - 1)
                    this.currentPage += 1
            },
            /**
             * go to the previous page of the pagination
             */
            previousPage() {
                if (this.currentPage > 0)
                    this.currentPage -= 1
            },
            /**
             * set the colomn to filter by
             * @param col String
             */
            filterBy(col) {
                if (this.sortedCol === col) {
                    this.sortedDirAsc = !this.sortedDirAsc
                } else {
                    this.sortedCol = col
                    this.sortedDirAsc = false
                }
            },
            /**
             * release the focus of an overview
             */
            blur() {
                this.focusIndex = -1
            },
            /**
             * assign `index` on `focusIndex` for the `users` array for the overview
             * @param index Int
             */
            focus(index) {
                this.focusIndex = index
            },
            /**
             * Handle the submit of the connexion form
             * @param e Event
             */
            submitHandler(e) {
                e.preventDefault()
                if (this.password === 'admin') {
                    this.identified = true
                    // grab all docs
                    this.$pouchdb.allDocs({
                        include_docs: true,
                        attachments: true
                    }).then(result => {
                        this.users = result.rows.map(doc => doc.doc)
                    })
                } else {
                    this.error = true
                }
            }
        }
    }
</script>

<style>
    i {
        border: solid black;
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 3px;
        transition: .2s border-color ease;
    }

    .btn:hover i {
        border-color: white !important;
    }

    .right {
        transform: rotate(-45deg) translate(-1px, -1px);
        -webkit-transform: rotate(-45deg)  translate(-1px, -1px);
    }

    .left {
        transform: rotate(135deg) translate(-1px, -1px);
        -webkit-transform: rotate(135deg) translate(-1px -1px);
    }

    thead th:not(.no-sort) {
        cursor: pointer;
        position: relative;
    }

    thead th {
        user-select: none;
    }

    .sortedTable .prenom>.prenom::after,
    .sortedTable .societe>.societe::after,
    .sortedTable .score>.score::after,
    .sortedTable .nom>.nom::after {
        position: absolute;
        content: "\2191";
        right: 0;
        transition: .2s transform ease;
    }

    .sortedTable .prenom.desc>.prenom::after,
    .sortedTable .societe.desc>.societe::after,
    .sortedTable .score.desc>.score::after,
    .sortedTable .nom.desc>.nom::after {
        transform: rotate(-180deg);
    }
</style>