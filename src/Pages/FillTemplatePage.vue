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
  </header>>
  <div class="container col-6 mt-5" v-if="template">

    <div class="card p-4 shadow-sm mb-4 bg-light">
      <h2>{{ template.title }}</h2>
      <p class="text-muted mb-0" v-if="template.description">{{ template.description }}</p>
    </div>

    <form @submit.prevent="submitForm">
      <div
          v-for="(question, index) in templateQuestions"
          :key="question.id"
          class="card my-3 p-3 shadow-sm"
      >
        <h5 class="mb-3">{{ index + 1 }}. {{ question.title }}</h5>

        <input
            v-if="question.type === 0"
            v-model="userAnswers[index].textValue"
            class="form-control"
            placeholder="Short answer..."
            required
        />

        <textarea
            v-if="question.type === 1"
            v-model="userAnswers[index].textValue"
            class="form-control"
            rows="3"
            placeholder="Long answer..."
            required
        ></textarea>

        <input
            v-if="question.type === 2"
            v-model.number="userAnswers[index].textValue"
            type="number"
            class="form-control"
            placeholder="Enter number..."
            required
        />

        <div v-if="question.type === 3" class="mt-2">
          <div
              v-for="(opt, oIdx) in question.options?.$values || question.options || []"
              :key="oIdx"
              class="form-check my-2"
          >
            <input
                type="radio"
                :id="`q-${question.id}-o-${oIdx}`"
                :name="`question-group-${question.id}`"
                :value="opt.value"
                v-model="userAnswers[index].textValue"
                class="form-check-input"
                required
            />
            <label class="form-check-label" :for="`q-${question.id}-o-${oIdx}`">
              {{ opt.value }}
            </label>
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-success my-4 w-100 py-2">Submit Answers</button>
    </form>
  </div>

  <!-- Экран загрузки, пока данные не пришли с бэкенда -->
  <div v-else class="text-center mt-5">
    <div class="spinner-border text-primary" role="status"></div>
    <p class="mt-2 text-muted">Loading template...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const template = ref(null)
const templateQuestions = ref([])
const userAnswers = ref([])

onMounted(async () => {
  try {
    const templateId = route.params.id
    const response = await axios.get(`http://localhost:5065/Template/GetTemplateById/${templateId}`)

    template.value = response.data

    templateQuestions.value = response.data.questions?.$values || response.data.questions || []

    userAnswers.value = templateQuestions.value.map(q => ({
      questionId: q.id,
      textValue: ''
    }))
  } catch (err) {
    console.error("Failed to load template:", err)
    alert("Template not found or server error")
  }
})

const submitForm = async () => {
  const rawUserId = sessionStorage.getItem('userId')
  if (!rawUserId) {
    alert('Please log in to submit this form.')
    return
  }

  const payload = {
    submitterId: parseInt(rawUserId, 10),
    templateId: route.params.id,
    answers: userAnswers.value.map(ans => ({
      questionId: ans.questionId,
      value: ans.textValue !== null && ans.textValue !== undefined ? ans.textValue.toString() : ''
    }))
  }


  try {
    await axios.post('http://localhost:5065/Form/CreateForm', payload)
    alert('Answers successfully submitted!')
    router.push('/all_templates')
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Validation error from backend:", error.response.data)
    } else {
      console.error("Error submitting form:", error)
    }
    alert('Failed to submit form. Check console for details.')
  }
}
</script>