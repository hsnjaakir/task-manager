<template>
  <div class="flex items-center gap-2.5 select-none">
    <!-- Mark: a check drafted inside a tilted square -->
    <span
      class="grid place-items-center w-8 h-8 rounded-lg bg-brand-500 shadow-[0_2px_8px_rgba(59,85,230,0.45)] rotate-[-6deg]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 20 20" class="w-4.5 h-4.5 rotate-[6deg]" fill="none">
        <path d="M4 10.5l4 4 8-9" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span class="font-display font-semibold tracking-tight text-lg leading-none" :class="light ? 'text-white' : 'text-ink-950'">
      Task<span :class="light ? 'text-brand-200' : 'text-brand-600'">line</span>
    </span>
  </div>
</template>

<script setup>
defineProps({ light: { type: Boolean, default: false } })
</script>
