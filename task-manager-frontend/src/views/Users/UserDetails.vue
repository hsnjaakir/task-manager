<template>
  <AuthenticatedLayout>
    <!-- Loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-canvas/60 backdrop-blur-[2px]">
      <div class="w-12 h-12 border-[3px] border-ink-950/10 border-t-brand-500 rounded-full animate-spin"></div>
    </div>

    <router-link
      :to="{ name: 'user.list' }"
      class="inline-flex items-center gap-1.5 text-sm font-medium text-ink-400 hover:text-ink-950 transition-colors rounded mb-5"
    >
      <svg viewBox="0 0 14 14" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3.5L5.5 7 9 10.5"/></svg>
      Back to team
    </router-link>

    <p v-if="error" class="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5 mb-4">
      {{ error }}
    </p>

    <template v-if="user">
      <!-- Profile card -->
      <section class="bg-white rounded-2xl border border-ink-950/8 shadow-[0_1px_2px_rgba(11,17,32,0.05)] p-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <UserAvatar :name="user.name" size="lg" />
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2.5 flex-wrap">
            <h1 class="font-display text-xl font-semibold tracking-tight truncate">{{ user.name }}</h1>
            <span
              class="text-xs font-medium rounded-full px-2.5 py-1 capitalize"
              :class="user.role === 'admin' ? 'bg-brand-50 text-brand-700' : 'bg-emerald-50 text-emerald-700'"
            >
              {{ user.role }}
            </span>
          </div>
          <p class="text-sm text-ink-400 mt-1">{{ user.email }}</p>
        </div>
        <div class="flex gap-6 sm:gap-8 sm:text-right">
          <div>
            <p class="font-display text-xl font-semibold">{{ tasks.length }}</p>
            <p class="text-[11px] uppercase tracking-wider text-ink-400">Tasks</p>
          </div>
          <div>
            <p class="font-display text-xl font-semibold text-emerald-600">{{ completedCount }}</p>
            <p class="text-[11px] uppercase tracking-wider text-ink-400">Done</p>
          </div>
        </div>
      </section>

      <!-- Assigned tasks -->
      <section class="mt-8">
        <div class="flex items-center gap-2.5 mb-3">
          <h2 class="font-display text-base font-semibold tracking-tight">Assigned tasks</h2>
          <span class="text-xs font-medium text-brand-700 bg-brand-50 rounded-full px-2 py-0.5">{{ tasks.length }}</span>
        </div>

        <ul v-if="tasks.length" class="space-y-2">
          <TaskCard v-for="task in tasks" :key="task.id" :task="task" readonly />
        </ul>
        <p v-else class="text-ink-400 text-sm bg-white border border-dashed border-ink-950/15 rounded-xl py-6 text-center">
          Nothing assigned to {{ user.name.split(' ')[0] }} yet. Assign a task from the dashboard.
        </p>
      </section>
    </template>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getUserById } from '@/services/userService'
import { useAuthStore } from '@/stores/auth'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import TaskCard from '@/components/TaskCard.vue'

const route = useRoute()
const auth = useAuthStore()

const user = ref(null)
const tasks = ref([])
const isLoading = ref(false)
const error = ref(null)

const completedCount = computed(() => tasks.value.filter((t) => t.status === 'completed').length)

onMounted(async () => {
  isLoading.value = true
  error.value = null
  try {
    const { data } = await getUserById(route.params.id, auth)
    user.value = data.user
    tasks.value = data.tasks
  } catch (e) {
    error.value = 'Could not load this member. Go back to the team list and try again.'
    console.error('Failed to fetch user details', e)
  } finally {
    isLoading.value = false
  }
})
</script>
