import { defineStore } from 'pinia'
import notificationService from '@/services/notificationService'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    items: [],
    unreadCount: 0,
    loading: false,
    _poll: null,
  }),

  actions: {
    async fetch() {
      this.loading = true
      try {
        const { data } = await notificationService.getAll()
        this.items = data.notifications
        this.unreadCount = data.unread_count
      } catch (e) {
        // Silent — the bell simply shows nothing rather than erroring loudly
        console.error('Failed to load notifications', e)
      } finally {
        this.loading = false
      }
    },

    async markAsRead(id) {
      const n = this.items.find((x) => x.id === id)
      if (n && !n.read_at) {
        n.read_at = new Date().toISOString()
        this.unreadCount = Math.max(0, this.unreadCount - 1)
        try {
          await notificationService.markAsRead(id)
        } catch (e) {
          console.error('Failed to mark notification read', e)
        }
      }
    },

    async markAllAsRead() {
      if (this.unreadCount === 0) return
      const now = new Date().toISOString()
      this.items.forEach((n) => (n.read_at = n.read_at || now))
      this.unreadCount = 0
      try {
        await notificationService.markAllAsRead()
      } catch (e) {
        console.error('Failed to mark all read', e)
      }
    },

    // Light polling so the bell stays fresh without websockets
    startPolling(intervalMs = 60000) {
      this.fetch()
      this.stopPolling()
      this._poll = setInterval(() => this.fetch(), intervalMs)
    },

    stopPolling() {
      if (this._poll) {
        clearInterval(this._poll)
        this._poll = null
      }
    },
  },
})
