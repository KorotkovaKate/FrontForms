<template>
  <header class="header">
    <h2>Forms</h2>
    <input
        type="text"
        class="search-input"
        placeholder="Поиск..."
        v-model="searchQuery"
    />

    <button class="btn">
      For admin
    </button>
  </header>

  <div class="template-stats container col-6">
    <div class="template-info">
      <div class="text mb-2">{{ template.title }}</div>
      <p class="text-description my-2">{{ template.description }}</p>
    </div>
    <div
        v-for="(question, index) in template.questions"
        :key="index"
        class="question-block my-2"
    >
      <h5 class="">{{ index + 1 }}. {{ question.title }}</h5>

      <div class="">
        <label class="form-label my-2">Most common answer:</label>
        <input
            type="text"
            class="form-control"
            :value="question.mostFrequentAnswer"
            readonly
        />
      </div>

      <div>
        <label class="form-label my-2">Answer percentage</label>
        <input
            type="text"
            class="form-control"
            :value="`${question.answerPercentage}%`"
            readonly
        />
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import '../styles/StatisticStyle.css'

const template = ref({
  title: 'Template example',
  description: 'Tell me who are you',
  questions: [
    {
      title: 'How old are you?',
      mostFrequentAnswer: '24',
      answerPercentage: '68%'
    },
    {
      title: 'Job experience',
      mostFrequentAnswer: 'Smth 2 years',
      answerPercentage: '13%'
    }
  ]
})
</script>
