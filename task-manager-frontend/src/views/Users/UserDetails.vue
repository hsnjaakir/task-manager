<template>Hello</template>
<!-- <template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold mb-4">User Details</h2>

    <div v-if="user" class="bg-white shadow rounded p-4 mb-6">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Role:</strong> {{ user.role }}</p>
    </div>

    <h3 class="text-xl font-semibold mb-3">Assigned Tasks</h3>
    <ul v-if="tasks.length > 0" class="list-disc pl-6">
      <li v-for="task in tasks" :key="task.id">
        {{ task.title }} — <span class="text-gray-500">{{ task.status }}</span>
      </li>
    </ul>
    <p v-else class="text-gray-500">No tasks assigned.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { userService } from '@/services/userService'

const route = useRoute()
const user = ref(null)
const tasks = ref([])

onMounted(async () => {
  const { data } = await userService.getUserById(route.params.id)
  user.value = data.user
  tasks.value = data.tasks
})
</script> -->
