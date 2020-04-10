<template>
  <div class="header" :class="{ 'header-hidden': (!showHeader && !ifFixed) }">
    <router-link v-show="ifBack" class="header-back" to='/'><i class="fas fa-angle-left"></i></router-link>
    <router-link v-show="ifBackSettings" class="header-back" to='settings'><i class="fas fa-angle-left"></i></router-link>
    <div class="header-text">
      <span class="header-view-title">{{viewTitle}}</span>
      <router-link class="header-app-title" to='/'>{{appTitle}}</router-link>
    </div>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    name: 'Header',
    data: function () {
      return {
        showHeader: true,
        lastScrollPosition: 0
      }
    },
    computed: {
      ifFixed() {
        if (store.state.view == 'settings') return true
        if (store.state.view == 'fresh') return true
        else return false
      },
      viewTitle() {
        if (store.state.view == 'settings') return 'Configuration'
        if (store.state.view == 'add') return 'New‎‎ '
        if (store.state.view == 'tags') return 'Tags Manager'
        else return ''
      },
      appTitle() {
        if (store.state.view == 'settings') return ''
        if (store.state.view == 'tags') return ''
        if (store.state.view == 'add') return 'fishka'
        else return 'Fishki'
      },
      ifBack() {
        if (store.state.view == 'settings') return true
        if (store.state.view == 'single') return true
        if (store.state.view == 'add') return true
        else return false
      },
      ifBackSettings() {
        if (store.state.view == 'tags') return true
        else return false
      }
    },
    mounted() {
      window.addEventListener('scroll', this.onScroll)
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.onScroll)
    },
    methods: {
      onScroll () {
        const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
        if (currentScrollPosition < 0) return
        if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 30) return
        this.showHeader = currentScrollPosition < this.lastScrollPosition
        this.lastScrollPosition = currentScrollPosition
      }
    }
  }
</script>