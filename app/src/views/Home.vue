<template>
  <div class="home view">
    <div class="home-all">
      <Sort v-if="sortingOpen"></Sort>
      <Fishka v-for="fish in allFish" :key="fish.id" :id="fish.id"></Fishka>

      <div v-if="nothingHere" class="fish-container">
        <div class="fish">
          <div class="fish-inner">
            <div class="fish-empty">
              <span class="fish-emtpty-header">Nothing here, buddie</span>
              <span class="fish-emtpty-text">Sorry, nothing matched your filters</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="nothingHereYet" class="fish-container">
        <div class="fish">
          <router-link class="fish-inner" to="/add">
            <div class="fish-empty">
              <span class="fish-emtpty-header">Nothing here yet...</span>
              <span class="fish-emtpty-text">Create your first fishka!</span>
            </div>
          </router-link>
        </div>
      </div>

      <div v-if="quote" class="home-quote">
        <div class="quote" :class="{ 'quote-ready' : quoteReady && quoteChanged }">
          <div class="quote-text">
            <span>{{quote.quoteText}}</span>
          </div>
          <div class="quote-author">
            <span>{{quote.quoteAuthor}}</span>
          </div>
          <div class="quote-dots">
            <span class="dot lg">.</span>
            <span class="dot md">.</span>
            <span class="dot sm">.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import Fishka from '@/components/Fishka.vue'
import Sort from '@/components/Sort.vue'

export default {
  name: 'Home',
  components: {
    Fishka, 
    Sort
  },
  data: () => {
    return {
      sortOpen: false,
      fishLoaded: false,
      nothingHere: false,
      nothingHereYet: false,
      firstQuote: true,
      quoteReady: false,
      quoteChanged: false,
    }
  },
  computed: {
    sortingOpen() {
      return store.state.sortingOpen
    },
    selectedTags() {
      if (store.state.selectedTags.length > 0) {
        return store.state.selectedTags.slice()
      } else return false
    },
    allFish() {
      if (store.state.fish) {
        this.fishLoaded = true

        if (store.state.fish.length > 0) {
          this.nothingHereYet = false
          let fishArrayBeforeTags = store.state.fish.slice()
          let fishArray = fishArrayBeforeTags

          if (store.state.finalSelectedTags.length > 0) {
            let selectedTags = store.state.finalSelectedTags.slice()
            fishArray = fishArrayBeforeTags.filter((fishka) => {
              return selectedTags.every(i => fishka.tags.includes(i))
            })
          }

          let sortedFish = []
          if (store.state.sortBy.value == 'edited')       sortedFish = fishArray.sort(this.byEdited)
          else if (store.state.sortBy.value == 'phrase')  sortedFish = fishArray.sort(this.byPhrase)
          else if (store.state.sortBy.value == 'trans')   sortedFish = fishArray.sort(this.byTrans)
          else if (store.state.sortBy.value == 'prono')   sortedFish = fishArray.sort(this.byProno)
          else sortedFish = fishArray.sort(this.byCreated)

          if (sortedFish.length == 0) this.nothingHere = true
          else this.nothingHere = false
            
          if (store.state.sortReverse) return sortedFish.reverse()
          else return sortedFish 
        } else {
          this.nothingHereYet = true
          return false
        }
      } else {
        return false
      }
    },
    quote() {
      if (store.state.quote) {
        if (this.quoteReady == false) {
          if (store.state.firstQuote) {
            setTimeout(() => {this.quoteReady = true}, 500)
            store.commit('setFirstQuoteDone', false)
          } else this.quoteReady = true
        } return { ...store.state.quote }
      } else return false
    }
  },
  methods: {
    byCreated(a, b) {
      if (a.date < b.date) return -1
      else if (a.date > b.date) return 1
      else return 0
    },
    byEdited(a, b) {
      if (a.edit < b.edit) return -1
      else if (a.edit > b.edit) return 1
      else return 0
    },
    byPhrase(a, b) {
      if (a.phrase < b.phrase) return -1
      else if (a.phrase > b.phrase) return 1
      else return 0
    },
    byTrans(a, b) {
      if (a.trans < b.trans) return -1
      else if (a.trans > b.trans) return 1
      else return 0
    },
    byProno(a, b) {
      if (a.prono < b.prono) return -1
      else if (a.prono > b.prono) return 1
      else return 0
    }
  },
  watch: {
    quote() {
      this.quoteChanged = true
    }
  },
  beforeMount: function () {
    store.commit('setView', 'home')
    this.getQuote().then(result => store.commit('setQuote', result))
  },
}
</script>