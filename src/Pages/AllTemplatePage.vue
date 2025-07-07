<template>
  <header class="header">
    <h2>Forms</h2>
    <input
        type="text"
        class="search-input"
        placeholder="Search..."
        v-model="searchQuery"
    />

    <button class="btn">
      For admin
    </button>
  </header>
  <div class="container all-templates">
    <section class="public-templates my-2">
      <h2>Template example</h2>
      <div class="templates">
        <div
            class="template-card"
            v-for="template in templates"
            :key="template.id">
          <img :src="template.image" alt="template preview" />
          <p>{{ template.title }}</p>
        </div>
      </div>
    </section>
    <section class="my-templates my-2">
      <h2>My templates</h2>
      <div class="forms-list">
        <div
            class="form-card"
            v-for="form in recentForms"
            :key="form.id"
        >
          <img :src="form.image" alt="form thumbnail" />
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
import blankImage from '../assets/template.jpg' // запасной вариант

const searchQuery = ref('')
const templates = ref([])
const recentForms = ref([]) // ← пока вручную или заполни потом

const fetchPublicTemplates = async () => {
  try {
    const response = await axios.get('/api/templates/public') // заменишь на актуальный URL
    templates.value = response.data.map(t => ({
      ...t,
      image: t.image || blankImage // если image отсутствует — используем дефолт
    }))
  } catch (error) {
    console.error('Ошибка при получении публичных шаблонов:', error)
  }
}
onMounted(fetchPublicTemplates)
</script>

