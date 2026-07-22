import { defineStore } from 'pinia'
import projectService from '@/services/projectService'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProjects() {
      this.loading = true
      this.error = null
      try {
        const { data } = await projectService.getAll()
        this.projects = data
        return data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch projects'
        throw err
      } finally {
        this.loading = false
      }
    },

    async addProject(payload) {
      this.loading = true
      this.error = null
      try {
        await projectService.create(payload)
        return await this.fetchProjects()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to create project'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateProject(id, payload) {
      this.loading = true
      this.error = null
      try {
        await projectService.update(id, payload)
        return await this.fetchProjects()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update project'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteProject(id) {
      this.loading = true
      this.error = null
      try {
        await projectService.delete(id)
        return await this.fetchProjects()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete project'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
