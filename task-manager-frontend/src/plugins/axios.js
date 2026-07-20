import axios from 'axios'

const api = axios.create({
  // Configure per environment in .env — see .env.example
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:9000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// helper to set the Authorization header
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export function clearAuthToken() {
  delete api.defaults.headers.common['Authorization']
}

// attach token from localStorage on boot (page refresh)
const token = localStorage.getItem('token')
if (token) setAuthToken(token)

export default api
