<template>
  <AuthenticatedLayout>
    <!-- Loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-canvas/60 backdrop-blur-[2px]">
      <div class="w-12 h-12 border-[3px] border-ink-950/10 border-t-brand-500 rounded-full animate-spin"></div>
    </div>

    <!-- Toasts -->
    <div class="fixed top-20 right-4 sm:right-6 z-[60] space-y-2" aria-live="polite">
      <transition-group name="toast" tag="div" class="space-y-2">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="flex items-center gap-2.5 bg-ink-950 text-white text-sm rounded-xl pl-3.5 pr-4 py-2.5 shadow-[0_8px_24px_rgba(11,17,32,0.35)] max-w-xs"
        >
          <span class="w-2 h-2 rounded-full shrink-0" :class="t.type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'"></span>
          {{ t.message }}
        </div>
      </transition-group>
    </div>

    <div class="flex items-end justify-between gap-4 mb-6">
      <div>
        <h1 class="font-display text-2xl font-semibold tracking-tight">Projects</h1>
        <p class="text-sm text-ink-400 mt-1">Group related tasks and track them together.</p>
      </div>
      <button
        @click="openCreate"
        class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-[0_2px_10px_rgba(39,67,211,0.35)] transition-colors shrink-0"
      >
        <svg viewBox="0 0 14 14" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 2.5v9M2.5 7h9"/></svg>
        New project
      </button>
    </div>

    <p v-if="store.error" class="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5 mb-4">
      {{ store.error }}
    </p>

    <!-- Empty state -->
    <div v-if="!store.projects.length && !isLoading" class="bg-white rounded-2xl border border-dashed border-ink-950/15 py-12 text-center">
      <div class="mx-auto w-11 h-11 grid place-items-center rounded-xl bg-brand-50 text-brand-600 mb-3">
        <svg viewBox="0 0 20 20" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6a2 2 0 012-2h3l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
      </div>
      <p class="font-medium text-ink-950 text-sm">No projects yet</p>
      <p class="text-ink-400 text-sm mt-1">Create your first project to organize tasks.</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <article
        v-for="project in store.projects"
        :key="project.id"
        class="group relative bg-white rounded-2xl border border-ink-950/8 shadow-[0_1px_2px_rgba(11,17,32,0.05)] hover:shadow-[0_4px_14px_rgba(11,17,32,0.08)] hover:border-ink-950/15 transition-all p-5 flex flex-col"
      >
        <div class="flex items-start gap-3">
          <span class="w-3 h-3 rounded-full mt-1.5 shrink-0" :style="{ backgroundColor: project.color }" aria-hidden="true"></span>
          <div class="min-w-0 flex-1">
            <h3 class="font-display font-semibold tracking-tight text-ink-950 truncate">{{ project.name }}</h3>
            <p v-if="project.description" class="text-sm text-ink-400 mt-1 line-clamp-2">{{ project.description }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
            <button
              @click="openEdit(project)"
              class="p-1.5 rounded-lg text-ink-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
              :aria-label="`Edit ${project.name}`"
            >
              <svg viewBox="0 0 16 16" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11.1 2.2a1.6 1.6 0 012.3 2.3L5 12.9l-3 .8.8-3z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button
              @click="removeProject(project)"
              class="p-1.5 rounded-lg text-ink-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              :aria-label="`Delete ${project.name}`"
            >
              <svg viewBox="0 0 16 16" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.5 4h11M6.5 4V2.5h3V4M4 4l.7 9.5h6.6L12 4M6.7 6.8v4.4M9.3 6.8v4.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between mt-4 pt-4 border-t border-ink-950/6">
          <span class="inline-flex items-center gap-1.5 text-xs font-medium text-ink-700">
            <svg viewBox="0 0 16 16" class="w-3.5 h-3.5 text-ink-400" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 8l2 2 3.5-4"/><rect x="2.5" y="2.5" width="11" height="11" rx="2.5"/></svg>
            {{ project.tasks_count }} {{ project.tasks_count === 1 ? 'task' : 'tasks' }}
          </span>
          <router-link
            :to="{ path: '/dashboard', query: { project: project.id } }"
            class="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 rounded"
          >
            View tasks
            <svg viewBox="0 0 14 14" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3.5L8.5 7 5 10.5"/></svg>
          </router-link>
        </div>

        <p v-if="auth.user?.role === 'admin' && project.user" class="text-[11px] text-ink-400 mt-2">
          Owner: {{ project.user.name }}
        </p>
      </article>
    </div>

    <!-- ===== Create / Edit modal ===== -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-[55] flex items-center justify-center bg-ink-950/50 backdrop-blur-[2px] p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl shadow-[0_24px_60px_rgba(11,17,32,0.35)] p-6 w-full max-w-md" role="dialog" aria-modal="true" :aria-label="editingId ? 'Edit project' : 'New project'">
        <h3 class="font-display text-lg font-semibold tracking-tight mb-5">{{ editingId ? 'Edit project' : 'New project' }}</h3>

        <div class="space-y-4">
          <div>
            <label for="projName" class="block text-sm font-medium text-ink-800 mb-1.5">Name</label>
            <input
              id="projName"
              v-model="form.name"
              type="text"
              placeholder="e.g. Website redesign"
              class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm placeholder:text-ink-400/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
            />
          </div>

          <div>
            <label for="projDesc" class="block text-sm font-medium text-ink-800 mb-1.5">
              Description <span class="text-ink-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="projDesc"
              v-model="form.description"
              rows="2"
              placeholder="What's this project about?"
              class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm placeholder:text-ink-400/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition resize-y"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-ink-800 mb-2">Color</label>
            <div class="flex items-center gap-2 flex-wrap">
              <button
                v-for="c in palette"
                :key="c"
                type="button"
                @click="form.color = c"
                class="w-7 h-7 rounded-full transition-transform hover:scale-110"
                :class="form.color === c ? 'ring-2 ring-offset-2 ring-ink-950' : ''"
                :style="{ backgroundColor: c }"
                :aria-label="`Choose color ${c}`"
              ></button>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2.5 mt-6">
          <button
            @click="closeModal"
            class="text-sm font-medium text-ink-800 border border-ink-950/15 hover:bg-ink-950/4 rounded-xl px-4 py-2.5 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="save"
            :disabled="!form.name.trim() || isLoading"
            class="text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-5 py-2.5 shadow-[0_2px_10px_rgba(39,67,211,0.35)] disabled:opacity-50 transition-colors"
          >
            {{ editingId ? 'Save changes' : 'Create project' }}
          </button>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/project'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'

const auth = useAuthStore()
const store = useProjectStore()

const palette = ['#3b55e6', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b']

const isLoading = computed(() => store.loading)

// ---- toasts ----
const toasts = ref([])
let toastId = 1
function showToast(message, type = 'success', timeout = 3500) {
  const id = toastId++
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }, timeout)
}

// ---- modal ----
const showModal = ref(false)
const editingId = ref(null)
const form = reactive({ name: '', description: '', color: palette[0] })

function openCreate() {
  editingId.value = null
  form.name = ''
  form.description = ''
  form.color = palette[0]
  showModal.value = true
}

function openEdit(project) {
  editingId.value = project.id
  form.name = project.name
  form.description = project.description || ''
  form.color = project.color || palette[0]
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function save() {
  const payload = {
    name: form.name.trim(),
    description: form.description.trim() || null,
    color: form.color,
  }
  try {
    if (editingId.value) {
      await store.updateProject(editingId.value, payload)
      showToast('Project updated')
    } else {
      await store.addProject(payload)
      showToast('Project created')
    }
    closeModal()
  } catch {
    showToast(store.error || 'Something went wrong', 'error')
  }
}

async function removeProject(project) {
  if (!confirm(`Delete "${project.name}"? Its tasks will be kept but unassigned from the project.`)) return
  try {
    await store.deleteProject(project.id)
    showToast('Project deleted')
  } catch {
    showToast(store.error || 'Failed to delete project', 'error')
  }
}

onMounted(() => {
  store.fetchProjects()
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
</style>
