<template>
  <span
    class="inline-grid place-items-center rounded-full font-display font-semibold uppercase shrink-0"
    :class="[sizeClass, colorClass]"
    :title="name"
  >
    {{ initials }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, default: '' },
  size: { type: String, default: 'md' }, // sm | md | lg
})

const initials = computed(() => {
  const parts = (props.name || '?').trim().split(/\s+/)
  return (parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')
})

const sizeClass = computed(
  () =>
    ({
      sm: 'w-7 h-7 text-[11px]',
      md: 'w-9 h-9 text-xs',
      lg: 'w-14 h-14 text-lg',
    })[props.size],
)

// Stable pastel per name
const palette = [
  'bg-brand-100 text-brand-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
]
const colorClass = computed(() => {
  let hash = 0
  for (const ch of props.name || '') hash = (hash * 31 + ch.charCodeAt(0)) % 997
  return palette[hash % palette.length]
})
</script>
