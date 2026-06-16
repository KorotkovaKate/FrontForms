<template>
  <header class="header">
    <button class="btn btn-outline-primary for-home" @click="router.push('/all_templates')">Forms</button>
  </header>
  <div class="container col-6" v-if="template">
    <div class="card m-2 p-2 shadow-sm bg-light">
      <h2>{{ template.title }}</h2>
      <p class="text-muted p-2">{{ template.description }}</p>
    </div>

    <div class="questions-preview m-2 p-2">
      <h4>Questions in this template ({{ templateQuestions.length }}):</h4>
      <div
          v-for="(q, idx) in templateQuestions"
          :key="idx"
          class="border-bottom p-2"
      >
        <strong>{{ idx + 1 }}. {{ q.title }}</strong>
        <span class="text-muted m-2">({{ mapEnumToTypeStr(q.type) }})</span>
      </div>
    </div>

    <div class="d-flex gap-3 m-2">
      <button class="btn btn-primary flex-grow-1" @click="goToFill">
        Take survey
      </button>
      <button class="btn btn-outline-success flex-grow-1" @click="goToCopyAndEdit">
        Copy & Edit Template
      </button>
    </div>

    <div class="comments-section m-2 card p-2 shadow-sm">
      <h4 class="m-2">Comments</h4>
      <div>
        <textarea
            v-model="newCommentText"
            class="form-control"
            rows="3"
            placeholder="Write a comment..."
        ></textarea>
        <button
            class="btn btn-primary m-2"
            @click="sendComment"
            :disabled="!newCommentText.trim()"
        >
          Send Comment
        </button>
      </div>

      <div v-if="comments.length > 0" class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="border-bottom p-2">
          <div class="d-flex justify-content-between m-2">
            <span class="fw-bold text-primary">{{ comment.userName }}</span>
            <small class="text-muted">{{ formatDate(comment.publishTime) }}</small>
          </div>
          <p class="mb-0 text-dark" style="white-space: pre-wrap;">{{ comment.commentText }}</p>
        </div>
      </div>
      <div v-else class="text-muted text-center p-2">
        No comments yet. Be the first to leave a comment!
      </div>
    </div>
  </div>

  <div v-else class="text-center mt-5">
    <div class="spinner-border text-primary" role="status"></div>
    <p class="mt-2">Loading template info...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import '../styles/PreviewStyle.css'

const route = useRoute()
const router = useRouter()

const template = ref(null)
const templateQuestions = ref([])

const comments = ref([])
const newCommentText = ref('')

const loadComments = async () => {
  try {
    const templateId = route.params.id
    const response = await axios.get(`http://localhost:5065/Comment/GetCommentsByTemplateId/${templateId}`)

    console.log(response)
    comments.value = response.data?.$values || response.data || []
  } catch (err) {
    if (err.response?.status === 404) {
      comments.value = []
    } else {
      console.error("Failed to load comments:", err)
    }
  }
}

onMounted(async () => {
  try {
    const templateId = route.params.id
    const response = await axios.get(`http://localhost:5065/Template/GetTemplateById/${templateId}`)
    template.value = response.data
    templateQuestions.value = response.data.questions?.$values || response.data.questions || []
    await loadComments()
  } catch (err) {
    console.error(err)
    alert("Failed to load template details.")
  }
})

const sendComment = async () => {
  const rawUserId = sessionStorage.getItem('userId')
  if (!rawUserId) {
    alert('Please log in to leave comments.')
    return
  }

  const payload = {
    userId: parseInt(rawUserId, 10),
    templateId: parseInt(route.params.id, 10),
    text: newCommentText.value.trim()
  }

  try {
    await axios.post('http://localhost:5065/Comment/AddComment', payload)

    newCommentText.value = ''
    await loadComments()
  } catch (err) {
    console.error(err)
    alert('Failed to send comment. Please try again.')
  }
}

const goToFill = () => {
  router.push(`/fill_form/${template.value.id}`)
}

const goToCopyAndEdit = () => {
  router.push(`/create_template?sourceId=${template.value.id}`)
}

const mapEnumToTypeStr = (typeEnum) => {
  switch (typeEnum) {
    case 0: return 'short';
    case 1: return 'text';
    case 2: return 'integer';
    case 3: return 'choice';
    default: return 'short';
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>
