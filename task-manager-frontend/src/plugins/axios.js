// src/plugins/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// helper to set the Authorization header
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

// helper to clear the Authorization header
export function clearAuthToken() {
  delete api.defaults.headers.common['Authorization']
}

export default api
