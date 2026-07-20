<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <AuthShell>
    <h2 class="font-display text-2xl font-semibold tracking-tight">Welcome back</h2>
    <p class="text-sm text-ink-400 mt-1 mb-7">Log in to pick up where you left off.</p>

    <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
      <div>
        <label for="email" class="block text-sm font-medium text-ink-800 mb-1.5">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          autocomplete="email"
          placeholder="you@example.com"
          class="w-full rounded-xl border border-ink-950/15 bg-white px-3.5 py-2.5 text-sm placeholder:text-ink-400/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-ink-800 mb-1.5">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          autocomplete="current-password"
          placeholder="••••••••"
          class="w-full rounded-xl border border-ink-950/15 bg-white px-3.5 py-2.5 text-sm placeholder:text-ink-400/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
        />
      </div>

      <button
        type="submit"
        :disabled="auth.loading"
        class="mt-2 w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-700 text-white font-medium py-2.5 rounded-xl shadow-[0_2px_10px_rgba(39,67,211,0.35)] disabled:opacity-60 transition-colors"
      >
        {{ auth.loading ? 'Logging in…' : 'Log in' }}
      </button>
    </form>

    <p v-if="auth.error" class="mt-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5">
      {{ auth.error }}
    </p>

    <p class="text-center text-sm text-ink-400 mt-7">
      New here?
      <router-link to="/register" class="text-brand-600 font-medium hover:underline rounded">Create an account</router-link>
    </p>
  </AuthShell>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AuthShell from '@/layouts/AuthShell.vue'

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
