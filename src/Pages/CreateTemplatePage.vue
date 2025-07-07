<template>
  <header class="header">
    <h2>Forms</h2>
    <input
        type="text"
        class="search-input"
        placeholder="Search..."
        v-model="searchQuery"
    />

    <button class="btn btn-light">
      For admin
    </button>
  </header>
  <div class="create-template container col-6">
    <input v-model="formTitle" class="form-control mt-4" placeholder="Enter template title..." />

    <textarea
        v-model="formDescription"
        class="form-control mt-4"
        placeholder="Description..."
        rows="2"
    ></textarea>

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
            <button class="btn btn-dark" @click="removeOption(question, index)">Delete</button>
          </div>
          <button class="btn btn-outline-primary" @click="addOption(question)">
            + Add option
          </button>
        </div>

        <div class="form-check form-switch my-2">
          <input
              class="form-check-input"
              type="checkbox"
              v-model="question.required"
              :id="`required-${qIndex}`"
          />
          <label class="form-check-label" :for="`required-${qIndex}`">Required question</label>
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

    <button class="btn btn-success my-4" @click="saveTemplate">
      Сохранить шаблон
    </button>

  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import '../styles/CreateTemplateStyle.css'
import axios from "axios";

const formTitle = ref('')
const formDescription = ref('')
const questions = ref([])

const typeLimits = {
  short: 0,
  integer: 0,
  choice: 0,
  text: 0
}

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
  // Убираем из предыдущего счётчика
  const previousType = question._type || ''
  if (previousType) {
    typeLimits[previousType]--
  }

  // Обновляем счётчик нового типа
  const type = question.type
  if (typeLimits[type] >= 4) {
    alert(`Можно не более 4 вопросов типа "${type}"`)
    question.type = previousType // сбрасываем на прежний
    return
  }

  typeLimits[type]++
  question._type = type // Сохраняем текущий тип
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
    theme: 0,
    imageUrl: null,
    tags: [],
    status: 0,
    templateCreatorId: sessionStorage.getItem('userId'),
    questions: questions.value.map(q => ({
      title: q.title,
      type: mapTypeToEnum(q.type),
      options: q.type === 'choice'
          ? q.options.map(opt => ({ value: opt }))
          : null
    }))
  }

  try {
    const response = await axios.post('https://localhost:7165/Template/CreateTemplate', payload)
    alert('Шаблон успешно создан!')
    formTitle.value = ''
    formDescription.value = ''
    questions.value = []
    Object.keys(typeLimits).forEach(k => typeLimits[k] = 0)
  }
  catch (error) {
    console.error(error)
    alert('Не удалось сохранить шаблон. Проверь консоль для деталей.')
  }
}


onMounted(async () => {

})


const mapTypeToEnum = (typeStr) => {
  switch (typeStr) {
    case 'short': return 0;
    case 'text': return 1;
    case 'integer': return 2;
    case 'choice': return 3;
    default: return 0;
  }
}

</script>
