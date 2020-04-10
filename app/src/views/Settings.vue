<template>
  <div class="settings view">
  
    <div class="settings-card" v-if="currentSetup">
      <div class="settings-card-title">
        <span>Current setup</span>
      </div>
      <ul class="settings-card-content">
        <li class="settings-card-line">
          <span class="settings-card-line-label">Name</span>
          <span class="settings-card-line-content">
            <input @focus="getCurrentSetupOldName" @blur="editCurrentSetupName" 
              type="text" class="settings-input-fake" v-model="currentSetup.name" />
          </span>
        </li>
        <li class="settings-card-line">
          <span class="settings-card-line-label">Phrases</span>
          <span class="settings-card-line-content">{{currentSetup.phrase}}</span>
        </li>
        <li class="settings-card-line">
          <span class="settings-card-line-label">Translations</span>
          <span class="settings-card-line-content">{{currentSetup.trans}}</span>
        </li>
        <li class="settings-card-line">
          <span class="settings-card-line-label">Pronounciation</span>
          <span @click="editCurrentSetupProno" class="settings-card-line-content">
            <switches v-model="setupProno" color="pink" theme="fish"></switches>
            </span>
        </li>
        <router-link to="tags">
          <li class="settings-card-line settings-card-line-link">
            <span class="settings-card-line-label">Tags manager</span>
            <span class="settings-card-line-content">
              <i class="fas fa-arrow-right"></i>
            </span>
          </li>
        </router-link>
        <li class="settings-card-line">
          <span class="settings-card-line-content">
            <button class="settings-card-line-button" @click="deleteSetup">Delete this setup</button>
          </span>
        </li>
      </ul>
    </div>

    <div class="settings-card" v-if="allSetups.length > 0">
      <div class="settings-card-title">
        <span>Switch setup</span>
      </div>
      <ul class="settings-card-content">
        <li class="settings-card-line settings-card-line-link" @click="switchSetup(setup.id)" v-for="setup in allSetups" :key="setup.id">
          <span class="settings-card-line-label">{{setup.name}}</span>
          <span class="settings-card-line-content"><i class="fas fa-arrow-right"></i></span>
        </li>
      </ul>
    </div>

    <div class="settings-card">
      <div class="settings-card-title">
        <span>Create new setup</span>
        <span @click="toggleCreate">
          <i v-if="createOpen" class="fas fa-angle-double-up"></i>
          <i v-else class="fas fa-angle-double-down"></i>
        </span>
      </div>
      <ul v-if="createOpen" class="settings-card-content">
        <li class="settings-card-line">
          <span class="settings-card-line-label">Name</span>
          <span class="settings-card-line-content">
            <input type="text" class="settings-input-fake" v-model="newSetupName" placeholder="Name your setup"/>
          </span>
        </li>
        <li class="settings-card-line">
          <span class="settings-card-line-label">Phrases</span>
          <span class="settings-card-line-content">
            <v-select :searchable="false" class="settings-v-select" v-model="selectedPhraseLang" :options="phraseLanguages" 
              :components="{Deselect}" append-to-body :calculate-position="withPopper"></v-select>
          </span>
        </li>
        <li class="settings-card-line">
          <span class="settings-card-line-label">Translations</span>
          <span class="settings-card-line-content">
            <v-select :searchable="false" class="settings-v-select" v-model="selectedTransLang" :options="translationLanguages" 
              :components="{Deselect}" append-to-body :calculate-position="withPopper"></v-select>
          </span>
        </li>
        <li class="settings-card-line">
          <span class="settings-card-line-label">Pronounciation</span>
          <span class="settings-card-line-content">
            <switches v-model="newPronoEnabled" color="pink" theme="fish"></switches>
          </span>
        </li>
        <li class="settings-card-line">
          <span class="settings-card-line-content">
            <button class="settings-card-line-button" v-on:click="addNewSetup">Ok</button>
          </span>
        </li>
      </ul>
    </div>

    <div class="settings-card">
      <div class="settings-card-title">
        <span>About the App</span>
      </div>
      <ul class="settings-card-content">
        <li class="settings-card-line">
          <span class="settings-card-line-content-inline">
            Translation tips powered by <a href="http://translate.yandex.com">Yandex.Translate</a>
          </span>
        </li>
        <li class="settings-card-line">
          <span class="settings-card-line-content-inline">
           Visit <a href="#">Homepage</a>
          </span>
        </li>
        <li class="settings-card-line">
          <span class="settings-card-line-content-inline">
           © 2020
          </span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import VueRouter from 'vue-router'
  import store from '@/store'
  import { phraseLanguages, translationLanguages } from '@/config'
  import 'vue-select/dist/vue-select.css';
  import vSelect from 'vue-select'
  Vue.component('v-select', vSelect)
  import Switches from 'vue-switches'
  import '@fortawesome/fontawesome-free/css/all.css'
  import { createPopper } from '@popperjs/core'

  export default {
    name: 'Settings',
    components: {
      Switches
    },
    data: () => {
      return {
        /* Current */
        setupName: '',
        setupProno: false,

        /* New */
        phraseLanguages: phraseLanguages,
        translationLanguages: translationLanguages,
        selectedPhraseLang: false,
        selectedTransLang: false,
        newPronoEnabled: true,
        newSetupName: '',
        
        /* Diffent */
        Deselect: {render: createElement => createElement('span', '')},
        createOpen: false,
      }
    },
    computed: {
      currentSetup() {
        if (store.state.current && store.state.setups) {
          let setup = store.state.current
          let setupID = setup.id
          let transLangCode = setup.code.substring(0, 2)
          let phraseLangCode = setup.code.substring(3, 5)
          let transLangFilter = this.translationLanguages.filter(lang => lang.code == transLangCode)
          let phraseLangFilter = this.phraseLanguages.filter(lang => lang.code == phraseLangCode)
          let setupNameFilter = store.state.setups.filter(thisSetup => thisSetup.id == setup.id)
          let transLangLabel = transLangFilter[0].label
          let phraseLangLabel = phraseLangFilter[0].label
          let setupName = setupNameFilter[0].name
          let ifProno = setupNameFilter[0].prono

          this.setupProno = ifProno

          return {
            phrase: phraseLangLabel,
            trans: transLangLabel,
            name: setupName
          }
        }
      },
      allSetups() {
        if (store.state) {
          if (store.state.current && store.state.setups) return store.state.setups.filter(thatSetup => thatSetup.id != store.state.current.id)
          else return []
        } else return false
      }
    },
    methods: {

      toggleCreate() {
        this.createOpen = !this.createOpen
      },

      /* Editing setup name */
      getCurrentSetupOldName() {
        this.setupName = this.currentSetup.name
      },
      editCurrentSetupName() {
        if (this.setupName != this.currentSetup.name) {
          console.log(this.setupName + ' > ' + this.currentSetup.name)
          store.commit('editSetupName', {
            name: this.currentSetup.name,
            setup: store.state.current.id
          })
        }
      },

      /* Editing setup prono */
      editCurrentSetupProno() {
        this.setupProno = !this.setupProno
        store.commit('editSetupProno', {
          prono: this.setupProno,
          setup: store.state.current.id
        })
      },

      /* Switching between setups */
      deleteSetup() {
        let currentSetup = store.state.current.id
        if (store.state.setups.length > 1) {
          let remainingSetups = store.state.setups.filter(thatSetup => thatSetup.id != currentSetup)
          let switchTo = remainingSetups[0].id
          store.commit('deleteSetup', {
            setup: currentSetup,
            switchSetup: true,
            switchTo: switchTo
          })
        } else {
          store.commit('deleteSetup', {
            setup: currentSetup,
            switchSetup: false
          })
        }
        this.$router.push('/')
      },

      /* Switching between setups */
      switchSetup(id) {
        store.commit('switchSetup', id)
        this.$router.push('/')
      },

      /* Adding a new setup */
      addNewSetup() {
        if (this.selectedPhraseLang && this.selectedTransLang) {
          let phraseLang = this.selectedPhraseLang.code
          let transLang = this.selectedTransLang.code
          if (phraseLang != transLang) {
            let langSetupCode = `${transLang}-${phraseLang}`
            let langSetupName = this.newSetupName
            let langProno = this.newPronoEnabled
            store.commit('addNewSetup', {
              code: langSetupCode, 
              name: langSetupName, 
              prono: langProno
            })
            this.$router.push('/')
          } 
        }
      },

      /* For Vue Select */
      withPopper(dropdownList, component, {width}) {
        dropdownList.style.width = width
        const popper = createPopper(component.$refs.toggle, dropdownList, {
          placement: 'top-end',
          modifiers: [
            { 
              name: 'offset', 
              options: {offset: [0, -1]}
            },
            {
              name: 'toggleClass',
              enabled: true,
              phase: 'write',
              fn ({state}) {
                component.$el.classList.toggle('drop-up', state.placement === 'top')
              },
            }
          ]
        })
        return () => popper.destroy()
      }
    },
    beforeMount: function() {
      store.commit('setView', 'settings')
    }
  }
</script>