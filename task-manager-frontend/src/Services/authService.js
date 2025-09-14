import api from '../plugins/axios'

export default {
  login(payload) {
    return api.post('/login', payload)
  },

  register(payload) {
    // console.log('achire vai')
    return api.post('/register', payload)
  },
  me() {
    return api.get('/me')
  },
  logout() {
    return api.post('/logout')
  },
}
