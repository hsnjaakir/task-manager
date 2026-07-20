import { defineStore } from 'pinia'
import taskService from '@/services/taskService'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [], // for normal users
    myTasks: [], // for admins (their own tasks)
    otherTasks: [], // for admins (other users' tasks)
    filters: { search: '', status: '', priority: '', sort: 'latest' },
    loading: false,
    error: null,
  }),

  actions: {
    /**
     * Fetch tasks using the current filters. Pass a partial filters object
     * to update them first (e.g. fetchTasks({ status: 'pending' })).
     */
    async fetchTasks(filters = null) {
      if (filters) {
        this.filters = { ...this.filters, ...filters }
      }
      this.loading = true
      this.error = null
      try {
        const res = await taskService.getAll(this.filters)

        if (Array.isArray(res.data)) {
          // normal user → only own tasks
          this.tasks = res.data
          this.myTasks = []
          this.otherTasks = []
        } else if (res.data.my_tasks && res.data.other_tasks) {
          // admin → split into two lists
          this.myTasks = res.data.my_tasks
          this.otherTasks = res.data.other_tasks
          this.tasks = []
        } else {
          this.tasks = []
          this.myTasks = []
          this.otherTasks = []
        }

        return res.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch tasks'
        throw err
      } finally {
        this.loading = false
      }
    },

    async addTask(payload) {
      this.loading = true
      this.error = null
      try {
        await taskService.create(payload)
        return await this.fetchTasks()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to add task'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateTask(id, payload) {
      this.loading = true
      this.error = null
      try {
        await taskService.update(id, payload)
        return await this.fetchTasks()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update task'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteTask(id) {
      this.loading = true
      this.error = null
      try {
        await taskService.delete(id)
        return await this.fetchTasks()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete task'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
