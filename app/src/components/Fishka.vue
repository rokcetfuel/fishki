<template>
  <div class="fish-container">
    <div class="fish">
      <router-link class="fish-inner" v-bind:to="'/fishka/' + id">
        <div v-if="showPh" class="fish-phrase">
          <span>{{fishka.phrase}}</span>
        </div>
        <div v-if="pronoOn && showPr" class="fish-prono">
          <span>{{fishka.prono}}</span>
        </div>
        <div v-if="showTr" class="fish-trans">
          <span>{{fishka.trans}}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'Fishka',
  props: ['id'],
  computed: {
    fishka() {
      if (store.state.fish) {
        let thisFishka = store.state.fish.filter(fishy => fishy.id === this.id)
        return thisFishka[0]
      }
    },

    pronoOn() {
      if (store.state.prono) return true
    },

    showPh() {
      if (store.state.hiding) {
        let shown = store.state.hiding.slice()
        if (shown.includes(1)) return true
        else return false
      } else return false
    },

    showTr() {
      if (store.state.hiding) {
        let shown = store.state.hiding.slice()
        if (shown.includes(2)) return true
        else return false
      } else return false
    },

    showPr() {
      if (store.state.hiding) {
        let shown = store.state.hiding.slice()
        if (shown.includes(3)) return true
        else return false
      } else return false
    },
  }
}
</script>