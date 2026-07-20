<template>
  <div class="min-h-screen grid lg:grid-cols-[5fr_6fr]">
    <!-- Brand panel -->
    <aside class="relative bg-ink-950 text-white flex flex-col justify-between px-8 py-8 lg:px-14 lg:py-12 overflow-hidden">
      <!-- Faint drafting grid -->
      <div
        class="absolute inset-0 opacity-[0.055] pointer-events-none"
        style="background-image: linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px); background-size: 44px 44px;"
        aria-hidden="true"
      ></div>

      <AppLogo light class="relative" />

      <div class="relative my-10 lg:my-0 max-w-md">
        <h1 class="font-display text-3xl lg:text-[2.6rem] leading-[1.12] font-semibold tracking-tight">
          Plan the day.<br />
          <span class="text-brand-200">Ship the work.</span>
        </h1>
        <p class="mt-4 text-ink-400 text-sm lg:text-base leading-relaxed">
          One place for your team's tasks — priorities, deadlines, and owners, all in view.
        </p>

        <ul class="mt-8 space-y-3.5 text-sm text-ink-200 hidden lg:block">
          <li v-for="point in points" :key="point" class="flex items-center gap-3">
            <span class="grid place-items-center w-5 h-5 rounded-md bg-brand-500/20 text-brand-200 shrink-0">
              <svg viewBox="0 0 12 12" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.5l2.5 2.5 4.5-5.5"/></svg>
            </span>
            {{ point }}
          </li>
        </ul>
      </div>

      <p class="relative text-xs text-ink-400 hidden lg:block">Taskline</p>
    </aside>

    <!-- Form panel -->
    <div class="flex items-center justify-center px-4 py-10 lg:py-0">
      <div class="w-full max-w-sm">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import AppLogo from '@/components/AppLogo.vue'

const points = [
  'Set priorities and deadlines at a glance',
  'Track progress from pending to done',
  'Assign work across your whole team',
]
</script>
