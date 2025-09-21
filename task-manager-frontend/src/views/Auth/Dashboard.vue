<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable no-unused-vars -->
<template>
  <div class="min-h-screen bg-gray-100 relative">
    <!-- Full-screen Loading Overlay -->
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div
        class="w-14 h-14 border-4 border-white border-t-blue-400 rounded-full animate-spin"
      ></div>
    </div>

    <!-- Toasts (top-right) -->
    <div class="fixed top-6 right-6 z-60 space-y-2">
      <transition-group name="toast" tag="div">
        <div
          v-for="t in toasts"
          :key="t.id"
          :class="[
            'px-4 py-2 rounded shadow-lg text-sm max-w-xs',
            t.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white',
          ]"
        >
          {{ t.message }}
        </div>
      </transition-group>
    </div>

    <!-- Top Navbar -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-800">Dashboard</h1>
        <button
          @click="handleLogout"
          :disabled="auth.loading || taskStore.loading"
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          <span v-if="auth.loading">Logging out...</span>
          <span v-else>Logout</span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto p-6 space-y-6">
      <!-- User Info -->
      <div class="bg-white rounded-2xl shadow p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">
          Welcome, {{ auth.user?.name || 'User' }} 🎉
        </h2>
        <p class="text-gray-600">This is your dashboard. Manage your tasks below.</p>

        <div v-if="auth.error" class="mt-3 text-red-500">{{ auth.error }}</div>
        <div v-if="!auth.user && !auth.loading" class="mt-3 text-gray-500">Not signed in</div>

        <div v-if="auth.user && !auth.loading" class="mt-3 space-y-1 text-sm text-gray-700">
          <p><strong>Name:</strong> {{ auth.user.name }}</p>
          <p><strong>Email:</strong> {{ auth.user.email }}</p>
        </div>
      </div>

      <!-- Task Manager -->
      <div class="bg-white rounded-2xl shadow p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Tasks</h2>

        <!-- Add Task Form -->
        <div class="flex flex-col gap-2 mb-4">
          <input
            v-model="newTaskTitle"
            @keyup.enter="addTask"
            placeholder="Task title"
            class="flex-1 border rounded p-2"
            :disabled="isLoading"
          />

          <!-- Only admins can assign tasks -->
          <div v-if="auth.user?.role === 'admin'" class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1"> Assign to User </label>
            <select
              v-if="auth.user?.role === 'admin'"
              v-model="assignedUserId"
              class="border rounded p-2 w-full"
            >
              <!-- Placeholder option -->
              <option disabled value="">-- Select a user --</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

          <button
            @click="addTask"
            :disabled="!newTaskTitle.trim() || isLoading"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Add
          </button>
        </div>

        <!-- Task List / states -->
        <div
          v-if="
            taskStore.loading &&
            !taskStore.tasks.length &&
            !taskStore.myTasks.length &&
            !taskStore.otherTasks.length
          "
          class="text-gray-500"
        >
          Loading tasks…
        </div>

        <div
          v-else-if="
            !taskStore.tasks.length && !taskStore.myTasks.length && !taskStore.otherTasks.length
          "
          class="text-gray-500"
        >
          No tasks yet.
        </div>

        <!-- Normal user -->
        <!-- What admin to see -->
        <div v-if="auth.user?.role === 'admin'">
          <!-- My Tasks -->
          <h3 class="font-semibold text-lg mt-4 mb-2">My Tasks</h3>
          <ul v-if="taskStore.myTasks.length" class="space-y-2">
            <li
              v-for="task in taskStore.myTasks"
              :key="task.id"
              class="flex items-center justify-between bg-gray-100 p-2 rounded"
            >
              <div class="flex items-center gap-3">
                <!-- <button
                  @click="toggleStatus(task)"
                  :disabled="isLoading"
                  class="w-5 h-5 flex items-center justify-center border rounded"
                  :class="task.status === 'completed' ? 'bg-green-500 text-white' : 'bg-white'"
                  title="Toggle status"
                >
                  <svg
                    v-if="task.status === 'completed'"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button> -->
                <div class="p-2">
                  <select
                    v-model="task.status"
                    @change="toggleStatus(task)"
                    class="border rounded p-1 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div @dblclick="startEdit(task)" class="cursor-pointer">
                  <span>{{ task.title }}</span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button
                  @click="startEdit(task)"
                  class="text-sm text-gray-600 hover:text-gray-800"
                  :disabled="isLoading"
                >
                  Edit
                </button>
                <button
                  @click="removeTask(task.id)"
                  class="text-red-500 hover:text-red-700"
                  :disabled="isLoading"
                >
                  Delete
                </button>
              </div>
            </li>
          </ul>
          <div v-else class="text-gray-500">No tasks assigned to you.</div>

          <!-- Other Tasks -->
          <h3 class="font-semibold text-lg mt-6 mb-2">Other Users' Tasks</h3>
          <ul v-if="taskStore.otherTasks.length" class="space-y-2">
            <li
              v-for="task in taskStore.otherTasks"
              :key="task.id"
              class="flex items-center justify-between bg-gray-100 p-2 rounded"
            >
              <div class="flex items-center gap-3">
                <!-- <button
                  @click="toggleStatus(task)"
                  :disabled="isLoading"
                  class="w-5 h-5 flex items-center justify-center border rounded"
                  :class="task.status === 'completed' ? 'bg-green-500 text-white' : 'bg-white'"
                  title="Toggle status"
                >
                  <svg
                    v-if="task.status === 'completed'"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button> -->
                <!-- <div class="p-2">
                  <select
                    v-model="task.status"
                    @change="toggleStatus(task)"
                    class="border rounded p-1 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div> -->

                <div @dblclick="startEdit(task)" class="cursor-pointer">
                  <span>
                    {{ task?.title }} - <em>{{ task?.user?.name }}</em>
                    <span class="text-xs text-gray-500"> ({{ task?.status }})</span>
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button
                  @click="startEdit(task)"
                  class="text-sm text-gray-600 hover:text-gray-800"
                  :disabled="isLoading"
                >
                  Edit
                </button>
                <button
                  @click="removeTask(task.id)"
                  class="text-red-500 hover:text-red-700"
                  :disabled="isLoading"
                >
                  Delete
                </button>
              </div>
            </li>
          </ul>
          <div v-else class="text-gray-500">No tasks for other users.</div>
        </div>
        <!-- What users to see -->
        <ul v-else class="space-y-2">
          <li
            v-for="task in taskStore.tasks"
            :key="task.id"
            class="flex items-center justify-between bg-gray-100 p-2 rounded"
          >
            <div class="flex items-center gap-3">
              <!-- <button
                @click="toggleStatus(task)"
                :disabled="isLoading"
                class="w-5 h-5 flex items-center justify-center border rounded"
                :class="task.status === 'completed' ? 'bg-green-500 text-white' : 'bg-white'"
                title="Toggle status"
              >
                <svg
                  v-if="task.status === 'completed'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button> -->

              <div class="p-2">
                <select
                  v-model="task.status"
                  @change="toggleStatus(task)"
                  class="border rounded p-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div @dblclick="startEdit(task)" class="cursor-pointer">
                <span>{{ task.title }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="startEdit(task)"
                class="text-sm text-gray-600 hover:text-gray-800"
                :disabled="isLoading"
              >
                Edit
              </button>
              <button
                @click="removeTask(task.id)"
                class="text-red-500 hover:text-red-700"
                :disabled="isLoading"
              >
                Delete
              </button>
            </div>
          </li>
        </ul>

        <!-- Error -->
        <div v-if="taskStore.error" class="text-red-500 mt-2">{{ taskStore.error }}</div>
      </div>
    </main>

    <!-- Edit Modal (small inline edit) -->
    <div
      v-if="editingTask"
      class="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-3">Edit Task</h3>

        <!-- Title -->
        <input
          v-model="editingTitle"
          class="w-full p-2 border rounded mb-3"
          placeholder="Task title"
        />

        <!-- Only for Admins: Reassign User -->
        <div v-if="auth.user?.role === 'admin'" class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-1"> Assign to User </label>
          <select
            v-if="auth.user?.role === 'admin'"
            v-model="editingUserId"
            class="border rounded p-2 w-full"
          >
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>

        <div class="flex justify-end gap-2">
          <button @click="cancelEdit" class="px-3 py-1 border rounded">Cancel</button>
          <button
            @click="confirmEdit"
            :disabled="isLoading"
            class="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/task'
import { useUserStore } from '@/stores/user'
import { fetchUsers } from '@/services/userService'

const auth = useAuthStore()
const taskStore = useTaskStore()
const userStore = useUserStore()
const router = useRouter()

// UI state
const newTaskTitle = ref('')
const toasts = ref([])
let toastId = 1

// editing
const editingTask = ref(null)
const editingTitle = ref('')

// computed combined loading flag
const isLoading = computed(() => !!auth.loading || !!taskStore.loading || !!userStore.loading)
// helper: show toast
function showToast(message, type = 'success', timeout = 3500) {
  const id = toastId++
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }, timeout)
}

// // initial load
// ;(async () => {
//   // restore user if needed
//   if (!auth.user && auth.token) {
//     try {
//       await auth.fetchUser()
//     } catch (e) {
//       auth.localLogout()
//       router.push('/login')
//       return
//     }
//   }
//   // fetch tasks (ignore errors here, store will hold error)
//   try {
//     await taskStore.fetchTasks()
//   } catch (e) {
//     // show optional toast
//     showToast('Failed to load tasks', 'error')
//   }
// })()

// logout
async function handleLogout() {
  try {
    await auth.logout()
    showToast('Logged out', 'success')
    router.push('/login')
  } catch (e) {
    showToast('Failed to logout', 'error')
  }
}

// add task
const assignedUserId = ref('')

async function addTask() {
  const title = newTaskTitle.value.trim()
  if (!title) return
  try {
    const payload = { title }
    if (auth.user?.role === 'admin' && assignedUserId.value) {
      payload.user_id = assignedUserId.value
    }
    await taskStore.addTask(payload)
    showToast('Task added', 'success')
    newTaskTitle.value = ''
    assignedUserId.value = ''
  } catch (e) {
    showToast(taskStore.error || 'Failed to add task', 'error')
  }
}

// toggle status (pending <-> completed)
async function toggleStatus(task) {
  // const newStatus = task.status === 'completed' ? 'pending' : 'completed'
  try {
    await taskStore.updateTask(task.id, { status: task.status })
    showToast('Status updated', 'success')
  } catch (e) {
    showToast(taskStore.error || 'Failed to update task', 'error')
  }
}

// delete task
async function removeTask(id) {
  if (!confirm('Delete this task?')) return
  try {
    await taskStore.deleteTask(id)
    showToast('Task deleted', 'success')
  } catch (e) {
    showToast(taskStore.error || 'Failed to delete task', 'error')
  }
}

// edit flows
function cancelEdit() {
  editingTask.value = null
  editingTitle.value = ''
}

const editingUserId = ref(null)

// when starting edit, prefill user_id
function startEdit(task) {
  editingTask.value = task
  editingTitle.value = task.title
  editingUserId.value = task.user_id
}

// confirm edit
async function confirmEdit() {
  if (!editingTask.value) return
  const id = editingTask.value.id
  const payload = {
    title: editingTitle.value.trim(),
  }

  // include user_id if admin
  if (auth.user?.role === 'admin' && editingUserId.value) {
    payload.user_id = editingUserId.value
  }

  try {
    await taskStore.updateTask(id, payload)
    showToast('Task saved', 'success')
    cancelEdit()
  } catch (e) {
    showToast(taskStore.error || 'Failed to save task', 'error')
  }
}

const users = ref([]) // list of users

onMounted(async () => {
  if (!auth.user && auth.token) {
    try {
      await auth.fetchUser()
    } catch (e) {
      auth.localLogout()
      router.push('/login')
      return
    }
  }

  await taskStore.fetchTasks()

  if (auth.user?.role === 'admin') {
    try {
      const { data } = await fetchUsers(auth)
      users.value = data
      console.log(users.value)
    } catch (e) {
      console.error('Failed to fetch users', e)
    }
  }
})
</script>

<style scoped>
/* small transition for toasts */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  transform: translateY(-8px);
  opacity: 0;
}
.toast-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.toast-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.toast-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
</style>
