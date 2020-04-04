<template>
  <div class="nav" :class="{ 'nav-hidden': !showNav, 'nav-off': !ifNav }">
    <div class="nav-inner">
      <button class="nav-link"><router-link to='/settings'><i class="fas fa-cog"></i></router-link></button>
      <button class="nav-link nav-link-main"><router-link to='/add'><i class="fas fa-plus"></i></router-link></button>
      <button class="nav-link" v-on:click="openSorting"><i class="fas fa-sliders-h"></i></button>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import '@fortawesome/fontawesome-free/css/all.css'

export default {
  name: 'Navigation',
  data: function () {
    return {
      showNav: true,
      lastScrollPosition: 0,
    }
  },
  computed: {
    ifNav() {
      if (store.state.view == 'settings') return false
      if (store.state.view == 'single') return false
      if (store.state.view == 'fresh') return false
      if (store.state.view == 'tags') return false
      if (store.state.view == 'add') return false
      if (store.state.sortingOpen) return false
      else return true
    },
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll() {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
      if (currentScrollPosition < 0) return
      if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 0) return
      this.showNav = currentScrollPosition < this.lastScrollPosition
      this.lastScrollPosition = currentScrollPosition
    },
    openSorting() {
      store.commit('setSorting', true)
    }
  } 
}
</script>