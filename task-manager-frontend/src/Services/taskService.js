import api from '@/plugins/axios'

export default {
  async getAll() {
    return api.get('/tasks')
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
