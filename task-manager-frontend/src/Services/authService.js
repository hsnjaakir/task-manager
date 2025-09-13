import api from '../plugins/axios'

export default {
  login(payload) {
    return api.post('/login', payload)
  },
  // we'll add register/me/logout later
}
