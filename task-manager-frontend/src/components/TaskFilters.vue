<template>
  <div class="flex flex-wrap items-center gap-2.5">
    <!-- Search -->
    <div class="relative flex-1 min-w-[11rem]">
      <svg
        viewBox="0 0 16 16"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none"
        fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
      >
        <circle cx="7" cy="7" r="4.5" />
        <path d="M10.5 10.5L14 14" />
      </svg>
      <input
        :value="search"
        @input="onSearch($event.target.value)"
        type="search"
        placeholder="Search tasks"
        aria-label="Search tasks"
        class="w-full rounded-xl border border-ink-950/15 bg-white pl-9 pr-3.5 py-2 text-sm placeholder:text-ink-400/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
      />
    </div>

    <!-- Status (list view only — the board shows all columns) -->
    <select
      v-if="view === 'list'"
      :value="status"
      @change="$emit('update:status', $event.target.value)"
      aria-label="Filter by status"
      class="rounded-xl border border-ink-950/15 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
    >
      <option value="">All statuses</option>
      <option value="pending">Pending</option>
      <option value="in-progress">In progress</option>
      <option value="completed">Completed</option>
    </select>

    <!-- Priority -->
    <select
      :value="priority"
      @change="$emit('update:priority', $event.target.value)"
      aria-label="Filter by priority"
      class="rounded-xl border border-ink-950/15 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
    >
      <option value="">All priorities</option>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>

    <!-- Sort -->
    <select
      :value="sort"
      @change="$emit('update:sort', $event.target.value)"
      aria-label="Sort tasks"
      class="rounded-xl border border-ink-950/15 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
    >
      <option value="latest">Newest first</option>
      <option value="due_date">By deadline</option>
      <option value="priority">By priority</option>
    </select>

    <!-- View toggle -->
    <div class="flex bg-ink-950/6 rounded-xl p-1 ml-auto" role="tablist" aria-label="View">
      <button
        v-for="opt in viewOptions"
        :key="opt.value"
        role="tab"
        :aria-selected="view === opt.value"
        @click="$emit('update:view', opt.value)"
        class="inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-1.5 transition-all"
        :class="view === opt.value ? 'bg-white text-ink-950 shadow-[0_1px_3px_rgba(11,17,32,0.12)]' : 'text-ink-400 hover:text-ink-950'"
      >
        <svg v-if="opt.value === 'list'" viewBox="0 0 16 16" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
          <path d="M2.5 4h11M2.5 8h11M2.5 12h11" />
        </svg>
        <svg v-else viewBox="0 0 16 16" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2.5" width="3.4" height="11" rx="1" />
          <rect x="6.3" y="2.5" width="3.4" height="7" rx="1" />
          <rect x="10.6" y="2.5" width="3.4" height="9" rx="1" />
        </svg>
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  search: { type: String, default: '' },
  status: { type: String, default: '' },
  priority: { type: String, default: '' },
  sort: { type: String, default: 'latest' },
  view: { type: String, default: 'list' },
})

const emit = defineEmits([
  'update:search',
  'update:status',
  'update:priority',
  'update:sort',
  'update:view',
])

const viewOptions = [
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board' },
]

// Debounce search so we don't hit the API on every keystroke
let timer = null
function onSearch(value) {
  clearTimeout(timer)
  timer = setTimeout(() => emit('update:search', value), 350)
}
</script>
