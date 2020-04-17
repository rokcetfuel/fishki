<template>
  <div class="tags-m view">
    
    <div class="tags-m-card">
      <ul class="tags-m-card-content">
        <li class="tags-m-card-line tags-m-card-line-tags">
          <span class="tags-m-card-line-label">Tags</span>
          <span class="tags-m-card-line-error">
            <span v-if="emptyTagError">Tag can't be empty</span>
            <span v-if="tagExistsError">This tag already exists</span>
          </span>
          <span class="tags-m-card-line-content">
            <div class="tags-m-tags">

              <div class="tag tag-new">
                <div class="tag-before-icon">
                  <i class="fas fa-tag"></i>
                </div>
                <div class="tag-inner">
                  <div class="tag-box">
                    <input @focus="clearValidation" v-model="newTag" id="newTagInput" class="tag-box-input tagInput" type="text" placeholder="Add new tag" />
                    <button @click="addTag" class="tag-box-submit">OK</button>
                  </div>
                </div>
              </div>
              
              <div v-if="tags">
                <div class="tag tag-new tag-edit" v-for="(tag, index) in tags" :key="index">
                  <div class="tag-before-icon tag-edit-delete" :class="{ 'tag-edit-delete-open' : tag.remove }">
                    <button @click="openDelete(tag, index)" class="tag-edit-delete-trash">
                      <i class="fas fa-trash"></i>
                    </button>
                    <div class="tag-edit-delete-confirm">
                      <button @click="deleteTag(tag, index)" class="tag-edit-delete-confirm-btn yes">Delete</button>
                      <button @click="closeDelete(tag, index)" class="tag-edit-delete-confirm-btn no">Cancel</button>
                    </div>
                  </div>
                  <div class="tag-inner">
                    <div class="tag-box">
                      <input @focus="watchEditFocus(tag, index)" @blur="watchEditBlur(tag, index)" 
                        v-bind:id="'tag' + tag.id" class="tag-box-input tagInput" type="text" v-model="tag.name" />
                      <button @click="editTag(tag, index)" class="tag-box-submit">OK</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import store from '@/store'
  import VueInputAutowidth from 'vue-input-autowidth'
  Vue.use(VueInputAutowidth)
  const autosizeInput = require('autosize-input')

  export default {
    name: 'TagsManager',
    data: () => { 
      return {
        newTag: '',
        tagsChanged: 0,
        lastEditedTag: '',

        emptyTagError: false,
        tagExistsError: false,
      }
    },
    computed: {
      tags() {
        if (store.state.tags) {
          this.tagsChanged++
          return store.state.tags
        } else return false
      },
    },
    methods: {
      isHover(e) {
        return (e.parentElement.querySelector(':hover') === e)
      },

      clearValidation() {
        this.emptyTagError = false
        this.tagExistsError = false
      },

      openDelete(tag, index) {
        this.clearValidation()
        for (let thisTag of this.tags) thisTag.remove = false
        tag.remove = true
        Vue.set(this.tags, index, tag)
      },

      closeDelete(tag, index) {
        tag.remove = false
        Vue.set(this.tags, index, tag)
      },

      addTag() {
        let allTags = store.state.tags
        let tagSetup = store.state.current.id
        let tagName = this.newTag
        let tagExists = false

        if (tagName == '') {
          this.emptyTagError = true
        } else {
          if (allTags) {
            let allTagsNames = allTags.map((tag) => {return tag.name})
            tagExists = allTagsNames.includes(tagName)
          }

          if (tagExists) {            
            this.tagExistsError = true
          } else {
            this.newTag = ''
            this.clearValidation()
            document.querySelector('#newTagInput').value = ''
            document.querySelector('#newTagInput').blur()
            autosizeInput(document.querySelector('#newTagInput'))
            store.commit('addNewTag', {
              setup: tagSetup,
              name: tagName
            })
          }
        }
      },

      watchEditFocus(tag, index) {
        this.lastEditedTag = tag.name
        this.clearValidation()
      },

      watchEditBlur(tag, index) {
        let indexOfElement = parseInt(index) + 1
        let tagInput = document.getElementsByClassName('tagInput')[indexOfElement]
        let tagOkButton = tagInput.parentNode.getElementsByTagName('button')[0]
        let isOkHovered = this.isHover(tagOkButton)

        if (!isOkHovered) {
          tag.name = this.lastEditedTag
          setTimeout(() => {
            let tagInput2 = document.getElementsByClassName('tagInput')[indexOfElement]
            autosizeInput(tagInput2)
          }, 0)
        }
      },

      editTag(tag, index) {
        let thisIndex = index
        let allTags = store.state.tags.slice()
        let allButThisTag = []
        if (allTags) allButThisTag = allTags.filter((curTag, tagIndex) => tagIndex !== thisIndex)
        let tagSetup = store.state.current.id
        let tagName = tag.name
        let tagId = tag.id
        let tagExists = false

        if (tagName == '') {
          let indexOfElement = parseInt(index) + 1
          tag.name = this.lastEditedTag
          setTimeout(() => {
            let tagInput2 = document.getElementsByClassName('tagInput')[indexOfElement]
            autosizeInput(tagInput2)
            this.emptyTagError = true
          }, 0)
        } else {
          if (allTags) {
            let allTagsNames = allButThisTag.map((tag) => {return tag.name})
            tagExists = allTagsNames.includes(tagName)
          }
          if (tagExists) {            
            let indexOfElement = parseInt(index) + 1
            tag.name = this.lastEditedTag
            setTimeout(() => {
              let tagInput2 = document.getElementsByClassName('tagInput')[indexOfElement]
              autosizeInput(tagInput2)
              this.tagExistsError = true
            }, 0)
          } 
          
          
          else {
            this.clearValidation()
            store.commit('editTag', {
              name: tagName,
              tagid: tagId
            })
          }
        }

        let indexOfElement = parseInt(index) + 1
        let tagInput = document.getElementsByClassName('tagInput')[indexOfElement]
        tagInput.focus()
        tagInput.blur()
      },

      deleteTag(tag, index) {
        let tagid = tag.id
        store.commit('deleteTag', tagid)
      }
    },
    watch: {
      // autosizeInput
      tagsChanged() {
        if (document.getElementsByClassName('tagInput')[1]) {
          for (let inputio of document.getElementsByClassName('tagInput')) autosizeInput(inputio)
        } else if (document.getElementsByClassName('tagInput')[0]) {
          autosizeInput(document.getElementsByClassName('tagInput')[0])
        }
      }
    },
    beforeMount: function () {
      store.commit('setView', 'tags')
    },
  }
</script>
