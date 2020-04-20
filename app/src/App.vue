<template>
  <div id="app">
    <div class="app-background"></div>
    <Header></Header>
    <div v-if="init" class="ready">
      <div v-if="fresh">
        <Fresh></Fresh>
      </div>
      <div v-else>
        <vue-page-transition name="fade">
          <router-view/>
        </vue-page-transition>
      </div>
    </div>
    <div v-else class="loading"></div>
    <Navigation></Navigation>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VuePageTransition from 'vue-page-transition'
  Vue.use(VuePageTransition)
  import store from '@/store'
  import Navigation from '@/components/Navigation.vue'
  import Header from '@/components/Header.vue'
  import Fresh from '@/views/Fresh.vue'

  export default {
    components: {
      Header,
      Navigation,
      Fresh
    },
    computed: {
      fresh() {
        if (store.state.setups) return false
        else return true
      },
      init() {
        if (store.state.init) return true
        else return false
      }
    },
    beforeMount() {
      store.commit('config')
    }
  }
</script>