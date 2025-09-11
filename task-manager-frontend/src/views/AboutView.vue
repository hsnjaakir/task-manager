<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'

const message = ref('')

onMounted(async () => {
  try {
    const response = await api.get('/about') // test endpoint
    message.value = response.data.message
  } catch (error) {
    console.error('API Error:', error)
  }
})
</script>

<template>
  <div>
    <h1>Task Management System</h1>
    <p>Backend Message: {{ message }}</p>
  </div>
</template>
