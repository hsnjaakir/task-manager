// src/stores/task.js
import { defineStore } from 'pinia'
import taskService from '@/services/taskService'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchTasks() {
      this.loading = true
      this.error = null
      try {
        const res = await taskService.getAll()
        // backend returns the tasks array as res.data
        this.tasks = Array.isArray(res.data) ? res.data : []
        return this.tasks
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
        const res = await taskService.create(payload)
        // backend returns created task as res.data
        const task = res.data
        // insert at the top for newest-first UX
        this.tasks.unshift(task)
        return task
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
        const res = await taskService.update(id, payload)
        const updated = res.data
        const idx = this.tasks.findIndex((t) => t.id === id)
        if (idx !== -1) this.tasks.splice(idx, 1, updated)
        return updated
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
        this.tasks = this.tasks.filter((t) => t.id !== id)
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete task'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
