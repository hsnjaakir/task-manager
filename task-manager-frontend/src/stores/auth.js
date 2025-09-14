import { defineStore } from 'pinia'
import authService from '@/services/authService'
import { setAuthToken, clearAuthToken } from '../plugins/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(payload) {
      this.loading = true
      this.error = null
      try {
        const res = await authService.login(payload)
        const { user, token } = res.data
        this.user = user
        this.token = token
        localStorage.setItem('token', token)
        setAuthToken(token)
        return res
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async register(payload) {
      this.loading = true
      this.error = null
      try {
        const res = await authService.register(payload)
        const { user, token } = res.data
        this.user = user
        this.token = token
        localStorage.setItem('token', token)
        setAuthToken(token)
        return res
      } catch (err) {
        this.error = err.response?.data?.message || 'Register failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      if (!this.token) return null
      this.loading = true
      this.error = null
      try {
        const res = await authService.me()
        this.user = res.data
        return res
      } catch (err) {
        this.error = 'Failed to fetch user'
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        await authService.logout()
      } catch (e) {
        // even if server fails, clear locally
      } finally {
        this.localLogout()
        this.loading = false
      }
    },

    localLogout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      clearAuthToken()
    },

    init() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        setAuthToken(token)
      }
    },
  },
})
