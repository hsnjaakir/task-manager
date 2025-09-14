<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>

      <form @submit.prevent="handleLogin">
        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          class="w-full p-2 border rounded mb-3 focus:outline-none focus:ring focus:border-blue-300"
        />

        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          class="w-full p-2 border rounded mb-4 focus:outline-none focus:ring focus:border-blue-300"
        />

        <button
          type="submit"
          :disabled="auth.loading"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded flex justify-center items-center"
        >
          <span>{{ auth.loading ? 'Logging in...' : 'Login' }}</span>
        </button>
      </form>
      <p v-if="auth.error" class="text-red-500 mt-3">{{ auth.error }}</p>

      <p class="text-center text-sm text-gray-600 mt-4">
        Don’t have an account?
        <router-link to="/register" class="text-blue-500 hover:underline">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const handleLogin = async () => {
  try {
    await auth.login(form)
    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed', error)
  }
}
</script>
