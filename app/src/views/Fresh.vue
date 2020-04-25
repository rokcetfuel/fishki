<template>
  <div class="fresh view">
    <div class="fresh-card">
      <div class="fresh-card-title">
        <span>Create your first setup</span>
      </div>
      <ul class="fresh-card-content">
        <li class="fresh-card-line">
          <span class="fresh-card-line-label">Name</span>
          <span class="fresh-card-line-content">
            <input spellcheck="false" @focus="clearNewErrors" type="text" class="fresh-input-fake" v-model="newSetupName" placeholder="Name your setup"/>
          </span>
        </li>
        <li class="fresh-card-line fresh-card-line-error" v-if="newSetupNameError">
          <span>Setup name can't be empty</span>
        </li>
        <li class="fresh-card-line">
          <span class="fresh-card-line-label">
            <span>I want to learn</span>
            <small>Phrases</small>
          </span>
          <span class="fresh-card-line-content">
            <v-select @input="clearNewErrors" :searchable="false" class="fresh-v-select" v-model="selectedPhraseLang" :options="phraseLanguages" :components="{Deselect}" append-to-body :calculate-position="withPopper"></v-select>
          </span>
        </li>
        <li class="fresh-card-line">
          <span class="fresh-card-line-label">
            <span>I can speak</span>
            <small>Translations</small>
          </span>
          <span class="fresh-card-line-content">
            <v-select @input="clearNewErrors" :searchable="false" class="fresh-v-select" v-model="selectedTransLang" :options="translationLanguages" :components="{Deselect}" append-to-body :calculate-position="withPopper"></v-select>
          </span>
        </li>
        <li class="fresh-card-line fresh-card-line-error" v-if="newSetupEmptyError">
          <span>Choose both languages</span>
        </li>
        <li class="fresh-card-line fresh-card-line-error" v-if="newSetupSameError">
          <span>Languages must be different</span>
        </li>
        <li class="fresh-card-line">
          <span class="fresh-card-line-label">Save pronunciation?</span>
          <span class="fresh-card-line-content">
            <switches v-model="newPronoEnabled" color="pink" theme="fish"></switches>
          </span>
        </li>
        <li class="fresh-card-line">
          <span class="fresh-card-line-content">
            <button class="fresh-card-line-button" v-on:click="addNewSetup()">Ok</button>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import store from '@/store'
import { phraseLanguages, translationLanguages } from '@/config'
import 'vue-select/dist/vue-select.css';
import vSelect from 'vue-select'
Vue.component('v-select', vSelect)
import Switches from 'vue-switches'
import '@fortawesome/fontawesome-free/css/all.css'
import { createPopper } from '@popperjs/core'

export default {
  name: 'Fresh',
  components: {
    Switches
  },
  data: () => {
    return {

      /* New */
      phraseLanguages: phraseLanguages,
      translationLanguages: translationLanguages,
      selectedPhraseLang: false,
      selectedTransLang: false,
      newPronoEnabled: true,
      newSetupName: '',

      newSetupNameError: false,
      newSetupSameError: false,
      newSetupEmptyError: false,
      
      /* Diffent */
      Deselect: {render: createElement => createElement('span', '')},
    }
  },
  beforeMount: function() {
    if (this.$route.name != 'Home') this.$router.push('/')
    store.commit('setView', 'fresh')
  },
  methods: {
    clearNewErrors() {
      this.newSetupEmptyError = false
      this.newSetupNameError = false
      this.newSetupSameError = false
    },

    addNewSetup() {
      if (this.newSetupName !== '') {
        if (this.selectedPhraseLang && this.selectedTransLang) {
          let phraseLang = this.selectedPhraseLang.code
          let transLang = this.selectedTransLang.code
          if (phraseLang != transLang) {
            this.clearNewErrors()
            let langSetupCode = `${transLang}-${phraseLang}`
            let langSetupName = this.newSetupName
            let langProno = this.newPronoEnabled
            store.commit('addNewSetup', {
              code: langSetupCode, 
              name: langSetupName, 
              prono: langProno
            })
          } else this.newSetupSameError = true
        } else this.newSetupEmptyError = true
      } else this.newSetupNameError = true
    },

    withPopper: function(dropdownList, component, {width}) {
      dropdownList.style.width = width
      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: 'bottom-end',
        modifiers: [
          {
            name: 'offset', options: {
              offset: [0, -1]
            }
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
      });
      return () => popper.destroy()
    }
  }
}
</script>