<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <AuthShell>
    <h2 class="font-display text-2xl font-semibold tracking-tight">Create your account</h2>
    <p class="text-sm text-ink-400 mt-1 mb-7">Start organizing your work in minutes.</p>

    <form class="flex flex-col gap-4" @submit.prevent="handleRegister">
      <div>
        <label for="name" class="block text-sm font-medium text-ink-800 mb-1.5">Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          autocomplete="name"
          placeholder="Your full name"
          class="w-full rounded-xl border border-ink-950/15 bg-white px-3.5 py-2.5 text-sm placeholder:text-ink-400/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
        />
      </div>

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

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="password" class="block text-sm font-medium text-ink-800 mb-1.5">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            autocomplete="new-password"
            placeholder="••••••••"
            class="w-full rounded-xl border border-ink-950/15 bg-white px-3.5 py-2.5 text-sm placeholder:text-ink-400/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
          />
        </div>
        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-ink-800 mb-1.5">Confirm</label>
          <input
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            required
            autocomplete="new-password"
            placeholder="••••••••"
            class="w-full rounded-xl border border-ink-950/15 bg-white px-3.5 py-2.5 text-sm placeholder:text-ink-400/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
          />
        </div>
      </div>

      <button
        type="submit"
        :disabled="auth.loading"
        class="mt-2 w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-700 text-white font-medium py-2.5 rounded-xl shadow-[0_2px_10px_rgba(39,67,211,0.35)] disabled:opacity-60 transition-colors"
      >
        {{ auth.loading ? 'Creating account…' : 'Create account' }}
      </button>
    </form>

    <p v-if="auth.error" class="mt-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5">
      {{ auth.error }}
    </p>

    <p class="text-center text-sm text-ink-400 mt-7">
      Already have an account?
      <router-link to="/login" class="text-brand-600 font-medium hover:underline rounded">Log in</router-link>
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
