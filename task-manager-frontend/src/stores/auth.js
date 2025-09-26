import { defineStore } from 'pinia'
import authService from '@/services/authService'
import { setAuthToken, clearAuthToken } from '../plugins/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
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
        localStorage.setItem('user', JSON.stringify(user))

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
        localStorage.setItem('user', JSON.stringify(user))

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

        localStorage.setItem('user', JSON.stringify(this.user))

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
      localStorage.removeItem('user')
      clearAuthToken()
    },

    init() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      if (token) {
        this.token = token
        setAuthToken(token)
      }
      if (user) {
        this.user = JSON.parse(user)
      }
    },
  },
})
