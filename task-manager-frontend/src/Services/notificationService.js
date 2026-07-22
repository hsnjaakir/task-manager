import api from '@/plugins/axios'

export default {
  async getAll() {
    return api.get('/notifications')
  },
  async markAsRead(id) {
    return api.post(`/notifications/${id}/read`)
  },
  async markAllAsRead() {
    return api.post('/notifications/read-all')
  },
}
