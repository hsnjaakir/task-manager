<!-- eslint-disable vue/multi-word-component-names -->
<!-- src/views/Auth/Dashboard.vue -->
<template>
  <div class="max-w-md mx-auto p-6 bg-white shadow rounded">
    <h2 class="text-2xl font-bold mb-4">Dashboard</h2>

    <div v-if="auth.user">
      <p><strong>Name:</strong> {{ auth.user.name }}</p>
      <p><strong>Email:</strong> {{ auth.user.email }}</p>
      <p><strong>Role:</strong> {{ auth.user.role }}</p>
    </div>

    <button @click="handleLogout" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">
      Logout
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()

onMounted(async () => {
  if (!auth.user && auth.token) {
    try {
      await auth.fetchUser()
    } catch (e) {
      console.error('Failed to fetch user', e)
      auth.localLogout()
      router.push('/login')
    }
  }
})

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>
