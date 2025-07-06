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
        <th>User Status</th>
        <th class="text-center"></th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="user in filteredUsers" :key="user.id">
      <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
        <td>
            <span :class="user.blocked ? 'text-primary' : 'text-dark'">
              {{ user.blocked ? 'Blocked' : 'Active' }}
            </span>
        </td>
        <td class="text-center">
          <button
              class="btn"
              :class="user.blocked ? 'btn-primary' : 'btn-dark'"
              @click="toggleBlock(user)"
          >
            {{ user.blocked ? 'Activate' : 'Block' }}
          </button>
        </td>
        <td>
            <span :class="user.role === 'admin' ? 'text-primary' : 'text-dark'">
              {{ user.role === 'admin' ? 'Admin' : 'User' }}
            </span>
        </td>
        <td class="text-center">
          <button
              class="btn"
              :class="user.role === 'admin' ? 'btn-primary' : 'btn-dark'"
              @click="toggleRole(user)"
          >
            {{ user.role === 'admin' ? 'Admin' : 'User' }}
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import {computed} from 'vue'
import '../styles/AdminPanelStyle.css'

const searchQuery = ref('')

const users = ref([
  { id: 1, name: 'Kate', email: 'kate@example.com', blocked: false, role: 'user' },
  { id: 2, name: 'Julia', email: 'julia@example.com', blocked: true, role: 'admin' },
  { id: 3, name: 'Zhenya', email: 'zhenya@example.com', blocked: false, role: 'user' },
  { id: 4, name: 'Kate', email: 'kate@example.com', blocked: false, role: 'user' },
  { id: 5, name: 'Julia', email: 'julia@example.com', blocked: true, role: 'admin' },
  { id: 6, name: 'Zhenya', email: 'zhenya@example.com', blocked: false, role: 'user' },
  { id: 7, name: 'Kate', email: 'kate@example.com', blocked: false, role: 'user' },
  { id: 8, name: 'Julia', email: 'julia@example.com', blocked: true, role: 'admin' },
  { id: 9, name: 'Zhenya', email: 'zhenya@example.com', blocked: false, role: 'user' },
  { id: 10, name: 'Kate', email: 'kate@example.com', blocked: false, role: 'user' },
  { id: 11, name: 'Julia', email: 'julia@example.com', blocked: true, role: 'admin' },
  { id: 12, name: 'Zhenya', email: 'zhenya@example.com', blocked: false, role: 'user' },

  // Удалим дубли для чистоты
])

const toggleBlock = (user) => {
  user.blocked = !user.blocked
}

const toggleRole = (user) => {
  user.role = user.role === 'admin' ? 'user' : 'admin'
}

const filteredUsers = computed(() =>
    users.value.filter(user =>
        user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    ))
</script>
