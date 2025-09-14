// src/stores/auth.js
import { defineStore } from 'pinia'
import authService from '../services/authService'
import { setAuthToken, clearAuthToken } from '../plugins/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    // initialize store on app start
    init() {
      if (this.token) {
        setAuthToken(this.token)
        // optionally: you can load `me()` here to populate user
      }
    },

    // login action used by the UI
    async login(payload) {
      const res = await authService.login(payload)
      const { user, token } = res.data
      this.user = user
      this.token = token
      localStorage.setItem('token', token)
      setAuthToken(token)
      return res
    },

    // register action used by the UI
    async register(payload) {
      const res = await authService.register(payload)
      const { user, token } = res.data
      this.user = user
      this.token = token
      localStorage.setItem('token', token)
      setAuthToken(token)
      return res
    },

    // local logout (clears token & user)
    async fetchUser() {
      if (!this.token) return null
      const res = await authService.me()
      this.user = res.data
      return res
    },

    async logout() {
      try {
        await authService.logout() // revoke token on server
      } catch (e) {
        // ignore network errors; still clear local
      }
      this.localLogout()
    },

    localLogout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      clearAuthToken()
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
  },
})
