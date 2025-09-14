<!-- eslint-disable vue/multi-word-component-names -->
<!-- <template>
  <div class="max-w-md mx-auto p-6 bg-white shadow rounded">
    <h2 class="text-2xl font-bold mb-4">Dashboard</h2>

    <div v-if="auth.loading">Loading user...</div>
    <p v-if="auth.error" class="text-red-500">{{ auth.error }}</p>

    <div v-if="auth.user && !auth.loading">
      <p><strong>Name:</strong> {{ auth.user.name }}</p>
      <p><strong>Email:</strong> {{ auth.user.email }}</p>
    </div>

    <button @click="handleLogout" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">
      <span v-if="auth.loading">Logging out...</span>
      <span v-else>Logout</span>
    </button>
  </div>
</template> -->

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Top Navbar -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-800">Dashboard</h1>
        <button @click="handleLogout" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          <span v-if="auth.loading">Logging out...</span>
          <span v-else>Logout</span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto p-6">
      <div class="bg-white rounded-2xl shadow p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">
          Welcome, {{ auth.user?.name || 'User' }} 🎉
        </h2>
        <p class="text-gray-600">
          This is your dashboard. From here you’ll be able to access and manage tasks once we build
          the Task module.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
  if (!auth.user && auth.token) {
    try {
      await auth.fetchUser()
    } catch (e) {
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
