<template>
  <!-- Full-screen Loading Overlay -->
  <div
    v-if="isLoading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40"
  >
    <div class="w-14 h-14 border-4 border-white border-t-blue-400 rounded-full animate-spin"></div>
  </div>
  <!-- Error state -->
  <div v-else-if="error" class="text-center py-6 text-red-500">
    {{ error }}
  </div>
  <AuthenticatedLayout>
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4">User List</h2>

      <!-- User table -->
      <table class="w-full border">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="p-2 border">ID</th>
            <th class="p-2 border">Name</th>
            <th class="p-2 border">Email</th>
            <th class="p-2 border">Role</th>
            <th class="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="p-2 border">{{ user.id }}</td>
            <td class="p-2 border">{{ user.name }}</td>
            <td class="p-2 border">{{ user.email }}</td>
            <td class="p-2 border capitalize">{{ user.role }}</td>
            <td class="p-2 border">
              <router-link
                :to="{ name: 'user.details', params: { id: user.id } }"
                class="text-blue-600 hover:underline"
              >
                View Details
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { fetchUsers } from '@/services/userService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'

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
      error.value = 'Failed to fetch users'
      console.error('Failed to fetch users', e)
    } finally {
      isLoading.value = false
    }
  }
})
</script>
