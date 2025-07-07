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
              class="btn"
              :class="user.status === 1 ? 'btn-primary' : 'btn-dark'"
              @click="toggleBlock(user)"
          >
            {{ user.status === 1 ? 'Activate' : 'Block' }}
          </button>
        </td>
        <td>
            <span :class="user.role === 0 ? 'text-primary' : 'text-dark'">
              {{ user.role === 0 ? "Admin" : "User" }}
            </span>
        </td>
        <td class="text-center">
          <button
              class="btn"
              :class="user.role === 1 ? 'btn-primary' : 'btn-dark'"
              @click="toggleRole(user)"
          >
            {{ user.role === 1 ? 'Admin' : 'User' }}
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
    const responseGetUsers = await axios.get('https://Forms.somee.com/User/GetAllUsers')
    console.log("response.data =", responseGetUsers.data)
    users.value = JSON.parse(JSON.stringify(responseGetUsers.data.$values));
    console.log(users);
  }
  catch (error) {
    alert(error.message)
  }
})


/*const users = ref([
  { id: 1, name: 'Kate', email: 'kate@example.com', status: 0, role: 0 },
  { id: 2, name: 'Julia', email: 'julia@example.com', status: 1, role: 1 },
  { id: 3, name: 'Zhenya', email: 'zhenya@example.com', status: 0, role: 0 },
  { id: 4, name: 'Kate', email: 'kate@example.com', status: 0, role: 0 },
  { id: 5, name: 'Julia', email: 'julia@example.com', status: 1, role: 1 },
  { id: 6, name: 'Zhenya', email: 'zhenya@example.com', status: 0, role: 0 },
  { id: 7, name: 'Kate', email: 'kate@example.com', status: 0, role: 0 },
  { id: 8, name: 'Julia', email: 'julia@example.com', status: 1, role: 1 },
  { id: 9, name: 'Zhenya', email: 'zhenya@example.com', status: 0, role: 0 },
  { id: 10, name: 'Kate', email: 'kate@example.com', status: 0, role: 0 },
  { id: 11, name: 'Julia', email: 'julia@example.com', status: 1, role: 1 },
  { id: 12, name: 'Zhenya', email: 'zhenya@example.com', status: 0, role: 0 },

])*/

const toggleBlock = (user) => {
  user.status = user.status === 0 ? 1 : 0
}

const toggleRole = (user) => {
  user.role = user.role === 0 ? 1 : 0
}

const filteredUsers = computed(() => {
  if (!Array.isArray(users.value)) return []
  return users.value.filter(user =>
      (user.email ?? "").toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

</script>
