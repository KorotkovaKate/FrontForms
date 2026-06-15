<template>
  <header class="header">
    <button class="btn btn-outline-primary for-home" @click="router.push('/all_templates')">Forms</button>
    <input
        type="text"
        class="search-input"
        placeholder="Search..."
        v-model="searchQuery"
    />
    <button class="btn btn-outline-primary for-home" @click="router.push('/all_templates')">Forms</button>
  </header>

  <div class="template-stats container col-6" v-if="template">
    <div class="template-info">
      <div class="text mb-2">{{ template.title }}</div>
      <p class="text-description my-2" v-if="template.description">{{ template.description }}</p>
      <button class="btn btn-success my-3" @click="downloadCSV"> Export Statistics to CSV </button>
    </div>

    <div
        v-for="(question, index) in templateQuestions"
        :key="question.id"
        class="question-block my-2 p-3 card shadow-sm"
    >
      <h5 class="">{{ index + 1 }}. {{ question.title }}</h5>

      <!-- самый частый ответ -->
      <div class="my-2">
        <label class="form-label mb-1">Most common answer:</label>
        <input
            type="text"
            class="form-control bg-light"
            :value="getStatForQuestion(question.id).mostCommonAnswer"
            readonly
        />
      </div>

      <!-- процент ответов -->
      <div class="my-2">
        <label class="form-label mb-1">Answer percentage:</label>
        <input
            type="text"
            class="form-control bg-light"
            :value="getStatForQuestion(question.id).percentage"
            readonly
        />
      </div>
    </div>
  </div>

  <div v-else class="text-center mt-5">
    <div class="spinner-border text-primary" role="status"></div>
    <p class="mt-2 text-muted">Loading analytics...</p>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import '../styles/StatisticStyle.css'

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const template = ref(null)
const templateQuestions = ref([])
const statistics = ref([])

onMounted(async () => {
  try {
    const templateId = 6

    const [templateResponse, statsResponse] = await Promise.all([
      axios.get(`http://localhost:5065/Template/GetTemplateById/${templateId}`),
      axios.get(`http://localhost:5065/Statistic/GetStatisticsByTemplateId/${templateId}`)
    ]);

    template.value = templateResponse.data;
    templateQuestions.value = templateResponse.data.questions?.$values || templateResponse.data.questions || [];

    statistics.value = statsResponse.data?.$values || statsResponse.data || [];

  } catch (error) {
    console.error("Не удалось загрузить данные статистики:", error);
    if (error.response?.status === 404) {
      console.warn("Статистика для данного шаблона еще не создана (нет ответов).");
    } else {
      alert("Error loading template analytics.");
    }
  }
});

const getStatForQuestion = (questionId) => {
  const stat = statistics.value.find(s => s.questionId === questionId || s.QuestionId === questionId);

  if (!stat) {
    return {
      mostCommonAnswer: 'No answers yet',
      percentage: '0%'
    };
  }

  return {
    mostCommonAnswer: stat.mostCommonAnswer || stat.MostCommonAnswer || 'Empty data',
    percentage: `${stat.answerFrequencyInPercent || stat.AnswerFrequencyInPercent || 0}%`
  };
};

const downloadCSV = () => {
  if (!templateQuestions.value.length) return;

  const headers = ['№', 'Question Title', 'Most Common Answer', 'Percentage'];

  const rows = templateQuestions.value.map((question, index) => {
    const stat = getStatForQuestion(question.id); // Наша готовая функция поиска статы

    return [
      index + 1,
      `"${question.title.replace(/"/g, '""')}"`, // Экранируем кавычки в тексте
      `"${stat.mostCommonAnswer.replace(/"/g, '""')}"`,
      `"${stat.percentage}"`
    ];
  });

  const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  const fileName = `${template.value?.title || 'statistics'}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
