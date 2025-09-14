<!-- eslint-disable vue/multi-word-component-names -->
// eslint-disable-next-line vue/multi-word-component-names
<template>
  <div class="max-w-md mx-auto p-6 bg-white shadow rounded">
    <h2 class="text-2xl font-bold mb-4">Register</h2>

    <form @submit.prevent="handleRegister">
      <input v-model="form.name" type="text" placeholder="Name" class="input mb-2" />
      <input v-model="form.email" type="email" placeholder="Email" class="input mb-2" />
      <input v-model="form.password" type="password" placeholder="Password" class="input mb-2" />
      <input
        v-model="form.password_confirmation"
        type="password"
        placeholder="Confirm Password"
        class="input mb-2"
      />

      <button type="submit" class="btn-primary w-full">Register</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

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
    router.push('/dashboard') // redirect after success
  } catch (error) {
    console.error('Register failed', error)
  }
}
</script>

<style>
/* .input {
  @apply w-full p-2 border rounded;
}
.btn-primary {
  @apply bg-blue-500 text-white py-2 rounded;
} */
</style>
