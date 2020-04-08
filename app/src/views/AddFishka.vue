<template>
  <div class="add view">
    
    <div class="add-card add-quick-fish" :class="{ 'add-quick-fish-done' : quickFishFilled }">
      <ul class="add-card-content">
        <li class="add-card-line add-quick-fish-top">
          <span class="add-card-line-label">Quick fishka</span>
          <span @click="reopenQuickFish" class="add-card-line-content add-quick-fish-top-ok">
            <i class="fas fa-keyboard"></i>
          </span>
          <span class="add-card-line-content add-quick-fish-top-wait">
            <textarea-autosize class="add-input-fake" 
            placeholder="Write the phrase in your source language..." v-model="fishQuick" />
          </span>
        </li>
        <li class="add-card-line add-quick-fish-confirm">
          <span class="add-card-line-content">
            <button class="add-card-line-button" @click="fillQuickFish">Ok</button>
          </span>
        </li>
      </ul>
    </div>
    <div class="add-card">
      <ul class="add-card-content">
        <li class="add-card-line">
          <span class="add-card-line-label">Phrase</span>
          <span class="add-card-line-content">
            <textarea-autosize class="add-input-fake" placeholder="Phrase..." v-model="fishPhrase" />
          </span>
        </li>
        <li class="add-card-line">
          <span class="add-card-line-label">Translation</span>
          <span class="add-card-line-content">
            <textarea-autosize class="add-input-fake" placeholder="Translation..." v-model="fishTrans" />
          </span>
        </li>
        <li v-if="pronoOn" class="add-card-line">
          <span class="add-card-line-label">Pronounciation</span>
          <span class="add-card-line-content">
            <textarea-autosize class="add-input-fake" placeholder="Pronounciation..." v-model="fishProno" />
          </span>
        </li>
        <li class="add-card-line add-card-line-tags">
          <span class="add-card-line-label">Tags</span>
          <span class="add-card-line-content">
            <div class="add-tags">

              <div class="tag tag-new">
                <div class="tag-inner">
                  <div class="tag-box">
                    <input class="tag-box-input" id="newTagInput" autocomplete="off" type="text" v-model="newTag" placeholder="New tag?" />
                    <button class="tag-box-submit" @click="addNewTag">OK</button>
                  </div>
                </div>
              </div>

              <div class="tag" v-for="tag in currentSetupTags" :key="tag.id">
                <div class="tag-inner">
                  <input class="tag-input" :value="tag.id" v-model="fishTags" type="checkbox"/>
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
            <button class="add-card-line-button" @click="addNewFish">Ok</button>
          </span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import store from '@/store'
  import '@/mixins'
  import TextareaAutosize from 'vue-textarea-autosize'
  Vue.use(TextareaAutosize)
  import VueInputAutowidth from 'vue-input-autowidth'
  Vue.use(VueInputAutowidth)
  const autosizeInput = require('autosize-input')
  const pinyin = require("chinese-to-pinyin")

  export default {
    name: 'AddFishka',
    data: () => { 
      return {
        quickFishFilled: false,
        quickFishError: false,
        fishQuick: '',
        fishPhrase: '',
        fishTrans: '',
        fishProno: '',
        fishTags: [],
        newTag: ''
      }
    },
    beforeMount: function () {
      store.commit('setView', 'add')
    },
    mounted() {
      autosizeInput(document.querySelector('#newTagInput'))
    },
    computed: {
      currentCode() {
        if (store.state.current.code) return store.state.current.code
      },
      currentSetupTags() {
        if (store.state.tags.length > 0) {
          return store.state.tags.slice().reverse()
        } else return false
      },
      pronoOn() {
        if (store.state.prono) return true
      }
    },
    methods: {
      fillQuickFish() {
        let text = this.fishQuick
        let phraseLangCode = this.currentCode.substring(3, 5)
        this.getTranslation(text, this.currentCode).then((result) => {
          if (result) {
            this.quickFishFilled = true
            this.fishTrans = text
            this.fishPhrase = result
            if (phraseLangCode == 'zh') this.fishProno = pinyin(result, { keepRest: true })
          } else {
            // Deal with this during validation
            // this.quickFishError = true
          }
        })
      },
      reopenQuickFish() {
        this.quickFishFilled = false
      },
      addNewFish() {
        let setup = store.state.current.id
        let phrase = this.fishPhrase
        let trans = this.fishTrans
        let prono = this.fishProno
        let tags = this.fishTags
        
        store.commit('addNewFish', {
          setup: setup,
          phrase: phrase,
          trans: trans,
          prono: prono,
          tags: tags
        })

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
      },
      getAddTranslation() {

      }
    }
  }
</script>
