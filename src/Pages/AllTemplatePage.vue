<template>
  <header class="header">
    <button
        class="btn btn-outline-primary for-home"
        @click="router.push('/all_templates')">
      Forms
    </button>
    <input
        type="text"
        class="search-input"
        placeholder="Search..."
        v-model="searchQuery"
    />
    <button
        class="btn btn-outline-primary"
        @click="router.push('/create_template')">
      New Template
    </button>
    <button
        class="btn btn-outline-primary"
        @click="router.push('/admin_panel')"
        v-if="userRole === 'Admin'">
      For admin
    </button>
    <button
        class="btn btn-outline-primary"
        style="color: red"
        @click="exitFromAccount">
      Exit
    </button>
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
          <!-- 💡 Используем уникальную картинку, если она есть, иначе blankImage -->
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
            @click = "GoToFillTemplatePage(form.id)"
        >

          <img :src="form.imageUlr || blankImage" alt="template image" />
          <div class="form-info">
            <p class="form-title">{{ form.title }}</p>
            <p class="form-date">{{ form.date }}</p>
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

onMounted(() => {
  GetPublicTemplates()
  GetMyTemplates()
  userRole.value = sessionStorage.getItem('userRole')
})
</script>
