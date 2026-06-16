<template>
  <header class="header">
    <button
        class="btn btn-outline-primary for-home"
        @click="router.push('/all_templates')">
      Forms
    </button>
    <div class="button-group">
      <button
          class="btn btn-outline-primary m-1"
          @click="router.push('/create_template')">
        New Template
      </button>
      <button
          class="btn btn-outline-primary m-1"
          @click="router.push('/admin_panel')"
          v-if="userRole === 'Admin'">
        For admin
      </button>
      <button
          class="btn btn-outline-primary m-1"
          @click="exitFromAccount">
        Exit
      </button>
    </div>
  </header>

  <div class="container all-templates">
    <section class="public-templates my-2">
      <h2>Latest public templates</h2>
      <div class="templates">
        <div
            class="template-card"
            v-for="template in templates"
            :key="template.id"
            @click = "GoToPreviewPage(template.id)"
        >
          <img :src="template.imageUlr || blankImage" alt="template preview" />
          <p>{{ template.title }}</p>
        </div>
      </div>
    </section>

    <section class="my-templates my-2">
      <h2>My templates</h2>
      <div class="forms-list">
        <div
            class="form-card"
            v-for="form in allTemplates"
            :key="form.id"
            @click="GoToFillTemplatePage(form.id)"
        >
          <div class="card-container">
            <img :src="form.imageUlr || blankImage" alt="template image" />
            <div class="form-info">
              <div>
                <p class="form-title">{{ form.title }}</p>
                <p class="form-date">{{ form.date }}</p>
              </div>

              <div class="form-actions d-flex gap-1 mt-2">
                <button
                    class="btn btn-sm btn-outline-secondary flex-grow-1"
                    @click.stop="GoToStatisticsPage(form.id)"
                    title="View Statistics"
                >
                  Stats
                </button>
                <button
                    class="btn btn-sm btn-outline-success flex-grow-1"
                    @click.stop="ShareTemplate(form.id)"
                    title="Copy Link to Share"
                >
                  Share
                </button>
              </div>
          </div>

          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import '../styles/AllTemplatesStyle.css'

import blankImage from '../assets/templateIcon.JPG'
import {useRouter} from "vue-router";

const router = useRouter()
const searchQuery = ref('')
const token = sessionStorage.getItem('token')
const userRole = ref(null)

/**@typedef {Object} PublicTemplate
 @property {bigint} id
 @property {string} title
 @property {string} imageUlr
 @property {int} countOfLikes
 */

/** @type {PublicTemplate[]} */
const templates = ref([]);

const GetPublicTemplates = async () => {
  try {
    const response = await axios.get('http://localhost:5065/Template/GetAllPublicTemplates')
    if (response.data && response.data.$values) {
      templates.value = JSON.parse(JSON.stringify(response.data.$values))
    }
  }
  catch (error) {
    console.error('Не удалось загрузить публичные шаблоны', error)
  }
}

/**@typedef {Object} AllTemplate
 @property {bigint} id
 @property {string} title
 @property {string} imageUlr
 @property {int} countOfLikes
 @property {int} status
 @property {string} [date]
 */

/** @type {AllTemplate[]} */
const allTemplates = ref([]);

const GetMyTemplates = async () => {
  try {
    const userId = Number(sessionStorage.getItem('userId'))

    const response = await axios.get(`http://localhost:5065/Template/GetTemplatesByUserId/${userId}`)

    if (response.data && response.data.$values) {
      allTemplates.value = JSON.parse(JSON.stringify(response.data.$values))
    }
  }
  catch (error) {
    console.error('Не удалось загрузить мои шаблоны с сервера', error)
  }
}

const GoToFillTemplatePage = async (id) => {
  router.push(`/fill_form/${id}`)
}

const GoToPreviewPage = async (id) => {
  router.push(`/preview_page/${id}`)
}

const exitFromAccount = () => {
  sessionStorage.clear()

  router.push('/auth')
}

const GoToStatisticsPage = (id) => {
  router.push(`/statistics/${id}`)
}

const ShareTemplate = async (id) => {
  const shareUrl = `${window.location.origin}/fill_form/${id}`

  try {
    await navigator.clipboard.writeText(shareUrl)
    alert('Link copied to clipboard successfully!')
  } catch (error) {
    console.error('Failed to copy link', error)
    alert('Could not copy link automatically. URL: ' + shareUrl)
  }
}

onMounted(() => {
  GetPublicTemplates()
  GetMyTemplates()
  userRole.value = sessionStorage.getItem('userRole')
})
</script>
