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
            <v-select v-if="pronoOn" class="sort-v-select" v-model="sortingSeleted" :options="sortingOptions" 
              :components="{Deselect}" append-to-body :calculate-position="withPopper"></v-select>
            <v-select v-else class="sort-v-select" v-model="sortingSeleted" :options="sortingOptionsNoProno" 
              :components="{Deselect}" append-to-body :calculate-position="withPopper"></v-select>
          </span>
        </li>
        <li class="sort-card-line sort-card-line-tags">
          <span class="sort-card-line-label">Tags</span>
          <span class="sort-card-line-content">
            <div class="sort-tags">

              <div class="tag">
                <div class="tag-inner">
                  <input class="tag-input" type="checkbox"/>
                  <div class="tag-box">
                    <span>Tag name</span>
                  </div>
                </div>
              </div>

              <div class="tag">
                <div class="tag-inner">
                  <input class="tag-input" type="checkbox"/>
                  <div class="tag-box">
                    <span>Short</span>
                  </div>
                </div>
              </div>

              <div class="tag">
                <div class="tag-inner">
                  <input class="tag-input" type="checkbox"/>
                  <div class="tag-box">
                    <span>Very long tag name</span>
                  </div>
                </div>
              </div>

              <div class="tag">
                <div class="tag-inner">
                  <input class="tag-input" type="checkbox"/>
                  <div class="tag-box">
                    <span>Name</span>
                  </div>
                </div>
              </div>

            </div>
          </span>
        </li>
        <li class="sort-card-line">
          <span class="sort-card-line-content">
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
    }
  },
  methods: {
    switchSort() {
      store.commit('reverseSort')
    },
    applySort() {
      store.commit('sortBy', this.sortingSeleted)
      store.commit('setSorting', false)
      /* sort by tags */
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