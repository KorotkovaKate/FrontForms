<template>
  <div class="container-fluid">
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

    <section class="create-form">
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
    <section class="recent-forms">
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
import { ref } from 'vue';
import '../styles/AllTemplatesStyle.css'
import blankImage from '../styles/template.jpg'

const templates = ref([
  { id: 1, title: 'Пустая форма', image: blankImage },
  { id: 2, title: 'Приглашение на вечеринку', image: blankImage },
  { id: 3, title: 'Контактная информация', image: blankImage },
  { id: 4, title: 'Ответ на приглашение', image: blankImage },
  { id: 5, title: 'Заказ футболки', image: blankImage },
  { id: 6, title: 'Регистрация на мероприятие', image: blankImage },
]);

const recentForms = ref([
  { id: 1, title: 'Контактная информация', image: blankImage, date: '19:02' },
  { id: 2, title: 'Приглашение на вечеринку', image: blankImage, date: '30 мая 2025' },
  { id: 3, title: 'Новая форма', image: blankImage, date: '10 мая 2025' },
  { id: 4, title: 'Контактная информация', image: blankImage, date: '19:02' },
  { id: 5, title: 'Приглашение на вечеринку', image: blankImage, date: '30 мая 2025' },
  { id: 6, title: 'Новая форма', image: blankImage, date: '10 мая 2025' },
  { id: 7, title: 'Контактная информация', image: blankImage, date: '19:02' },
  { id: 8, title: 'Приглашение на вечеринку', image: blankImage, date: '30 мая 2025' },
  { id: 9, title: 'Новая форма', image: blankImage, date: '10 мая 2025' },
]);
</script>

