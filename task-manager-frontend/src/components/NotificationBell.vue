<template>
  <div class="relative" ref="root">
    <button
      @click="toggle"
      class="relative grid place-items-center w-9 h-9 rounded-lg text-ink-400 hover:text-white hover:bg-white/5 transition-colors"
      :aria-label="`Notifications${store.unreadCount ? ', ' + store.unreadCount + ' unread' : ''}`"
      aria-haspopup="true"
      :aria-expanded="open"
    >
      <svg viewBox="0 0 20 20" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 3a4 4 0 00-4 4c0 3-1.5 4.5-2 5h12c-.5-.5-2-2-2-5a4 4 0 00-4-4z" />
        <path d="M8.5 16a1.5 1.5 0 003 0" />
      </svg>
      <span
        v-if="store.unreadCount"
        class="absolute top-1 right-1 min-w-4 h-4 px-1 grid place-items-center rounded-full bg-rose-500 text-white text-[10px] font-semibold leading-none"
      >
        {{ store.unreadCount > 9 ? '9+' : store.unreadCount }}
      </span>
    </button>

    <transition
      enter-active-class="transition duration-150 ease-out"
      leave-active-class="transition duration-100 ease-in"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="open"
        class="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-[0_16px_44px_rgba(11,17,32,0.28)] border border-ink-950/8 overflow-hidden z-50 origin-top-right"
        role="menu"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b border-ink-950/8">
          <h3 class="font-display text-sm font-semibold tracking-tight text-ink-950">Notifications</h3>
          <button
            v-if="store.unreadCount"
            @click="store.markAllAsRead()"
            class="text-xs font-medium text-brand-600 hover:text-brand-700 rounded"
          >
            Mark all read
          </button>
        </div>

        <div class="max-h-96 overflow-y-auto">
          <div v-if="!store.items.length" class="px-4 py-10 text-center">
            <div class="mx-auto w-10 h-10 grid place-items-center rounded-xl bg-ink-950/4 text-ink-400 mb-2">
              <svg viewBox="0 0 20 20" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 3a4 4 0 00-4 4c0 3-1.5 4.5-2 5h12c-.5-.5-2-2-2-5a4 4 0 00-4-4z" />
                <path d="M8.5 16a1.5 1.5 0 003 0" />
              </svg>
            </div>
            <p class="text-sm text-ink-400">You're all caught up.</p>
          </div>

          <ul v-else class="divide-y divide-ink-950/6">
            <li
              v-for="n in store.items"
              :key="n.id"
              @click="onClick(n)"
              class="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-ink-950/3"
              :class="!n.read_at ? 'bg-brand-50/50' : ''"
            >
              <span class="grid place-items-center w-8 h-8 rounded-lg shrink-0 mt-0.5" :class="iconWrap(n)">
                <svg v-if="n.data.type === 'task_assigned'" viewBox="0 0 16 16" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.5 6.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM3 13a5 5 0 0110 0" />
                </svg>
                <svg v-else viewBox="0 0 16 16" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 1.5" />
                </svg>
              </span>

              <div class="min-w-0 flex-1">
                <p class="text-sm text-ink-800 leading-snug">{{ n.data.message }}</p>
                <p class="text-[11px] text-ink-400 mt-0.5">{{ timeAgo(n.created_at) }}</p>
              </div>

              <span v-if="!n.read_at" class="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1.5" aria-label="Unread"></span>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'

const store = useNotificationStore()
const router = useRouter()
const open = ref(false)
const root = ref(null)

function toggle() {
  open.value = !open.value
  if (open.value) store.fetch()
}

function close(e) {
  if (root.value && !root.value.contains(e.target)) open.value = false
}

function onClick(n) {
  store.markAsRead(n.id)
  open.value = false
  if (n.data.task_id) router.push('/dashboard')
}

function iconWrap(n) {
  return n.data.type === 'task_assigned'
    ? 'bg-brand-50 text-brand-600'
    : 'bg-amber-50 text-amber-600'
}

function timeAgo(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const secs = Math.floor((Date.now() - d.getTime()) / 1000)
  if (secs < 60) return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

onMounted(() => {
  document.addEventListener('click', close)
  store.startPolling()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', close)
  store.stopPolling()
})
</script>
