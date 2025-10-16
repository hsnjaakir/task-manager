<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <AuthenticatedLayout>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="w-full flex flex-col gap-2 max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 class="text-2xl font-bold text-center mb-6">Register</h2>

        <form class="flex flex-col gap-2" @submit.prevent="handleRegister">
          <div class="flex flex-col gap-2">
            <input
              v-model="form.name"
              type="text"
              placeholder="Name"
              class="w-full p-2 border rounded mb-3 focus:outline-none focus:ring focus:border-blue-300"
            />

            <input
              v-model="form.email"
              type="email"
              placeholder="Email"
              class="w-full p-2 border rounded mb-3 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div class="flex flex-col gap-2">
            <input
              v-model="form.password"
              type="password"
              placeholder="Password"
              class="w-full p-2 border rounded mb-3 focus:outline-none focus:ring focus:border-blue-300"
            />

            <input
              v-model="form.password_confirmation"
              type="password"
              placeholder="Confirm Password"
              class="w-full p-2 border rounded mb-4 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <button
            type="submit"
            :disabled="auth.loading"
            class="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded flex justify-center items-center"
          >
            <span>{{ auth.loading ? 'Registering...' : 'Register' }}</span>
          </button>
        </form>
        <p v-if="auth.error" class="text-red-500 mt-3">{{ auth.error }}</p>

        <p class="text-center text-sm text-gray-600 mt-4">
          Already have an account?
          <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link>
        </p>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const handleRegister = async () => {
  try {
    await auth.register(form)
    router.push('/dashboard')
  } catch (error) {
    console.error('Register failed', error)
  }
}
</script>
