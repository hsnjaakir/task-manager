<!-- eslint-disable vue/multi-word-component-names -->
<!-- src/views/Auth/Login.vue -->
<template>
  <div class="p-6 max-w-sm mx-auto">
    <h1 class="text-xl font-bold mb-4">Login</h1>

    <form @submit.prevent="handleLogin">
      <div class="mb-2">
        <input v-model="email" type="email" placeholder="Email" class="border p-2 w-full" />
      </div>
      <div class="mb-4">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="border p-2 w-full"
        />
      </div>

      <div class="flex gap-2">
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      </div>

      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // adjust path if not using @ alias

const email = ref('')
const password = ref('')
const error = ref(null)
const router = useRouter()
const authStore = useAuthStore()

async function handleLogin() {
  error.value = null
  try {
    await authStore.login({ email: email.value, password: password.value })
    // logged in — redirect to dashboard
    router.push('/dashboard')
  } catch (err) {
    // show friendly message
    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else if (err.response?.data?.errors) {
      // Laravel validation format
      const first = Object.values(err.response.data.errors)[0]
      error.value = Array.isArray(first) ? first[0] : first
    } else {
      error.value = 'Login failed. Check credentials.'
    }
  }
}
</script>

<style scoped>
/* small styles if needed */
</style>
