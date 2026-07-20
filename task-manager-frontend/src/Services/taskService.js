import api from '@/plugins/axios'

export default {
  async getAll(params = {}) {
    // Drop empty filters so the query string stays clean
    const query = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    return api.get('/tasks', { params: query })
  },
  async create(data) {
    return api.post('/tasks', data)
  },
  async update(id, data) {
    return api.put(`/tasks/${id}`, data)
  },
  async delete(id) {
    return api.delete(`/tasks/${id}`)
  },
}
