<template>
  <div class="container-fluid">
    <div class = "auth-container">
      <h2>Authorization</h2>

      <form @submit.prevent = "submitForm">
        <input type="text" name="email" v-model="formData.email" placeholder="Enter email" required>
        <input type="password" name="password" v-model="formData.password" placeholder="Enter password" required/>
        <button type="submit">Confirm</button>
      </form>

      <router-link to="/reg">
        <button class="switch-btn">Go to registration page</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import '../styles/AuthRegPage.css'
import router from "@/router/index.js";
import RegistrationPage from "@/Pages/RegistrationPage.vue";

const formData = ref({
  email: '',
  password: ''
});

const submitForm = async () => {
  try
  {
    const response = await axios.post('https://localhost:7165/User/Authorize', {
      email: formData.value.email,
      password: formData.value.password,
    });

    const token = response.data;

    sessionStorage.setItem('token', token);

    alert('User authorized:');

    router.push('/all_templates');
  } catch (error) {
    alert('Login failed, please try again!');
  }
};
</script>