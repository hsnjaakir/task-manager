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

    // local logout (clears token & user)
    async localLogout() {
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
