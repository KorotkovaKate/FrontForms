<template>
  <header class="header">
    <button class="btn btn-outline-primary for-home" @click="router.push('/all_templates')">Forms</button>
    <input
        type="text"
        class="search-input"
        placeholder="Search..."
        v-model="searchQuery"
    />
  </header>
  <div class="admin-panel container">
    <h2>All users</h2>
    <table class="table">
      <thead class="table">
      <tr>
        <th>User Name</th>
        <th>Email</th>
        <th>User Status</th>
        <th class="text-center"></th>
        <th>Role</th>
        <th class="text-center"></th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="user in filteredUsers" :key="user.userId">
      <td>{{ user.userName }}</td>
        <td>{{ user.email }}</td>
        <td>
            <span :class="user.status === 0 ? 'text-primary' : 'text-dark'">
              {{ user.status === 0 ? 'Active' : "Blocked" }}
            </span>
        </td>
        <td class="text-center">
          <button
              class="btn btn-outline-primary my-4"
              :class="user.status === 1 ? 'btn btn-primary' : 'btn btn-dark'"
              @click="toggleBlock(user)"
          >
            {{ user.status === 1 ? 'Activate' : 'Block' }}
          </button>
        </td>
        <td>
            <span :class="user.role === 1 ? 'text-primary' : 'text-dark'">
              {{ user.role === 1 ? "Admin" : "User" }}
            </span>
        </td>
        <td class="text-center">
          <button
              class="btn btn-outline-primary my-4"
              :class="user.role === 0 ? 'btn btn-primary' : 'btn btn-dark'"
              @click="toggleRole(user)"
          >
            {{ user.role === 0 ? 'Admin' : 'User' }}
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup>
import {onMounted, ref} from 'vue'
import axios from 'axios'
import {computed} from 'vue'
import '../styles/AdminPanelStyle.css'
import router from "@/router/index.js";

/**@typedef {Object} User
 @property {bigint} userId
 @property {string} userName
 @property {string} email
 @property {int} role
 @property {int} status
    */

/** @type {User[]} */
let users = ref([]);

const searchQuery = ref('')

onMounted(async () => {

  try {
    const responseGetUsers = await axios.get('http://localhost:5065/User/GetAllUsers')
    console.log("response.data =", responseGetUsers.data)
    users.value = JSON.parse(JSON.stringify(responseGetUsers.data.$values));
    console.log(users);
  }
  catch (error) {
    alert(error.message)
  }
})

const toggleBlock = async (user) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if(user.status === 0){
    try {
      await axios.post('http://localhost:5065/User/BlockUser', user.userId, config)
      alert('Successfully blocked')
      user.status = 1
    }
    catch (error) {
      alert(error.message)
      alert('Error blocked')
    }}
    else{
      try {
        await axios.post('http://localhost:5065/User/ActivateUser',  user.userId, config)
        alert('Successfully activated')
        user.status = 0
      }
      catch (error) {

        alert(error.message)
        alert('Error activated')
      }
    }
}

const toggleRole = async (user) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if(user.role === 0){
    try {
      await axios.post('http://localhost:5065/User/AddUserToAdmin', user.userId, config)
      alert('User added to admins')
      user.role = 1
    }
    catch (error) {
      console.log(error.message)
      alert('Error adding')
    }}
  else{
    try {
      await axios.post('http://localhost:5065/User/RemoveUserFromAdmin', user.userId, config)
      alert('User removed from admins')
      user.role = 0
    }
    catch (error) {

      console.log(error.message)
      alert('Error removing')
    }
  }
}

const filteredUsers = computed(() => {
  if (!Array.isArray(users.value)) return []
  return users.value.filter(user =>
      (user.email ?? "").toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

</script>
