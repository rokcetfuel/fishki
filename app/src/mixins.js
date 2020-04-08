import Vue from 'vue'
import { YANDEX_URL } from './config.js'

Vue.mixin({
  methods: {
    getTranslation(text, lang) {
      return new Promise((resolve, reject) => {
        fetch(`${YANDEX_URL}&text=${text}&lang=${lang}`).then((response) => {return response.json()})
        .then((data) => {
          let result = data.text[0]
          resolve(result)
        })
        .catch((error) => {
          console.error('Could not get translation... ', error)
          resolve(false)
        })
      })
    }
  }
})
