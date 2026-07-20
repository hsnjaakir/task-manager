<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
    <section
      v-for="col in columns"
      :key="col.status"
      class="bg-ink-950/4 rounded-2xl p-3 min-h-[12rem] flex flex-col"
    >
      <header class="flex items-center gap-2 px-1.5 pb-3">
        <span class="w-2 h-2 rounded-full" :class="col.dot"></span>
        <h4 class="font-display text-sm font-semibold tracking-tight">{{ col.label }}</h4>
        <span class="text-xs font-medium text-ink-400 bg-white rounded-full px-2 py-0.5 ml-auto">
          {{ lists[col.status].length }}
        </span>
      </header>

      <draggable
        :list="lists[col.status]"
        group="tasks"
        item-key="id"
        class="flex-1 space-y-2.5 min-h-[6rem] rounded-xl transition-colors"
        ghost-class="board-ghost"
        drag-class="board-drag"
        :disabled="disabled"
        @change="(evt) => onChange(evt, col.status)"
      >
        <template #item="{ element: task }">
          <article
            class="relative bg-white rounded-xl border border-ink-950/8 shadow-[0_1px_2px_rgba(11,17,32,0.05)] hover:shadow-[0_4px_14px_rgba(11,17,32,0.1)] p-3.5 pl-4 cursor-grab active:cursor-grabbing transition-shadow"
            @dblclick="$emit('edit', task)"
          >
            <span
              class="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-full"
              :class="priorityRail(task)"
              aria-hidden="true"
            ></span>

            <div class="flex items-start justify-between gap-2">
              <p
                class="font-medium text-sm text-ink-950 leading-snug"
                :class="{ 'line-through text-ink-400': task.status === 'completed' }"
              >
                {{ task.title }}
              </p>
              <button
                v-if="!disabled"
                @click.stop="$emit('edit', task)"
                class="shrink-0 p-1 -m-0.5 rounded-md text-ink-400/70 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                :aria-label="`Edit ${task.title}`"
              >
                <svg viewBox="0 0 16 16" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M11.1 2.2a1.6 1.6 0 012.3 2.3L5 12.9l-3 .8.8-3z" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>

            <p v-if="task.description" class="text-xs text-ink-400 mt-1 line-clamp-2">
              {{ task.description }}
            </p>

            <div class="flex items-center gap-1.5 mt-2.5 flex-wrap">
              <span
                v-if="task.priority"
                class="text-[10px] font-semibold uppercase tracking-wide rounded-md px-1.5 py-0.5"
                :class="priorityChip(task)"
              >
                {{ task.priority }}
              </span>
              <span
                v-if="dueLabel(task)"
                class="inline-flex items-center gap-1 text-[11px] font-medium rounded-md px-1.5 py-0.5"
                :class="isOverdue(task) ? 'bg-rose-50 text-rose-600' : 'bg-ink-950/4 text-ink-700'"
              >
                <svg viewBox="0 0 16 16" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                  <rect x="2" y="3" width="12" height="11" rx="2" />
                  <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
                </svg>
                {{ isOverdue(task) ? 'Overdue · ' : '' }}{{ dueLabel(task) }}
              </span>
              <UserAvatar
                v-if="showAssignee && task.user?.name"
                :name="task.user.name"
                size="sm"
                class="ml-auto"
              />
            </div>
          </article>
        </template>
      </draggable>

      <p v-if="!lists[col.status].length" class="text-xs text-ink-400 text-center py-3 select-none">
        Drop tasks here
      </p>
    </section>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import draggable from 'vuedraggable'
import UserAvatar from '@/components/UserAvatar.vue'

const props = defineProps({
  tasks: { type: Array, required: true },
  showAssignee: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['edit', 'status-change'])

const columns = [
  { status: 'pending', label: 'Pending', dot: 'bg-ink-400' },
  { status: 'in-progress', label: 'In progress', dot: 'bg-amber-400' },
  { status: 'completed', label: 'Completed', dot: 'bg-emerald-400' },
]

// Local per-column lists that vuedraggable can mutate freely;
// rebuilt whenever the source tasks change (store refetches after updates).
const lists = reactive({ pending: [], 'in-progress': [], completed: [] })

watch(
  () => props.tasks,
  (tasks) => {
    for (const col of columns) {
      lists[col.status] = tasks.filter((t) => t.status === col.status)
    }
  },
  { immediate: true, deep: true },
)

function onChange(evt, status) {
  // Fired on the receiving column when a card is dropped into it
  if (evt.added) {
    emit('status-change', evt.added.element, status)
  }
}

const priorityRail = (task) =>
  ({ high: 'bg-rose-500', medium: 'bg-amber-400', low: 'bg-sky-400' })[task.priority] || 'bg-ink-200'

const priorityChip = (task) =>
  ({
    high: 'bg-rose-50 text-rose-600',
    medium: 'bg-amber-50 text-amber-700',
    low: 'bg-sky-50 text-sky-700',
  })[task.priority] || 'bg-ink-950/4 text-ink-700'

function parseDue(task) {
  if (!task.due_date) return null
  const d = new Date(task.due_date.split(' ')[0] + 'T00:00:00')
  return isNaN(d) ? null : d
}

const dueLabel = (task) => {
  const d = parseDue(task)
  return d ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : null
}

const isOverdue = (task) => {
  const d = parseDue(task)
  if (!d || task.status === 'completed') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d < today
}
</script>

<style scoped>
.board-ghost {
  opacity: 0.4;
  border-style: dashed;
  border-color: var(--color-brand-400);
}
.board-drag {
  transform: rotate(2deg);
  box-shadow: 0 12px 28px rgba(11, 17, 32, 0.2);
}
</style>
