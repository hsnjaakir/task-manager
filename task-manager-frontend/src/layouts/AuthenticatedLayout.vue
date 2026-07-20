<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top bar -->
    <header class="bg-ink-950 sticky top-0 z-40 shadow-[0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(11,17,32,0.35)]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <router-link :to="auth.user ? '/dashboard' : '/login'" class="rounded-lg">
          <AppLogo light />
        </router-link>

        <nav v-if="auth.user" class="flex items-center gap-1" aria-label="Main">
          <router-link
            to="/dashboard"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="route.path === '/dashboard' ? 'bg-white/10 text-white' : 'text-ink-400 hover:text-white hover:bg-white/5'"
          >
            Dashboard
          </router-link>
          <router-link
            v-if="auth.user?.role === 'admin'"
            to="/users"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="route.path.startsWith('/users') ? 'bg-white/10 text-white' : 'text-ink-400 hover:text-white hover:bg-white/5'"
          >
            Users
          </router-link>
        </nav>

        <div v-if="auth.user" class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-2.5">
            <UserAvatar :name="auth.user.name" />
            <div class="leading-tight">
              <p class="text-sm font-medium text-white">{{ auth.user.name }}</p>
              <p class="text-[11px] uppercase tracking-wide" :class="auth.user.role === 'admin' ? 'text-brand-200' : 'text-ink-400'">
                {{ auth.user.role }}
              </p>
            </div>
          </div>
          <button
            @click="handleLogout"
            :disabled="auth.loading"
            class="whitespace-nowrap text-sm font-medium text-ink-400 hover:text-white border border-white/15 hover:border-white/30 rounded-lg px-3.5 py-2 disabled:opacity-50 transition-colors"
          >
            {{ auth.loading ? 'Logging out…' : 'Log out' }}
          </button>
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <slot />
    </main>

    <footer class="py-6 text-center text-xs text-ink-400">
      Taskline — plan the day, ship the work.
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import AppLogo from '@/components/AppLogo.vue'
import UserAvatar from '@/components/UserAvatar.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>
