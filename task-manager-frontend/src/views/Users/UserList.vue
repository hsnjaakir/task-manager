<template>
  <AuthenticatedLayout>
    <!-- Loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-canvas/60 backdrop-blur-[2px]">
      <div class="w-12 h-12 border-[3px] border-ink-950/10 border-t-brand-500 rounded-full animate-spin"></div>
    </div>

    <div class="flex items-end justify-between gap-4 mb-5">
      <div>
        <h1 class="font-display text-2xl font-semibold tracking-tight">Team</h1>
        <p class="text-sm text-ink-400 mt-1">Everyone with access to Taskline.</p>
      </div>
      <span class="text-xs font-medium text-brand-700 bg-brand-50 rounded-full px-2.5 py-1">
        {{ users.length }} {{ users.length === 1 ? 'member' : 'members' }}
      </span>
    </div>

    <p v-if="error" class="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5 mb-4">
      {{ error }}
    </p>

    <div class="bg-white rounded-2xl border border-ink-950/8 shadow-[0_1px_2px_rgba(11,17,32,0.05)] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="text-[11px] uppercase tracking-wider text-ink-400 border-b border-ink-950/8">
              <th class="px-5 py-3.5 font-medium">Member</th>
              <th class="px-5 py-3.5 font-medium hidden sm:table-cell">Email</th>
              <th class="px-5 py-3.5 font-medium">Role</th>
              <th class="px-5 py-3.5 font-medium text-right">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
              class="border-b border-ink-950/5 last:border-0 hover:bg-brand-50/40 transition-colors"
            >
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <UserAvatar :name="user.name" />
                  <div class="leading-tight">
                    <p class="font-medium text-ink-950">{{ user.name }}</p>
                    <p class="text-xs text-ink-400 sm:hidden">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5 text-ink-700 hidden sm:table-cell">{{ user.email }}</td>
              <td class="px-5 py-3.5">
                <span
                  class="text-xs font-medium rounded-full px-2.5 py-1 capitalize"
                  :class="user.role === 'admin' ? 'bg-brand-50 text-brand-700' : 'bg-emerald-50 text-emerald-700'"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-right">
                <router-link
                  :to="{ name: 'user.details', params: { id: user.id } }"
                  class="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium rounded"
                >
                  View
                  <svg viewBox="0 0 14 14" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3.5L8.5 7 5 10.5"/></svg>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!users.length && !isLoading" class="p-10 text-center">
        <p class="font-medium text-ink-950 text-sm">No team members found</p>
        <p class="text-ink-400 text-sm mt-1">New accounts will appear here once they register.</p>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { fetchUsers } from '@/services/userService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import UserAvatar from '@/components/UserAvatar.vue'

const auth = useAuthStore()
const users = ref([])
const isLoading = ref(false)
const error = ref(null)

onMounted(async () => {
  if (auth.user?.role === 'admin') {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await fetchUsers(auth)
      users.value = data
    } catch (e) {
      error.value = 'Could not load the team list. Refresh to try again.'
      console.error('Failed to fetch users', e)
    } finally {
      isLoading.value = false
    }
  }
})
</script>
