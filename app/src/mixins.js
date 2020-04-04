import Vue from 'vue'
import { YANDEX_URL } from './config.js'

Vue.mixin({
    methods: {
        getTranslation(text, lang) {
            fetch(`${YANDEX_URL}&text=${text}&lang=${lang}`).then((response) => {return response.json()})
            .then((data) => {
                let result = data.text[0]
                console.log(result)
                return result
            })
            .catch((error) => {
                console.error('Could not get translation... ', error);
            });
        }
    }
});