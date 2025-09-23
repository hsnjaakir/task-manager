<template>Hello</template>
<!-- <template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold mb-4">User List</h2>

    <table class="w-full border">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="p-2 border">ID</th>
          <th class="p-2 border">Name</th>
          <th class="p-2 border">Email</th>
          <th class="p-2 border">Role</th>
          <th class="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
          <td class="p-2 border">{{ user.id }}</td>
          <td class="p-2 border">{{ user.name }}</td>
          <td class="p-2 border">{{ user.email }}</td>
          <td class="p-2 border capitalize">{{ user.role }}</td>
          <td class="p-2 border">
            <router-link
              :to="{ name: 'user.details', params: { id: user.id } }"
              class="text-blue-600 hover:underline"
            >
              View Details
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchUsers } from '@/services/userService'

const users = ref([])

onMounted(async () => {
  const { data } = await fetchUsers()
  users.value = data
})
</script> -->
