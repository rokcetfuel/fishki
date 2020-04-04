<template>
    <div class="home view">
        <div class="home-container">
            <div class="single-fish add" v-if="fishka">
            
                <div class="add-card">
                    <ul class="add-card-content">
                        <li class="add-card-line">
                            <span class="add-card-line-label">Phrase</span>
                            <span class="add-card-line-content">
                                <textarea-autosize class="add-input-fake" placeholder="Phrase..." v-model="fishka.phrase"/>
                            </span>
                        </li>

                        <li class="add-card-line">
                            <span class="add-card-line-label">Translation</span>
                            <span class="add-card-line-content">
                            <textarea-autosize class="add-input-fake" placeholder="Translation..." v-model="fishka.trans"/>
                            </span>
                        </li>

                        <li class="add-card-line">
                            <span class="add-card-line-label">Pronounciation</span>
                            <span class="add-card-line-content">
                            <textarea-autosize class="add-input-fake" placeholder="Pronounciation..."  v-model="fishka.prono"/>
                            </span>
                        </li>

                        <li class="add-card-line add-card-line-tags">
                            <span class="add-card-line-label">Tags</span>
                            <span class="add-card-line-content">
                                <div class="add-tags">

                                    <div class="tag tag-new">
                                        <div class="tag-inner">
                                            <div class="tag-box">
                                                <input class="tag-box-input" id="newTagInput" autocomplete="off" 
                                                    type="text" v-model="newTag" placeholder="New tag?" />
                                                <button class="tag-box-submit" @click="addNewTag">OK</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="tag" v-for="tag in currentSetupTags" :key= "tag.id">
                                        <div class="tag-inner">
                                            <input class="tag-input" :value="tag.id" v-model="fishka.tags" type="checkbox"/>
                                            <div class="tag-box">
                                                <span>{{tag.name}}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </span>
                        </li>

                        <li class="add-card-line">
                            <span class="add-card-line-content">
                                <button @click="saveEditedFish" class="add-card-line-button">Save changes / Edit (grey)</button>
                            </span>
                        </li>
                    </ul>
                </div>

                <div class="add-card">
                    <ul class="add-card-content">
                        <li class="add-card-line add-card-line-full">
                            <span class="add-card-line-label">Created</span>
                            <span class="add-card-line-content">
                                {{fishka.date.toLocaleDateString()}}
                            </span>
                        </li>
                        <li class="add-card-line add-card-line-full">
                            <span class="add-card-line-label">Edited</span>
                            <span class="add-card-line-content">
                                {{fishka.edit.toLocaleDateString()}}
                            </span>
                        </li>
                        <li class="add-card-line">
                            <span class="add-card-line-content">
                                <button @click="deleteFish" class="add-card-line-button">Delete fishka</button>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import store from '@/store'
import TextareaAutosize from 'vue-textarea-autosize'
Vue.use(TextareaAutosize)
import VueInputAutowidth from 'vue-input-autowidth'
Vue.use(VueInputAutowidth)
const autosizeInput = require('autosize-input')

export default {
    name: 'EditFishka',
    props: ['id'],
    data: () => {
        return {
            newTag: ''
        }
    },
    computed: {
        fishka() {
            if (store.state.fish) {
                let thisFishka = store.state.fish.filter(fishy => fishy.id === parseInt(this.id))
                return thisFishka[0]
            } else {
                return false
            }
        },
        currentSetupTags() {
            if (store.state.tags.length > 0) {
                return store.state.tags.slice().reverse()
            } else return false
        },
        domReady() {
            if (store.state.tags) {
                autosizeInput(document.querySelector('#newTagInput'))
                return true
            }
        }
    },
    methods: {
        saveEditedFish() {
            let phrase = this.fishka.phrase
            let trans = this.fishka.trans
            let prono = this.fishka.prono
            let fishid = this.id
            let tags = this.fishka.tags

            store.commit('editFish', {
                phrase: phrase,
                trans: trans,
                prono: prono,
                tags: tags,
                fishid: fishid
            })

            this.$router.push('/')
        },
        deleteFish() {
            let fishid = this.id
            store.commit('deleteFish', fishid)
            this.$router.push('/')
        },
        addNewTag() {
            let allTags = store.state.tags
            let tagSetup = store.state.current.id
            let tagName = this.newTag
            let tagExists = false

            if (allTags) {
                let allTagsNames = allTags.map((tag) => {return tag.name})
                tagExists = allTagsNames.includes(tagName)
            }

            if (tagExists) {
                console.log('Tag exists already...')
                document.querySelector('#newTagInput').focus()
            } else {
                this.newTag = ''
                document.querySelector('#newTagInput').value = ''
                document.querySelector('#newTagInput').blur()
                autosizeInput(document.querySelector('#newTagInput'))
                store.commit('addNewTag', {
                    setup: tagSetup,
                    name: tagName
                })
            }
        }
    },
    beforeMount() {
        store.commit('setView', 'single')
    },
    async mounted() {
        if (document.querySelector('#newTagInput')) {
            await autosizeInput(document.querySelector('#newTagInput'))
        }
    },
}
</script>