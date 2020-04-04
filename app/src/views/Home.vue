<template>
  <div class="home view">
    <div class="home-all">
      <Sort v-if="sortingOpen"></Sort>
      <Fishka v-for="fish in allFish" :key="fish.id" :id="fish.id"></Fishka>
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
      sortOpen: false
    }
  },
  computed: {
    sortingOpen() {
      return store.state.sortingOpen
    },
    allFish() {
      if (store.state.fish.length > 0) return store.state.fish
      else return false
    }
  },
  beforeMount: function () {
    store.commit('setView', 'home')
  }
}
</script>