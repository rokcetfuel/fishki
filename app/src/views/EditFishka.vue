<template>
	<div class="home view">
		<div class="home-container">
			<div class="single-fish add" v-if="fishka">
				<div class="add-card">
					<ul class="add-card-content">
						<li class="add-card-line">
							<span class="add-card-line-label">Phrase</span>
							<span class="add-card-line-content">
								<textarea-autosize class="add-input-fake" placeholder="Phrase..." v-model="editedFishka.phrase"/>
							</span>
						</li>
						<li class="add-card-line">
							<span class="add-card-line-label">Translation</span>
							<span class="add-card-line-content">
								<textarea-autosize class="add-input-fake" placeholder="Translation..." v-model="editedFishka.trans"/>
							</span>
						</li>
						<li class="add-card-line">
							<span class="add-card-line-label">Pronounciation</span>
							<span class="add-card-line-content">
								<textarea-autosize class="add-input-fake" placeholder="Pronounciation..."  v-model="editedFishka.prono"/>
							</span>
						</li>
						<li class="add-card-line add-card-line-tags">
							<span class="add-card-line-label">Tags</span>
							<span class="add-card-line-content">
								<div class="add-tags">
									<div class="tag tag-new">
										<div class="tag-inner">
											<div class="tag-box">
												<input class="tag-box-input" id="newTagInput" autocomplete="off" 
													type="text" v-model="newTag" placeholder="New tag?" />
												<button class="tag-box-submit" @click="addNewTag">OK</button>
											</div>
										</div>
									</div>
									<div class="tag" v-for="tag in currentSetupTags" :key= "tag.id">
										<div class="tag-inner">
											<input class="tag-input" :value="tag.id" v-model="editedFishka.tags" type="checkbox"/>
											<div class="tag-box">
												<span>{{tag.name}}</span>
											</div>
										</div>
									</div>
								</div>
							</span>
						</li>
						<li class="add-card-line">
							<span class="add-card-line-content">
							<button @click="saveEditedFish" class="add-card-line-button">Save changes</button>
							</span>
						</li>
					</ul>
				</div>
				<div class="add-card">
					<ul class="add-card-content">
						<li class="add-card-line add-card-line-full">
							<span class="add-card-line-label">Created</span>
							<span class="add-card-line-content">
							{{editedFishka.date.toLocaleDateString()}}
							</span>
						</li>
						<li class="add-card-line add-card-line-full">
							<span class="add-card-line-label">Edited</span>
							<span class="add-card-line-content">
							{{editedFishka.edit.toLocaleDateString()}}
							</span>
						</li>
						<li class="add-card-line">
							<span class="add-card-line-content">
							<button @click="deleteFish" class="add-card-line-button">Delete fishka</button>
							</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import store from '@/store'
import TextareaAutosize from 'vue-textarea-autosize'
Vue.use(TextareaAutosize)
import VueInputAutowidth from 'vue-input-autowidth'
Vue.use(VueInputAutowidth)
const autosizeInput = require('autosize-input')

export default {
	name: 'EditFishka',
	props: ['id'],
	data: () => {
		return {
      newTag: '',
      tagsChanged: 0,
      editedFishka: false
		}
	},
	computed: {
		fishka() {
			if (store.state.fish) {
        let thisFishka = store.state.fish.filter(fishy => fishy.id === parseInt(this.id))
        if (!this.editedFishka) this.editedFishka = { ...thisFishka[0] }
				return thisFishka[0]
			} else return false
		},
		currentSetupTags() {
			if (store.state.tags.length > 0) {
        this.tagsChanged++
				return store.state.tags.slice().reverse()
			} else return false
		}
	},
	methods: {
		saveEditedFish() {
      let fishid = this.id
			let phrase = this.editedFishka.phrase
			let trans = this.editedFishka.trans
			let prono = this.editedFishka.prono
			let tags = this.editedFishka.tags

			store.commit('editFish', {
				phrase: phrase,
				trans: trans,
				prono: prono,
				tags: tags,
				fishid: fishid
			})

			this.$router.push('/')
		},
		deleteFish() {
			let fishid = this.id
			store.commit('deleteFish', fishid)
			this.$router.push('/')
		},
		addNewTag() {
			let allTags = store.state.tags
			let tagSetup = store.state.current.id
			let tagName = this.newTag
			let tagExists = false

			if (allTags) {
				let allTagsNames = allTags.map((tag) => {
					return tag.name
				})
				tagExists = allTagsNames.includes(tagName)
			}

			if (tagExists) {
				console.log('Tag exists already...')
				document.querySelector('#newTagInput').focus()
			} else {
				this.newTag = ''
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
  watch: {
    // autosizeInput
    tagsChanged() {
      if (document.querySelector('#newTagInput')) {
        autosizeInput(document.querySelector('#newTagInput'))
      }
    }
  },
	beforeMount() {
		store.commit('setView', 'single')
  },
  beforeDestroy() {
    // Clear this shit
    console.log(this.editedFishka)
  }
}
</script>