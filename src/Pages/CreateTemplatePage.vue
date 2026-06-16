<template>
  <header class="header">
    <button class="btn btn-outline-primary for-home" @click="router.push('/all_templates')">Forms</button>
    <h2>Create your template!</h2>
    <button class="btn btn-outline-primary">Publish</button>
  </header>
  <div class="create-template container col-6">
    <input v-model="formTitle" class="form-control" placeholder="Enter template title..." />

    <textarea
        v-model="formDescription"
        class="form-control mt-4"
        placeholder="Description..."
        rows="2"
    ></textarea>

    <select v-model="selectedTheme" class="form-select my-2">
      <option disabled value="">Choose theme</option>
      <option v-for="theme in themeOptions" :key="theme.id" :value="theme.id">
        {{ theme.name }}
      </option>
    </select>


    <div class="create-question-container">
      <div
          v-for="(question, qIndex) in questions"
          :key="qIndex"
          class="question-card position-relative"
      >
        <h5>Question {{ qIndex + 1 }}</h5>
        <button
            class="btn-close position-absolute top-0 end-0"
            @click="removeQuestion(qIndex)"
            aria-label="Delete question"
        ></button>
        <input
            v-model="question.title"
            class="form-control my-2"
            placeholder="Question title..."
        />

        <select v-model="question.type" class="form-select my-2" @change="handleTypeChange(question)">
          <option disabled value="">Choose question type</option>
          <option value="short">short</option>
          <option value="integer">integer</option>
          <option value="choice">choice</option>
          <option value="text">text</option>
        </select>

        <div v-if="question.type === 'choice'">
          <div
              class="input-group my-2"
              v-for="(option, index) in question.options"
              :key="index"
          >
            <input
                v-model="question.options[index]"
                class="form-control my-2"
                :placeholder="`Option ${index + 1}`"
            />
            <button class="btn btn-dark m-2 mx-0" @click="removeOption(question, index)">Delete</button>
          </div>
          <button class="btn btn-outline-primary" @click="addOption(question)">
            + Add option
          </button>
        </div>
      </div>
    </div>

    <button
        class="btn btn-outline-primary"
        :disabled="questions.length >= 16"
        @click="addQuestion"
    >
      + Add question
    </button>

    <button class="btn btn-outline-primary m-2" @click="saveTemplate">
      Save
    </button>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from "axios";
import router from "@/router/index.js";
import '../styles/CreateTemplateStyle.css'

const route = useRoute()

const formTitle = ref('')
const formDescription = ref('')
const questions = ref([])
const selectedTheme = ref('');

const themeOptions = ref([]);

const typeLimits = {
  short: 0,
  integer: 0,
  choice: 0,
  text: 0
}

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5065/Template/GetTemplateThemes');
    themeOptions.value = response.data.$values || [];
  }
  catch (err) {
    console.error("Not found theme:", err.message);
  }

  const sourceId = route.query.sourceId
  if (sourceId) {
    try {
      const sourceResponse = await axios.get(`http://localhost:5065/Template/GetTemplateById/${sourceId}`)
      const sourceData = sourceResponse.data

      formTitle.value = `Copy of ${sourceData.title || ''}`
      formDescription.value = sourceData.description || ''
      selectedTheme.value = sourceData.theme || ''

      const sourceQuestions = sourceData.questions?.$values || sourceData.questions || []

      questions.value = sourceQuestions.map(q => {
        const stringType = mapEnumToTypeStr(q.type)

        typeLimits[stringType]++

        return {
          title: q.title || '',
          type: stringType,
          _type: stringType,
          required: false,
          options: q.type === 3
              ? (q.options?.$values || q.options || []).map(opt => opt.value || '')
              : []
        }
      })
    } catch (err) {
      console.error("Не удалось подгрузить шаблон-донор для копирования:", err)
    }
  }
});

const addQuestion = () => {
  if (questions.value.length >= 16) return

  questions.value.push({
    title: '',
    type: '',
    required: false,
    options: []
  })
}

const removeQuestion = (index) => {
  const removedType = questions.value[index].type
  if (removedType) {
    typeLimits[removedType]--
  }
  questions.value.splice(index, 1)
}

const handleTypeChange = (question) => {
  const previousType = question._type || ''
  if (previousType) {
    typeLimits[previousType]--
  }

  const type = question.type
  if (typeLimits[type] >= 4) {
    alert(`Only 4 questions of one type "${type}"`)
    question.type = previousType
    return
  }

  typeLimits[type]++
  question._type = type
  if (type === 'choice' && question.options.length === 0) {
    question.options = ['']
  } else if (type !== 'choice') {
    question.options = []
  }
}

const addOption = (question) => {
  question.options.push('')
}

const removeOption = (question, index) => {
  if (question.options.length > 1) {
    question.options.splice(index, 1)
  }
}

const saveTemplate = async () => {
  const payload = {
    title: formTitle.value,
    description: formDescription.value,
    theme: parseInt(selectedTheme.value),
    imageUrl: null,
    tags: [],
    status: 0,
    templateCreatorId: parseInt(sessionStorage.getItem('userId')),
    questions: questions.value.map(q => ({
      title: q.title,
      type: mapTypeToEnum(q.type),
      options: q.type === 'choice'
          ? q.options.map(opt => ({ value: opt }))
          : null
    }))
  }

  try {
    const response = await axios.post('http://localhost:5065/Template/CreateTemplate', payload)
    alert('Successfully created template')

    formTitle.value = ''
    formDescription.value = ''
    selectedTheme.value = ''
    questions.value = []
    Object.keys(typeLimits).forEach(k => typeLimits[k] = 0)

    router.push('/all_templates')
  }
  catch (error) {
    console.error(error)
    alert('Template was not created')
  }
}

const mapTypeToEnum = (typeStr) => {
  switch (typeStr) {
    case 'short': return 0;
    case 'text': return 1;
    case 'integer': return 2;
    case 'choice': return 3;
    default: return 0;
  }
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
</script>
