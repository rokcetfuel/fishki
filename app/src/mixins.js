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
    },
    getQuote() {
      return new Promise((resolve, reject) => {
        fetch(`https://quote-garden.herokuapp.com/api/v2/quotes/random`)
        .then((response) => response.json())
        .then((data) => {
          let result = data.quote
          resolve(result)
        })
        .catch((error) => {
          console.error('Could not get quote... ', error)
          resolve(false)
        })
      })
    }
  }
})
