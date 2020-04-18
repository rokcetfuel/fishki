import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '@/config'
import '@/mixins'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    init: false,
    view: '',
    current: false,
    setups: false,
    fish: false,
    tags: false,
    sortingOpen: false,
    prono: false,
    sortReverse: true,
    sortBy: {
      'value': 'created', 
      'label': 'Date Created'
    },
    selectedTags: [],
    finalSelectedTags: [],
    quote: false,
    firstQuote: true
  },
  mutations: {

    /* Getting basic state in App Component */
    /* Sets: init, setups, current, prono, fish, tags */
    config(state) {
      db.table('setups').toArray().then((setups) => {
        state.init = true

        if (setups.length > 0) {
          state.setups = setups

          db.table('current').toArray().then((current) => {
            if (current.length > 0) {
              let currentData = {'id': current[0].id, 'code': current[0].code}
              state.current = currentData

              let currentSetup = setups.filter(setup => setup.id === currentData.id)[0]
              state.prono = currentSetup.prono

              db.table('fish').toArray().then((fish) => {
                if (fish.length > 0) {
                  let currentFish = fish.filter(fishka => fishka.setup === currentData.id)
                  if (currentFish.length > 0) state.fish = currentFish
                  else state.fish = []
                } else state.fish = []
              })

              db.table('tags').toArray().then((tags) => {
                if (tags.length > 0) {
                  let currentTags = tags.filter(tag => tag.setup === currentData.id)
                  if (currentTags.length > 0) state.tags = currentTags
                  else state.tags = []
                } else state.tags = []
              })
            } 
          })
        }
      })
    },

    /* Get current view information */
    setView(state, view) {
      state.view = view
    },

    /* Set quote */
    setQuote(state, quote) {
      state.quote = quote
    },

    /* Set first quote */
    setFirstQuoteDone(state, huh) {
      state.firstQuote = huh
    },

    /* Open sorting */
    /* Views: Home */
    setSorting(state, payload) {
      state.sortingOpen = payload
    },

    /* Sort by */
    /* Views: Home */
    sortBy(state, sorting) {
      state.sortBy = sorting
    },

    /* Sort by tags */
    /* Views: Home */
    sortByTags(state, tags) {
      state.selectedTags = tags
    },

    /* Sort by tags */
    /* Views: Home */
    sortByFinalTags(state, tags) {
      state.finalSelectedTags = tags
    },


    /* Reverse Sort */
    /* Views: Home */
    reverseSort(state) {
      state.sortReverse = !state.sortReverse
    },

    /* Add new configuration and set it as default */
    /* Views: Settings */
    addNewSetup(state, payload) {
      let code = payload.code
      let name = payload.name
      let prono = payload.prono

      state.sortBy = {
        'value': 'created', 
        'label': 'Date Created'
      }

      state.selectedTags = []
      state.finalSelectedTags = []

      db.table('setups').add({'code': code, 'name': name, 'prono': prono}).then((id) => {
        db.table('setups').toArray().then((setups) => {state.setups = setups})
        db.table('current').clear().then(() => {
          db.table('current').put({'id': id, 'code': code}).then(() => {
            let currentData = {'id': id, 'code': code}
            state.current = currentData
            state.prono = prono

            db.table('fish').toArray().then((fish) => {
              if (fish.length > 0) {
                let currentFish = fish.filter(fishka => fishka.setup === currentData.id)
                if (currentFish.length > 0) state.fish = currentFish
                else state.fish = []
              } else state.fish = []
            })
  
            db.table('tags').toArray().then((tags) => {
              if (tags.length > 0) {
                let currentTags = tags.filter(tag => tag.setup === currentData.id)
                if (currentTags.length > 0) state.tags = currentTags
                else state.tags = []
              } else state.tags = []
            })
          })
        })
      })
    },

    /* Edit current setup name */
    /* Views: Settings */
    editSetupName(state, payload) {
      let newName = payload.name
      let setup = payload.setup

      db.table('setups').where('id').equals(setup).modify({name: newName}).then(() => {
        let currentSetupPosition = state.setups.map((thatSetup) => {return thatSetup.id}).indexOf(setup)
        state.setups[currentSetupPosition].name = newName
      })
    },

    /* Edit current setup pronounciation */
    /* Views: Settings */
    editSetupProno(state, payload) {
      let newProno = payload.prono
      let setup = payload.setup

      if (newProno == false) {
        if (state.sortBy.value == 'prono') {
          state.sortBy = {'value': 'created', 'label': 'Date Created'}
        } else {
          console.log('ehhhhh')
        }
      }

      db.table('setups').where('id').equals(setup).modify({prono: newProno}).then(() => {
        let currentSetupPosition = state.setups.map((thatSetup) => {return thatSetup.id}).indexOf(setup)
        state.setups[currentSetupPosition].prono = newProno
        state.prono = newProno
      })
    },

    /* Switch / Set new current setup */
    /* Views: Settings */
    switchSetup(state, setup) {
      let newSetup = state.setups.filter(thatSetup => thatSetup.id === setup)[0]
      let newSetupCode = newSetup.code

      state.sortBy = {
        'value': 'created', 
        'label': 'Date Created'
      }

      state.selectedTags = []
      state.finalSelectedTags = []
      
      db.table('current').clear().then(() => {
        db.table('current').put({'id': setup, 'code': newSetupCode}).then(() => {
          let currentData = {'id': setup, 'code': newSetupCode}
          state.current = currentData
          state.prono = newSetup.prono

          db.table('fish').toArray().then((fish) => {
            if (fish.length > 0) {
              let currentFish = fish.filter(fishka => fishka.setup === currentData.id)
              if (currentFish.length > 0) state.fish = currentFish
              else state.fish = []
            }
          })

          db.table('tags').toArray().then((tags) => {
            if (tags.length > 0) {
              let currentTags = tags.filter(tag => tag.setup === currentData.id)
              if (currentTags.length > 0) state.tags = currentTags
              else state.tags = []
            }
          })
        })
      })
    },

    /* Delete current setup */
    /* Views: Settings */
    deleteSetup(state, payload) {
      let setup = payload.setup
      let switchSetup = payload.switchSetup

      state.sortBy = {
        'value': 'created', 
        'label': 'Date Created'
      }

      state.selectedTags = []
      state.finalSelectedTags = []

      db.table('tags').where('setup').equals(setup).delete().then(() => {
        db.table('fish').where('setup').equals(setup).delete().then(() => {
          db.table('setups').where('id').equals(setup).delete().then(() => {
            db.table('setups').toArray().then((setups) => {state.setups = setups})
            db.table('current').clear().then(()=> {
              if (switchSetup) {
                let setup = payload.switchTo
                let newSetup = state.setups.filter(thatSetup => thatSetup.id === setup)
                let newSetupCode = newSetup[0].code
                
                db.table('current').put({'id': setup, 'code': newSetupCode}).then(() => {
                  let currentData = {'id': setup, 'code': newSetupCode}
                  state.current = currentData
        
                  db.table('fish').toArray().then((fish) => {
                    if (fish.length > 0) {
                      let currentFish = fish.filter(fishka => fishka.setup === currentData.id)
                      if (currentFish.length > 0) state.fish = currentFish
                      else state.fish = []
                    }
                  })
        
                  db.table('tags').toArray().then((tags) => {
                    if (tags.length > 0) {
                      let currentTags = tags.filter(tag => tag.setup === currentData.id)
                      if (currentTags.length > 0) state.tags = currentTags
                      else state.tags = []
                    }
                  })
                })
              } else {
                state.setups = false
              }
            })
          })
        })
      })
    },

    /* Add new fishka */
    /* Views: Add Fishka */
    addNewFish(state, payload) {
      let phrase = payload.phrase
      let trans = payload.trans
      let prono = payload.prono
      let tags = payload.tags
      let date = new Date()
      let setup = payload.setup

      db.table('fish').add({
        'setup': setup, 
        'date': date,
        'edit': date,
        'phrase': phrase,
        'trans': trans,
        'prono': prono,
        'tags': tags
      }).then((id) => {
        if (state.fish.length > 0) {
          state.fish.push({
            id: id,
            setup: setup,
            date: date,
            edit: date,
            phrase: phrase,
            trans: trans,
            prono: prono,
            tags: tags
          })
        } else {
          state.fish = [{
            id: id,
            setup: setup,
            date: date,
            edit: date,
            phrase: phrase,
            trans: trans,
            prono: prono,
            tags: tags
          }]
        }
      })
    },

    /* Edit fishka */
    /* Views: Fishka Edit */
    editFish(state, payload) {
      let fishid = parseInt(payload.fishid)
      let edit = new Date()
      let phrase = payload.phrase
      let trans = payload.trans
      let prono = payload.prono
      let tags = payload.tags

      db.table('fish').where('id').equals(fishid).modify({
        edit: edit,
        phrase: phrase,
        trans: trans,
        prono: prono,
        tags: tags
      }).then((id) => {
        let currentFishkaPosition = state.fish.map((thatFish) => {return thatFish.id}).indexOf(fishid)
        state.fish[currentFishkaPosition].edit = edit
        state.fish[currentFishkaPosition].phrase = phrase
        state.fish[currentFishkaPosition].trans = trans
        state.fish[currentFishkaPosition].prono = prono
        state.fish[currentFishkaPosition].tags = tags
      })
    },

    /* Delete fishka */
    /* Views: Fishka Edit */
    deleteFish(state, fishid) {
      let fishajdi = parseInt(fishid)
      db.table('fish').where('id').equals(fishajdi).delete().then(() => {
        let leftFish = state.fish.filter(fishka => fishka.id != fishajdi)
        if (leftFish.length > 0) state.fish = leftFish
        else state.fish = []
      })
    },

    /* Add new empty tag */
    /* Views: Add Fishka, Tags Manager, Fishka Edit */
    addNewTag(state, payload) {
      let name = payload.name
      let setup = payload.setup
      db.table('tags').add({'setup': setup, 'name': name}).then((id) => {
        if (state.tags.length > 0) {
          state.tags.push({
            setup: setup,
            name: name,
            id: id
          })
        } else {
          state.tags = [{
            setup: setup,
            name: name,
            id: id
          }]
        }
      })
    },

    /* Edit tag */
    /* Views: Tags Manager */
    editTag(state, payload) {
      let tagid = payload.tagid
      let newName = payload.name

      db.table('tags').where('id').equals(tagid).modify({name: newName}).then(() => {
        let currentTagPosition = state.tags.map((thatTag) => {return thatTag.id}).indexOf(tagid)
        state.tags[currentTagPosition].name = newName
      })
    },

    /* Delete fishka */
    /* Views: Fishka Edit */
    deleteTag(state, tagid) {
      let tagajdi = parseInt(tagid)
      db.table('tags').where('id').equals(tagajdi).delete().then(() => {
        let leftTags = state.tags.filter(thisTag => thisTag.id != tagajdi)
        if (leftTags.length > 0) state.tags = leftTags
        else state.tags = []
      })
    },

  },
  actions: {
  },
  modules: {
  }
})
