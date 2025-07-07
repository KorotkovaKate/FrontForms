<template>
  <div id="app" class="container-fluid">
    <div class="auth-container">
      <h2>Registration</h2>

      <form @submit.prevent = "submitForm">
        <input type="text" name="email" v-model="formData.email" placeholder="Enter email" required>
        <input type="text" name="username" v-model="formData.username" placeholder="Enter username" required>
        <input type="password" name="password" v-model="formData.password" placeholder="Enter password" required/>
        <button type="submit">Confirm</button>
      </form>

      <router-link to="/auth">
        <button class="switch-btn">Go to authorization</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import router from "@/router/index.js";
import '../styles/AuthRegPage.css'

const formData = ref({
  email: '',
  username: '',
  password: ''
});

const submittedData = ref(null);

const submitForm = async () => {
  try {
    const response = await axios.post('https://Forms.somee.com/User/Registrate', {
      email: formData.value.email,
      username: formData.value.username,
      password: formData.value.password
    });

    alert('Registry successful, please, login');

    router.push('/auth');

    submittedData.value = response.data;
  }
  catch (error)
  {
    alert('Registration failed: ' + error.response.data);
  }
};
</script>