<template>
  <!-- Full-screen Loading Overlay -->
  <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
    <div class="w-14 h-14 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="text-center py-6 text-red-500 font-medium">
    {{ error }}
  </div>

  <!-- Main Layout -->
  <AuthenticatedLayout>
    <div class="bg-gray-50 min-h-screen">
      <div class="w-full mx-auto bg-white shadow-md rounded-xl overflow-hidden">
        <div class="flex justify-between items-center border-b p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 class="text-2xl font-semibold text-gray-800">User List</h2>
        </div>

        <!-- User Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th class="p-3 border-b">ID</th>
                <th class="p-3 border-b">Name</th>
                <th class="p-3 border-b">Email</th>
                <th class="p-3 border-b">Role</th>
                <th class="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="user in users" :key="user.id" class="hover:bg-blue-50 transition-colors duration-150">
                <td class="p-3 border-b text-gray-700">{{ user.id }}</td>
                <td class="p-3 border-b text-gray-800 font-medium">
                  {{ user.name }}
                </td>
                <td class="p-3 border-b text-gray-600">{{ user.email }}</td>
                <td class="p-3 border-b text-gray-700 capitalize">
                  <span :class="{
                    'bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs': user.role === 'admin',
                    'bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs': user.role === 'user'
                  }">
                    {{ user.role }}
                  </span>
                </td>
                <td class="p-3 border-b text-center">
                  <router-link :to="{ name: 'user.details', params: { id: user.id } }"
                    class="text-blue-600 hover:text-blue-800 font-medium transition">
                    View Details
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="!users.length && !isLoading" class="p-6 text-center text-gray-500">
          No users found.
        </div>
      </div>
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
