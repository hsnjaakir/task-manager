import { defineStore } from 'pinia'
import taskService from '@/services/taskService'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [], // for normal users
    myTasks: [], // for admins (their own tasks)
    otherTasks: [], // for admins (other users' tasks)
    loading: false,
    error: null,
  }),

  actions: {
    async fetchTasks() {
      this.loading = true
      this.error = null
      try {
        const res = await taskService.getAll()

        if (Array.isArray(res.data)) {
          // normal user → only own tasks
          this.tasks = res.data
          this.myTasks = []
          this.otherTasks = []
        } else if (res.data.my_tasks && res.data.other_tasks) {
          // admin → split into two lists
          this.myTasks = res.data.my_tasks
          this.otherTasks = res.data.other_tasks
          this.tasks = [] // clear normal list
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
        const res = await taskService.create(payload)
        const task = res.data

        // Normal user
        if (this.tasks.length || (!this.myTasks.length && !this.otherTasks.length)) {
          this.tasks.unshift(task)
        }
        // Admin assigning to self
        else if (this.myTasks.length && task.user_id === payload.user_id) {
          this.myTasks.unshift(task)
        }
        // Admin assigning to another user
        else if (this.otherTasks.length && task.user_id !== payload.user_id) {
          this.otherTasks.unshift(task)
        }

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

        // Normal user
        const idx = this.tasks.findIndex((t) => t.id === id)
        if (idx !== -1) this.tasks.splice(idx, 1, updated)

        // Admin: update myTasks
        const myIdx = this.myTasks.findIndex((t) => t.id === id)
        if (myIdx !== -1) this.myTasks.splice(myIdx, 1, updated)

        // Admin: update otherTasks
        const otherIdx = this.otherTasks.findIndex((t) => t.id === id)
        if (otherIdx !== -1) this.otherTasks.splice(otherIdx, 1, updated)

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

        // Normal user
        this.tasks = this.tasks.filter((t) => t.id !== id)

        // Admin: remove from both lists
        this.myTasks = this.myTasks.filter((t) => t.id !== id)
        this.otherTasks = this.otherTasks.filter((t) => t.id !== id)

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
