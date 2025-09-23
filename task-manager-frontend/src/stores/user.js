import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchUsers() {
      const auth = useAuthStore()
      if (!auth.user || auth.user.role !== 'admin') return

      this.loading = true
      this.error = null

      try {
        const { data } = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        this.users = data
      } catch (e) {
        this.error = e.response?.data?.message || 'Failed to load users'
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
