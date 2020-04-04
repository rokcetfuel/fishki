<template>
  <div class="fish">
    <router-link class="fish-inner" v-bind:to="'/fishka/' + id">
      <div class="fish-phrase">
        <span>{{fishka.phrase}}</span>
      </div>
      <div class="fish-prono">
        <span>{{fishka.prono}}</span>
      </div>
      <div class="fish-trans">
        <span>{{fishka.trans}}</span>
      </div>
    </router-link>
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
    }
  }
}
</script>