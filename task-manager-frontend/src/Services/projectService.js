import api from '@/plugins/axios'

export default {
  async getAll() {
    return api.get('/projects')
  },
  async get(id) {
    return api.get(`/projects/${id}`)
  },
  async create(data) {
    return api.post('/projects', data)
  },
  async update(id, data) {
    return api.put(`/projects/${id}`, data)
  },
  async delete(id) {
    return api.delete(`/projects/${id}`)
  },
}
