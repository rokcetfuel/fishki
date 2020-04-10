<template>
  <div class="sort">
    <div class="sort-card">
      <ul class="sort-card-content">
        <li v-if="sortingReady" class="sort-card-line sort-card-line-full">
          <span class="sort-card-line-label">Sort by</span>
          <span class="sort-card-line-content">
            <span @click="switchSort" class="sort-direction-wrapper">
              <span v-if="sortReverse" class="sort-direction"><i class="fas fa-sort-amount-up"></i></span>
              <span v-else class="sort-direction"><i class="fas fa-sort-amount-down"></i></span>
            </span>
            <v-select :searchable="false" v-if="pronoOn" class="sort-v-select" v-model="sortingSeleted" :options="sortingOptions" 
              :components="{Deselect}" append-to-body :calculate-position="withPopper"></v-select>
            <v-select :searchable="false" v-else class="sort-v-select" v-model="sortingSeleted" :options="sortingOptionsNoProno" 
              :components="{Deselect}" append-to-body :calculate-position="withPopper"></v-select>
          </span>
        </li>
        <li v-if="currentSetupTags" class="sort-card-line sort-card-line-tags">
          <span class="sort-card-line-label">Tags</span>
          <span class="sort-card-line-content">
            <div class="sort-tags">
              <div class="tag" v-for="tag in currentSetupTags" :key= "tag.id">
                <div class="tag-inner">
                  <input class="tag-input" :value="tag.id" v-model="selectedTags" name="selectTags" type="checkbox"/>
                  <div class="tag-box">
                    <span>{{tag.name}}</span>
                  </div>
                </div>
              </div>
            </div>
          </span>
        </li>
        <li class="sort-card-line">
          <span class="sort-card-line-content">
            <button class="sort-card-line-button sort-card-line-close" @click="closeSort">Cancel</button>
            <button class="sort-card-line-button" @click="applySort">Ok</button>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import store from '@/store'
import 'vue-select/dist/vue-select.css';
import vSelect from 'vue-select'
Vue.component('v-select', vSelect)
import { createPopper } from '@popperjs/core'

export default {
  name: 'Sort',
  data: () => {
    return {
      sortingSeleted: '',

      sortingOptions: [
        {'value': 'created', 'label': 'Date Created'},
        {'value': 'edited', 'label': 'Date Edited'},
        {'value': 'phrase', 'label': 'Phrase'},
        {'value': 'trans', 'label': 'Translation'},
        {'value': 'prono', 'label': 'Pronunciation'}
      ],

      sortingOptionsNoProno: [
        {'value': 'created', 'label': 'Date Created'},
        {'value': 'edited', 'label': 'Date Edited'},
        {'value': 'phrase', 'label': 'Phrase'},
        {'value': 'trans', 'label': 'Translation'}
      ],

      /* Diffent */
      Deselect: {render: createElement => createElement('span', '')},
    }
  },
  computed: {
    sortingReady() {
      if (store.state.sortBy) {
        if (this.sortingSeleted == '') this.sortingSeleted = { ...store.state.sortBy }
        return true
      } else return false
    },
    sortReverse() {
      if (store.state.sortReverse) return true
      else return false
    },
    pronoOn() {
      if (store.state.prono) return true
    },
    currentSetupTags() {
      if (store.state.tags.length > 0) {
        let setupTags = store.state.tags.slice()

        if (store.state.fish.length > 0) {
          let setupFish = store.state.fish.slice()
          let includedTags = []

          for (let tag of setupTags) {
            let tagid = tag.id
            let tagExists = false

            for (let fishka of setupFish) {
              if (fishka.tags.includes(tagid)) {
                tagExists = true
                break
              }
            }
            
            if (tagExists) includedTags.push(tag)
          }

          if (includedTags.length > 0) return includedTags.reverse()
          else return false
        }

        return false
      } else return false
    },
    selectedTags: {
      get() {return store.state.selectedTags.slice()},
      set(selected) {store.commit('sortByTags', selected)}
    },
  },
  methods: {
    switchSort() {
      store.commit('reverseSort')
    },
    closeSort() {
      store.commit('setSorting', false)
    },
    applySort() {
      store.commit('sortBy', this.sortingSeleted)
      store.commit('sortByFinalTags', this.selectedTags)
      store.commit('setSorting', false)
    },
    withPopper (dropdownList, component, {width}) {
      dropdownList.style.width = width
      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: 'bottom',
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