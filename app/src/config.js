/**
 * Yandex API
 * @link https://tech.yandex.com/translate/doc/dg/reference/translate-docpage
 */

import { YANDEX_KEY } from '@/secret'
export const YANDEX_URL = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + YANDEX_KEY

/** 
 * Supported languages
 * @link https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/
 */

export const phraseLanguages = [
    {'code': 'de', 'label': 'German'},
    {'code': 'en', 'label': 'English'},
    {'code': 'es', 'label': 'Spanish'},
    {'code': 'fr', 'label': 'French'},
    {'code': 'pl', 'label': 'Polish'},
    {'code': 'zh', 'label': 'Chinese'}
]

export const translationLanguages = [
    {'code': 'en', 'label': 'English'},
    {'code': 'pl', 'label': 'Polish'}
]

/**
 * Database
 */

import Dexie from 'dexie'

const db = new Dexie('fishki')

db.version(1).stores({
	current: 'id, code',
	setups: '++id, code, name, prono',
    fish: '++id, phrase, trans, prono, tags, date, edit, setup',
    tags: '++id, name, fish, setup'
})

export { db }