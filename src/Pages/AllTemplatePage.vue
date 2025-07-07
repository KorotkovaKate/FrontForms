<template>
  <header class="header">
    <h2>Forms</h2>
    <input
        type="text"
        class="search-input"
        placeholder="Search..."
        v-model="searchQuery"
    />

    <router-link
        to="/admin_panel"
        class="btn"
        v-if="userRole === 'Admin'">
      For admin
    </router-link>


  </header>
  <div class="container all-templates">
    <section class="public-templates my-2">
      <h2>Template example</h2>
      <div class="templates">
        <div
            class="template-card"
            v-for="template in templates"
            :key="template.id">
          <img :src=blankImage alt="template preview" />
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
        >
          <img :src=blankImage alt="template image" />
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
const recentForms = ref([]) // ← пока вручную или заполни потом

const token = sessionStorage.getItem('token');

/**@typedef {Object} PublicTemplate
 @property {bigint} id
 @property {string} title
 @property {string} imageUlr
 @property {int} countOfLikes
 */

/** @type {PublicTemplate[]} */
let templates = ref([]);

const GetPublicTemplates = async () => {
  try {
    const response = await axios.get('https://localhost:7165/Template/GetAllPublicTemplates')
    templates.value = JSON.parse(JSON.stringify(response.data.$values));
    console.log(templates)
  }
  catch (error) {
    console.error('Not found templates', error)
  }
}
onMounted(GetPublicTemplates)


/**@typedef {Object} AllTemplate
 @property {bigint} id
 @property {string} title
 @property {string} imageUlr
 @property {int} countOfLikes
 @property {int} status
 */

/** @type {AllTemplate[]} */
let allTemplates = ref([]);
const GetMyTemplates = async () => {
  try {
    const response = await axios.post('https://localhost:7165/Template/GetTemplatesByUserId',{userId: Number(sessionStorage.getItem('userId'))})
    allTemplates.value = JSON.parse(JSON.stringify(response.data.$values));
    console.log(allTemplates)
  }
  catch (error) {
    console.error('Not found templates', error)
  }
}
onMounted(GetMyTemplates)

function getUserRoleFromToken() {
  const token = sessionStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.Role || null;
  } catch {
    return null;
  }
}
const userRole = ref(null);

onMounted(() => {
  userRole.value = getUserRoleFromToken();
});

</script>

