<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top Navbar -->
    <header class="bg-indigo-200 shadow">
      <div class="mx-auto px-4 py-4 flex justify-between items-center">
        <!-- User Info -->
        <div v-if="auth.user">
          <h2 class="text-lg font-semibold text-gray-700 mb-4">
            {{ auth.user?.name || 'User' }}
          </h2>
          <div v-if="auth.error" class="mt-3 text-red-500">{{ auth.error }}</div>
          <div v-if="!auth.user && !auth.loading" class="mt-3 text-gray-500">Not signed in</div>
        </div>
        <div v-else><h1 class="text-black">Task Manager</h1></div>
        <div class="flex gap-6">
          <nav class="flex items-center space-x-4">
            <!-- Dashboard link: hide if current route is /dashboard -->
            <router-link
              v-if="route.path !== '/dashboard' && auth.user"
              to="/dashboard"
              class="block px-3 py-2 rounded hover:bg-gray-700 hover:text-white"
            >
              Dashboard
            </router-link>

            <!-- Users link: show only if admin AND not on /users -->
            <router-link
              v-if="auth.user?.role === 'admin' && route.path !== '/users'"
              to="/users"
              class="block px-3 py-2 rounded hover:bg-gray-700 hover:text-white"
            >
              Users
            </router-link>
          </nav>
          <button
            v-if="auth.user"
            @click="handleLogout"
            :disabled="auth.loading"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            <span v-if="auth.loading">Logging out...</span>
            <span v-else>Logout</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute() // <-- current route info

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>
