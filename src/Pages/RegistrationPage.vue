<template>
  <div id="app" class="container-fluid">
    <div class="auth-container">
      <h2>Registration</h2>

      <form @submit.prevent = "submitForm">
        <input type="text" name="email" v-model="formData.email" placeholder="Enter email" required>
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

const formData = ref({
  email: '',
  password: ''
});

const submittedData = ref(null);

const submitForm = async () => {
  try {
    const response = await axios.post('https://localhost:7295/User/Registrate', {
      userName: formData.value.email,
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

<style scoped>
body {
  background-color: #292F3F;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  font-family: Arial, sans-serif;
}

.container-fluid {
  background-color: #292F3F;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-container {
  padding: 20px;
  border-radius: 5px;
}

.auth-container h2 {
  margin-bottom: 20px;
  color:#FFFFFF;
  font-family: Abel;
  font-weight: 400;
  font-size: 25px;
  text-align: center;
}

.auth-container form {
  display: flex;
  flex-direction: column;
}

.auth-container .text{
  margin-top: 20px;
  text-align: left;
  font-family: Abel;
  font-weight: 400;
  font-size: 24px;
  line-height: 22px;
  letter-spacing: 0px;
  vertical-align: middle;
  color:#FFFFFF;
}

.auth-container input {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 20px;
  border: 1px solid #818182;
  border-radius: 10px;
  background-color: #292F3F;
  font-size: 20px;
  color:#FFFFFF;
  font-family: Abel;
}

.auth-container button {
  margin-top: 10px;
  padding: 10px;
  border: none;
  background-color: #42566C;
  border-radius: 10px;
  cursor: pointer;
  font-family: Abel;
  font-weight: 400;
  font-size: 20px;
  line-height: 22px;
  letter-spacing: 0px;
  vertical-align: middle;
  color:#FFFFFF;
}

.auth-container button:hover {
  background-color: #2e4053;
}

.switch-btn {
  margin-top: 10px;
  background-color: #0f345c;
  border-radius: 10px;
  width: 100%;
  font-family: Abel;
  font-weight: 400;
  font-size: 20px;
  line-height: 22px;
  letter-spacing: 0px;
  vertical-align: middle;
  color:#FFFFFF;
}

.switch-btn:hover {
  background-color: #182431;
}

</style>