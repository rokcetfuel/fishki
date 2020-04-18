import Vue from 'vue'
import VueRouter from 'vue-router'

import Settings from '@/views/Settings.vue'
import AddFishka from '@/views/AddFishka.vue'
import TagsManager from '@/views/TagsManager.vue'
import Home from '@/views/Home.vue'
import EditFishka from '@/views/EditFishka.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home', 
    component: Home,
  },
  { 
    path: '/fishka/:id', 
    name: 'Fishka', 
    component: EditFishka, 
    props: true 
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/add',
    name: 'Add fish',
    component: AddFishka
  },
  {
    path: '/tags',
    name: 'Tags Manager',
    component: TagsManager
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
