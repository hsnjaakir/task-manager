<template>
  <li
    class="group relative flex flex-col sm:flex-row sm:items-center gap-3 bg-white rounded-xl border border-ink-950/8 px-4 py-3.5 pl-5 shadow-[0_1px_2px_rgba(11,17,32,0.05)] hover:shadow-[0_4px_14px_rgba(11,17,32,0.08)] hover:border-ink-950/15 transition-all duration-200"
  >
    <!-- Priority rail -->
    <span
      class="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-full"
      :class="priorityRail"
      :title="task.priority ? `${task.priority} priority` : 'No priority'"
      aria-hidden="true"
    ></span>

    <!-- Status + text -->
    <div class="flex items-start sm:items-center gap-3 min-w-0 flex-1">
      <select
        v-if="!readonly"
        :value="task.status"
        :disabled="disabled"
        @change="$emit('status-change', $event.target.value)"
        class="shrink-0 text-xs font-medium rounded-full border py-1.5 pl-2.5 pr-7 cursor-pointer appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:0.7rem] disabled:opacity-50"
        :class="statusPill"
        :style="{ backgroundImage: chevron }"
        :aria-label="`Status of ${task.title}`"
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In progress</option>
        <option value="completed">Completed</option>
      </select>
      <span v-else class="shrink-0 text-xs font-medium rounded-full border py-1.5 px-2.5" :class="statusPill">
        {{ statusLabel }}
      </span>

      <div class="min-w-0 cursor-default" @dblclick="!readonly && $emit('edit')">
        <p
          class="font-medium text-sm text-ink-950 truncate transition-colors"
          :class="{ 'line-through text-ink-400': task.status === 'completed' }"
        >
          {{ task.title }}
        </p>
        <p v-if="task.description" class="text-xs text-ink-400 truncate mt-0.5">
          {{ task.description }}
        </p>
      </div>
    </div>

    <!-- Meta chips + actions -->
    <div class="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
      <span
<<<<<<< Updated upstream
=======
        v-if="task.project?.name"
        class="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-700 bg-ink-950/4 rounded-md px-2 py-1"
      >
        <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: task.project.color || '#3b55e6' }"></span>
        {{ task.project.name }}
      </span>

      <span
>>>>>>> Stashed changes
        v-if="dueLabel"
        class="inline-flex items-center gap-1 text-[11px] font-medium rounded-md px-2 py-1"
        :class="overdue ? 'bg-rose-50 text-rose-600' : 'bg-ink-950/4 text-ink-700'"
      >
        <svg viewBox="0 0 16 16" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <rect x="2" y="3" width="12" height="11" rx="2" />
          <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
        </svg>
        {{ overdue ? 'Overdue · ' : '' }}{{ dueLabel }}
      </span>

      <span
        v-if="showAssignee && task.user?.name"
        class="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-700 bg-ink-950/4 rounded-md pl-1 pr-2 py-0.5"
      >
        <UserAvatar :name="task.user.name" size="sm" class="scale-75 -m-0.5" />
        {{ task.user.name }}
      </span>

      <div v-if="!readonly" class="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
        <button
          @click="$emit('edit')"
          :disabled="disabled"
          class="p-1.5 rounded-lg text-ink-400 hover:text-brand-600 hover:bg-brand-50 disabled:opacity-40 transition-colors"
          :aria-label="`Edit ${task.title}`"
        >
          <svg viewBox="0 0 16 16" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M11.1 2.2a1.6 1.6 0 012.3 2.3L5 12.9l-3 .8.8-3z" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          @click="$emit('delete')"
          :disabled="disabled"
          class="p-1.5 rounded-lg text-ink-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40 transition-colors"
          :aria-label="`Delete ${task.title}`"
        >
          <svg viewBox="0 0 16 16" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2.5 4h11M6.5 4V2.5h3V4M4 4l.7 9.5h6.6L12 4M6.7 6.8v4.4M9.3 6.8v4.4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  </li>
</template>

<script setup>
import { computed } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'

const props = defineProps({
  task: { type: Object, required: true },
  showAssignee: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete', 'status-change'])

const priorityRail = computed(
  () =>
    ({
      high: 'bg-rose-500',
      medium: 'bg-amber-400',
      low: 'bg-sky-400',
    })[props.task.priority] || 'bg-ink-200',
)

const statusPill = computed(
  () =>
    ({
      pending: 'bg-ink-950/4 text-ink-700 border-ink-950/10',
      'in-progress': 'bg-amber-50 text-amber-700 border-amber-200',
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    })[props.task.status] || 'bg-ink-950/4 text-ink-700 border-ink-950/10',
)

const statusLabel = computed(
  () =>
    ({ pending: 'Pending', 'in-progress': 'In progress', completed: 'Completed' })[props.task.status] ||
    props.task.status,
)

const dueDate = computed(() => {
  if (!props.task.due_date) return null
  const d = new Date(props.task.due_date.split(' ')[0] + 'T00:00:00')
  return isNaN(d) ? null : d
})

const dueLabel = computed(() =>
  dueDate.value ? dueDate.value.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : null,
)

const overdue = computed(() => {
  if (!dueDate.value || props.task.status === 'completed') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return dueDate.value < today
})

// Inline chevron for the status select (currentColor-ish gray)
const chevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M3 4.5l3 3 3-3' stroke='%23667' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`
</script>
