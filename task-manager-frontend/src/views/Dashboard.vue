<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="relative">
    <!-- Full-screen loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-canvas/60 backdrop-blur-[2px]">
      <div class="w-12 h-12 border-[3px] border-ink-950/10 border-t-brand-500 rounded-full animate-spin"></div>
    </div>

    <!-- Toasts -->
    <div class="fixed top-20 right-4 sm:right-6 z-[60] space-y-2" aria-live="polite">
      <transition-group name="toast" tag="div" class="space-y-2">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="flex items-center gap-2.5 bg-ink-950 text-white text-sm rounded-xl pl-3.5 pr-4 py-2.5 shadow-[0_8px_24px_rgba(11,17,32,0.35)] max-w-xs"
        >
          <span class="w-2 h-2 rounded-full shrink-0" :class="t.type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'"></span>
          {{ t.message }}
        </div>
      </transition-group>
    </div>

    <AuthenticatedLayout>
      <!-- ============ Header: greeting + momentum ring ============ -->
      <section class="bg-ink-950 text-white rounded-2xl px-6 sm:px-8 py-6 sm:py-7 flex items-center justify-between gap-6 overflow-hidden relative">
        <div
          class="absolute inset-0 opacity-[0.05] pointer-events-none"
          style="background-image: linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px); background-size: 40px 40px;"
          aria-hidden="true"
        ></div>

        <div class="relative min-w-0">
          <p class="text-xs uppercase tracking-widest text-ink-400">{{ todayLabel }}</p>
          <h1 class="font-display text-2xl sm:text-[1.7rem] font-semibold tracking-tight mt-1 truncate">
            {{ greeting }}, {{ firstName }}
          </h1>
          <p class="text-sm text-ink-400 mt-1.5">
            <template v-if="stats.total">
              {{ stats.completed }} of {{ stats.total }} tasks done — {{ momentumLine }}
            </template>
            <template v-else-if="filtersActive">No tasks match the current filters.</template>
            <template v-else>A clear slate. Add your first task below.</template>
          </p>

          <!-- Stat chips -->
          <div class="flex flex-wrap gap-2 mt-4">
            <span class="inline-flex items-center gap-1.5 text-xs font-medium bg-white/8 border border-white/10 rounded-lg px-2.5 py-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-ink-400"></span>{{ stats.pending }} pending
            </span>
            <span class="inline-flex items-center gap-1.5 text-xs font-medium bg-white/8 border border-white/10 rounded-lg px-2.5 py-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>{{ stats.inProgress }} in progress
            </span>
            <span class="inline-flex items-center gap-1.5 text-xs font-medium bg-white/8 border border-white/10 rounded-lg px-2.5 py-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>{{ stats.completed }} completed
            </span>
            <span
              v-if="stats.overdue"
              class="inline-flex items-center gap-1.5 text-xs font-medium bg-rose-500/15 border border-rose-400/30 text-rose-200 rounded-lg px-2.5 py-1.5"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>{{ stats.overdue }} overdue
            </span>
<<<<<<< Updated upstream
          </div>
        </div>

        <!-- Completion ring -->
        <div class="relative shrink-0 hidden sm:block" role="img" :aria-label="`${completionPct}% of tasks completed`">
          <svg viewBox="0 0 120 120" class="w-28 h-28 -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.09)" stroke-width="10" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke="url(#ringGrad)" stroke-width="10" stroke-linecap="round"
              :stroke-dasharray="ringCircumference"
              :stroke-dashoffset="ringOffset"
              style="transition: stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1)"
            />
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#5f78ee" />
                <stop offset="100%" stop-color="#34d399" />
              </linearGradient>
            </defs>
          </svg>
          <div class="absolute inset-0 grid place-items-center rotate-0">
            <div class="text-center">
              <p class="font-display text-2xl font-semibold leading-none">{{ completionPct }}<span class="text-sm">%</span></p>
              <p class="text-[10px] uppercase tracking-widest text-ink-400 mt-1">done</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ Composer ============ -->
      <section class="mt-6 bg-white rounded-2xl border border-ink-950/8 shadow-[0_1px_2px_rgba(11,17,32,0.05)] p-5 sm:p-6">
        <h2 class="font-display text-base font-semibold tracking-tight flex items-center gap-2">
          <span class="grid place-items-center w-6 h-6 rounded-lg bg-brand-50 text-brand-600">
            <svg viewBox="0 0 14 14" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 2.5v9M2.5 7h9"/></svg>
          </span>
          Create a task
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label for="newTitle" class="block text-sm font-medium text-ink-800 mb-1.5">Title</label>
            <input
              id="newTitle"
              v-model="newTaskTitle"
              type="text"
              placeholder="What needs doing?"
              class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm placeholder:text-ink-400/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
            />
          </div>

          <div>
            <label for="newPriority" class="block text-sm font-medium text-ink-800 mb-1.5">Priority</label>
            <select
              id="newPriority"
              v-model="newTaskPriority"
              class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition bg-white"
            >
              <option disabled value="">Choose a priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label for="newDescription" class="block text-sm font-medium text-ink-800 mb-1.5">
              Description <span class="text-ink-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="newDescription"
              v-model="newTaskDescription"
              rows="2"
              placeholder="Any details worth noting"
              class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm placeholder:text-ink-400/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition resize-y"
            />
          </div>

          <div>
            <label for="newDueDate" class="block text-sm font-medium text-ink-800 mb-1.5">Deadline</label>
            <input
              id="newDueDate"
              v-model="newTaskDueDate"
              type="date"
              class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition bg-white"
            />
          </div>

          <div v-if="auth.user?.role === 'admin'">
            <label for="newAssignee" class="block text-sm font-medium text-ink-800 mb-1.5">Assign to</label>
            <select
              id="newAssignee"
              v-model="assignedUserId"
              class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition bg-white"
            >
              <option disabled value="">Choose a teammate</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
=======
          </div>
        </div>

        <!-- Completion ring -->
        <div class="relative shrink-0 hidden sm:block" role="img" :aria-label="`${completionPct}% of tasks completed`">
          <svg viewBox="0 0 120 120" class="w-28 h-28 -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.09)" stroke-width="10" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke="url(#ringGrad)" stroke-width="10" stroke-linecap="round"
              :stroke-dasharray="ringCircumference"
              :stroke-dashoffset="ringOffset"
              style="transition: stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1)"
            />
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#5f78ee" />
                <stop offset="100%" stop-color="#34d399" />
              </linearGradient>
            </defs>
          </svg>
          <div class="absolute inset-0 grid place-items-center rotate-0">
            <div class="text-center">
              <p class="font-display text-2xl font-semibold leading-none">{{ completionPct }}<span class="text-sm">%</span></p>
              <p class="text-[10px] uppercase tracking-widest text-ink-400 mt-1">done</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ Composer: progressive quick-add ============ -->
      <section
        class="mt-6 bg-white rounded-2xl border shadow-[0_1px_2px_rgba(11,17,32,0.05)] transition-colors"
        :class="composerOpen ? 'border-brand-200' : 'border-ink-950/8'"
      >
        <!-- Quick-add row: icon + title + add. Kept intentionally simple so
             the horizontal rhythm is just [icon] [flexible title] [button]. -->
        <div class="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3">
          <span
            class="grid place-items-center w-9 h-9 rounded-xl bg-brand-50 text-brand-600 shrink-0"
            aria-hidden="true"
          >
            <svg viewBox="0 0 14 14" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 2.5v9M2.5 7h9"/></svg>
          </span>

          <input
            id="newTitle"
            v-model="newTaskTitle"
            type="text"
            placeholder="Add a task…"
            aria-label="Task title"
            class="flex-1 min-w-0 bg-transparent text-sm sm:text-base placeholder:text-ink-400/70 focus:outline-none py-1.5"
            @focus="composerOpen = true"
            @keydown.enter.prevent="addTask"
          />

          <button
            @click="addTask"
            :disabled="!newTaskTitle.trim() || isLoading"
            class="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium h-9 w-9 sm:w-auto sm:px-5 rounded-xl shadow-[0_2px_10px_rgba(39,67,211,0.35)] disabled:opacity-40 disabled:shadow-none transition-all shrink-0"
            aria-label="Add task"
          >
            <svg viewBox="0 0 14 14" class="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 2.5v9M2.5 7h9"/></svg>
            <span class="hidden sm:inline">Add task</span>
          </button>
        </div>

        <!-- Details: revealed on focus. One consistent layout for all screens. -->
        <transition
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-from-class="opacity-0 -translate-y-1"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div v-show="composerOpen" class="border-t border-ink-950/8 p-4 sm:p-5 space-y-4">
            <!-- Priority: full-width segmented control, same on every screen -->
            <div>
              <label class="block text-xs font-medium text-ink-400 uppercase tracking-wide mb-2">Priority</label>
              <div class="grid grid-cols-3 gap-2" role="group" aria-label="Priority">
                <button
                  v-for="p in priorityOptions"
                  :key="p.value"
                  type="button"
                  @click="newTaskPriority = newTaskPriority === p.value ? '' : p.value"
                  class="inline-flex items-center justify-center gap-1.5 text-sm font-medium rounded-xl border py-2.5 transition-all"
                  :class="newTaskPriority === p.value ? p.activeClass : 'border-ink-950/12 text-ink-700 hover:border-ink-950/25'"
                  :aria-pressed="newTaskPriority === p.value"
                >
                  <svg viewBox="0 0 16 16" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path v-if="p.value === 'high'" d="M8 13V3M8 3L4 7M8 3l4 4" />
                    <path v-else-if="p.value === 'medium'" d="M3 8h10" />
                    <path v-else d="M8 3v10M8 13l4-4M8 13l-4-4" />
                  </svg>
                  {{ p.label }}
                </button>
              </div>
            </div>

            <!-- Deadline / Project / Assignee: even columns that wrap cleanly.
                 Each is self-contained so no row is ever left orphaned. -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label for="newDueDate" class="block text-xs font-medium text-ink-400 uppercase tracking-wide mb-1.5">Deadline</label>
                <input
                  id="newDueDate"
                  v-model="newTaskDueDate"
                  type="date"
                  class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition bg-white"
                />
              </div>

              <div>
                <label for="newProject" class="block text-xs font-medium text-ink-400 uppercase tracking-wide mb-1.5">Project</label>
                <select
                  id="newProject"
                  v-model="newTaskProjectId"
                  class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition bg-white"
                >
                  <option value="">No project</option>
                  <option v-for="p in projectStore.projects" :key="p.id" :value="p.id">
                    {{ p.name }}
                  </option>
                </select>
              </div>

              <div v-if="auth.user?.role === 'admin'">
                <label for="newAssignee" class="block text-xs font-medium text-ink-400 uppercase tracking-wide mb-1.5">Assign to</label>
                <select
                  id="newAssignee"
                  v-model="assignedUserId"
                  class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition bg-white"
                >
                  <option value="">Assign to myself</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Description: full width, the natural place for a longer field -->
            <div>
              <label for="newDescription" class="block text-xs font-medium text-ink-400 uppercase tracking-wide mb-1.5">
                Description
              </label>
              <textarea
                id="newDescription"
                v-model="newTaskDescription"
                rows="2"
                placeholder="Add any details worth noting"
                class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm placeholder:text-ink-400/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition resize-y"
              />
            </div>

            <!-- Footer actions -->
            <div class="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                @click="collapseComposer"
                class="text-sm font-medium text-ink-400 hover:text-ink-800 rounded-lg px-3 py-2 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="addTask"
                :disabled="!newTaskTitle.trim() || isLoading"
                class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2 rounded-xl shadow-[0_2px_10px_rgba(39,67,211,0.35)] disabled:opacity-40 disabled:shadow-none transition-all"
              >
                <svg viewBox="0 0 14 14" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 2.5v9M2.5 7h9"/></svg>
                Add task
              </button>
            </div>
          </div>
        </transition>
      </section>

      <!-- ============ Toolbar: search, filters, sort, view ============ -->
      <section class="mt-6">
        <TaskFilters
          :search="ui.search"
          :status="ui.status"
          :priority="ui.priority"
          :sort="ui.sort"
          :view="view"
          @update:search="(v) => applyFilter('search', v)"
          @update:status="(v) => applyFilter('status', v)"
          @update:priority="(v) => applyFilter('priority', v)"
          @update:sort="(v) => applyFilter('sort', v)"
          @update:view="setView"
        />
      </section>

      <!-- ============ Tasks ============ -->
      <div v-if="taskStore.loading && !stats.total" class="text-ink-400 text-center py-10 text-sm">
        Loading tasks…
      </div>

      <div v-else-if="!stats.total" class="mt-6 bg-white rounded-2xl border border-dashed border-ink-950/15 py-12 text-center">
        <div class="mx-auto w-11 h-11 grid place-items-center rounded-xl bg-brand-50 text-brand-600 mb-3">
          <svg viewBox="0 0 20 20" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5l4 4 8-9"/></svg>
        </div>
        <template v-if="filtersActive">
          <p class="font-medium text-ink-950 text-sm">No tasks match your filters</p>
          <button @click="clearFilters" class="text-brand-600 hover:text-brand-700 text-sm font-medium mt-1 rounded">
            Clear filters
          </button>
        </template>
        <template v-else>
          <p class="font-medium text-ink-950 text-sm">No tasks yet</p>
          <p class="text-ink-400 text-sm mt-1">Add your first task above to get started.</p>
        </template>
      </div>

      <!-- ===== Board view ===== -->
      <template v-else-if="view === 'board'">
        <template v-if="auth.user?.role === 'admin'">
          <section class="mt-6">
            <div class="flex items-center gap-2.5 mb-3">
              <h3 class="font-display text-base font-semibold tracking-tight">My tasks</h3>
              <span class="text-xs font-medium text-brand-700 bg-brand-50 rounded-full px-2 py-0.5">{{ taskStore.myTasks.length }}</span>
            </div>
            <TaskBoard
              :tasks="taskStore.myTasks"
              :disabled="isLoading"
              @edit="startEdit"
              @status-change="changeStatus"
            />
          </section>

          <section class="mt-8">
            <div class="flex items-center gap-2.5 mb-3">
              <h3 class="font-display text-base font-semibold tracking-tight">Team tasks</h3>
              <span class="text-xs font-medium text-brand-700 bg-brand-50 rounded-full px-2 py-0.5">{{ taskStore.otherTasks.length }}</span>
            </div>
            <TaskBoard
              :tasks="taskStore.otherTasks"
              show-assignee
              :disabled="isLoading"
              @edit="startEdit"
              @status-change="changeStatus"
            />
          </section>
        </template>

        <section v-else class="mt-6">
          <TaskBoard
            :tasks="taskStore.tasks"
            :disabled="isLoading"
            @edit="startEdit"
            @status-change="changeStatus"
          />
        </section>
      </template>

      <!-- ===== List view ===== -->
      <template v-else>
        <template v-if="auth.user?.role === 'admin'">
          <section class="mt-6">
            <div class="flex items-center gap-2.5 mb-3">
              <h3 class="font-display text-base font-semibold tracking-tight">My tasks</h3>
              <span class="text-xs font-medium text-brand-700 bg-brand-50 rounded-full px-2 py-0.5">{{ taskStore.myTasks.length }}</span>
            </div>
            <ul v-if="taskStore.myTasks.length" class="space-y-2">
              <TaskCard
                v-for="task in taskStore.myTasks"
                :key="task.id"
                :task="task"
                :disabled="isLoading"
                @edit="startEdit(task)"
                @delete="removeTask(task.id)"
                @status-change="(s) => changeStatus(task, s)"
              />
            </ul>
            <p v-else class="text-ink-400 text-sm bg-white border border-dashed border-ink-950/15 rounded-xl py-5 text-center">
              {{ filtersActive ? 'No matching tasks in this section.' : 'Nothing assigned to you right now.' }}
            </p>
          </section>

          <section class="mt-8">
            <div class="flex items-center gap-2.5 mb-3">
              <h3 class="font-display text-base font-semibold tracking-tight">Team tasks</h3>
              <span class="text-xs font-medium text-brand-700 bg-brand-50 rounded-full px-2 py-0.5">{{ taskStore.otherTasks.length }}</span>
            </div>
            <ul v-if="taskStore.otherTasks.length" class="space-y-2">
              <TaskCard
                v-for="task in taskStore.otherTasks"
                :key="task.id"
                :task="task"
                show-assignee
                :disabled="isLoading"
                @edit="startEdit(task)"
                @delete="removeTask(task.id)"
                @status-change="(s) => changeStatus(task, s)"
              />
            </ul>
            <p v-else class="text-ink-400 text-sm bg-white border border-dashed border-ink-950/15 rounded-xl py-5 text-center">
              {{ filtersActive ? 'No matching tasks in this section.' : 'No tasks assigned to teammates yet.' }}
            </p>
          </section>
        </template>

        <section v-else class="mt-6">
          <ul class="space-y-2">
            <TaskCard
              v-for="task in taskStore.tasks"
              :key="task.id"
              :task="task"
              :disabled="isLoading"
              @edit="startEdit(task)"
              @delete="removeTask(task.id)"
              @status-change="(s) => changeStatus(task, s)"
            />
          </ul>
        </section>
      </template>

      <!-- Error -->
      <p v-if="taskStore.error" class="mt-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5 text-center">
        {{ taskStore.error }}
      </p>

      <!-- ============ Edit modal ============ -->
      <div
        v-if="editingTask"
        class="fixed inset-0 z-[55] flex items-center justify-center bg-ink-950/50 backdrop-blur-[2px] p-4"
        @click.self="cancelEdit"
      >
        <div class="bg-white rounded-2xl shadow-[0_24px_60px_rgba(11,17,32,0.35)] p-6 w-full max-w-md" role="dialog" aria-modal="true" aria-label="Edit task">
          <h3 class="font-display text-lg font-semibold tracking-tight mb-5">Edit task</h3>

          <div class="space-y-4">
            <div>
              <label for="editTitle" class="block text-sm font-medium text-ink-800 mb-1.5">Title</label>
              <input
                id="editTitle"
                v-model="editingTitle"
                type="text"
                class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
              />
            </div>

            <div>
              <label for="editDescription" class="block text-sm font-medium text-ink-800 mb-1.5">Description</label>
              <textarea
                id="editDescription"
                v-model="editingDescription"
                rows="2"
                class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition resize-y"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="editPriority" class="block text-sm font-medium text-ink-800 mb-1.5">Priority</label>
                <select
                  id="editPriority"
                  v-model="editingPriority"
                  class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition bg-white"
                >
                  <option disabled value="">Choose</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label for="editDueDate" class="block text-sm font-medium text-ink-800 mb-1.5">Deadline</label>
                <input
                  id="editDueDate"
                  v-model="editingDueDate"
                  type="date"
                  class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition bg-white"
                />
              </div>
            </div>

            <div v-if="auth.user?.role === 'admin'">
              <label for="editAssignee" class="block text-sm font-medium text-ink-800 mb-1.5">Assign to</label>
              <select
                id="editAssignee"
                v-model="editingUserId"
                class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition bg-white"
              >
                <option disabled value="">Choose a teammate</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }}
                </option>
              </select>
            </div>
>>>>>>> Stashed changes
          </div>
        </div>

<<<<<<< Updated upstream
        <div class="mt-5 flex justify-end">
          <button
            @click="addTask"
            :disabled="!newTaskTitle.trim() || isLoading"
            class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-[0_2px_10px_rgba(39,67,211,0.35)] disabled:opacity-50 disabled:shadow-none transition-all"
          >
            <svg viewBox="0 0 14 14" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 2.5v9M2.5 7h9"/></svg>
            Add task
          </button>
        </div>
      </section>

      <!-- ============ Toolbar: search, filters, sort, view ============ -->
      <section class="mt-6">
        <TaskFilters
          :search="ui.search"
          :status="ui.status"
          :priority="ui.priority"
          :sort="ui.sort"
          :view="view"
          @update:search="(v) => applyFilter('search', v)"
          @update:status="(v) => applyFilter('status', v)"
          @update:priority="(v) => applyFilter('priority', v)"
          @update:sort="(v) => applyFilter('sort', v)"
          @update:view="setView"
        />
      </section>

      <!-- ============ Tasks ============ -->
      <div v-if="taskStore.loading && !stats.total" class="text-ink-400 text-center py-10 text-sm">
        Loading tasks…
      </div>

      <div v-else-if="!stats.total" class="mt-6 bg-white rounded-2xl border border-dashed border-ink-950/15 py-12 text-center">
        <div class="mx-auto w-11 h-11 grid place-items-center rounded-xl bg-brand-50 text-brand-600 mb-3">
          <svg viewBox="0 0 20 20" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5l4 4 8-9"/></svg>
        </div>
        <template v-if="filtersActive">
          <p class="font-medium text-ink-950 text-sm">No tasks match your filters</p>
          <button @click="clearFilters" class="text-brand-600 hover:text-brand-700 text-sm font-medium mt-1 rounded">
            Clear filters
          </button>
        </template>
        <template v-else>
          <p class="font-medium text-ink-950 text-sm">No tasks yet</p>
          <p class="text-ink-400 text-sm mt-1">Add your first task above to get started.</p>
        </template>
      </div>

      <!-- ===== Board view ===== -->
      <template v-else-if="view === 'board'">
        <template v-if="auth.user?.role === 'admin'">
          <section class="mt-6">
            <div class="flex items-center gap-2.5 mb-3">
              <h3 class="font-display text-base font-semibold tracking-tight">My tasks</h3>
              <span class="text-xs font-medium text-brand-700 bg-brand-50 rounded-full px-2 py-0.5">{{ taskStore.myTasks.length }}</span>
            </div>
            <TaskBoard
              :tasks="taskStore.myTasks"
              :disabled="isLoading"
              @edit="startEdit"
              @status-change="changeStatus"
            />
          </section>

          <section class="mt-8">
            <div class="flex items-center gap-2.5 mb-3">
              <h3 class="font-display text-base font-semibold tracking-tight">Team tasks</h3>
              <span class="text-xs font-medium text-brand-700 bg-brand-50 rounded-full px-2 py-0.5">{{ taskStore.otherTasks.length }}</span>
            </div>
            <TaskBoard
              :tasks="taskStore.otherTasks"
              show-assignee
              :disabled="isLoading"
              @edit="startEdit"
              @status-change="changeStatus"
            />
          </section>
        </template>

        <section v-else class="mt-6">
          <TaskBoard
            :tasks="taskStore.tasks"
            :disabled="isLoading"
            @edit="startEdit"
            @status-change="changeStatus"
          />
        </section>
      </template>

      <!-- ===== List view ===== -->
      <template v-else>
        <template v-if="auth.user?.role === 'admin'">
          <section class="mt-6">
            <div class="flex items-center gap-2.5 mb-3">
              <h3 class="font-display text-base font-semibold tracking-tight">My tasks</h3>
              <span class="text-xs font-medium text-brand-700 bg-brand-50 rounded-full px-2 py-0.5">{{ taskStore.myTasks.length }}</span>
            </div>
            <ul v-if="taskStore.myTasks.length" class="space-y-2">
              <TaskCard
                v-for="task in taskStore.myTasks"
                :key="task.id"
                :task="task"
                :disabled="isLoading"
                @edit="startEdit(task)"
                @delete="removeTask(task.id)"
                @status-change="(s) => changeStatus(task, s)"
              />
            </ul>
            <p v-else class="text-ink-400 text-sm bg-white border border-dashed border-ink-950/15 rounded-xl py-5 text-center">
              {{ filtersActive ? 'No matching tasks in this section.' : 'Nothing assigned to you right now.' }}
            </p>
          </section>

          <section class="mt-8">
            <div class="flex items-center gap-2.5 mb-3">
              <h3 class="font-display text-base font-semibold tracking-tight">Team tasks</h3>
              <span class="text-xs font-medium text-brand-700 bg-brand-50 rounded-full px-2 py-0.5">{{ taskStore.otherTasks.length }}</span>
            </div>
            <ul v-if="taskStore.otherTasks.length" class="space-y-2">
              <TaskCard
                v-for="task in taskStore.otherTasks"
                :key="task.id"
                :task="task"
                show-assignee
                :disabled="isLoading"
                @edit="startEdit(task)"
                @delete="removeTask(task.id)"
                @status-change="(s) => changeStatus(task, s)"
              />
            </ul>
            <p v-else class="text-ink-400 text-sm bg-white border border-dashed border-ink-950/15 rounded-xl py-5 text-center">
              {{ filtersActive ? 'No matching tasks in this section.' : 'No tasks assigned to teammates yet.' }}
            </p>
          </section>
        </template>

        <section v-else class="mt-6">
          <ul class="space-y-2">
            <TaskCard
              v-for="task in taskStore.tasks"
              :key="task.id"
              :task="task"
              :disabled="isLoading"
              @edit="startEdit(task)"
              @delete="removeTask(task.id)"
              @status-change="(s) => changeStatus(task, s)"
            />
          </ul>
        </section>
      </template>

      <!-- Error -->
      <p v-if="taskStore.error" class="mt-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5 text-center">
        {{ taskStore.error }}
      </p>

      <!-- ============ Edit modal ============ -->
      <div
        v-if="editingTask"
        class="fixed inset-0 z-[55] flex items-center justify-center bg-ink-950/50 backdrop-blur-[2px] p-4"
        @click.self="cancelEdit"
      >
        <div class="bg-white rounded-2xl shadow-[0_24px_60px_rgba(11,17,32,0.35)] p-6 w-full max-w-md" role="dialog" aria-modal="true" aria-label="Edit task">
          <h3 class="font-display text-lg font-semibold tracking-tight mb-5">Edit task</h3>

          <div class="space-y-4">
            <div>
              <label for="editTitle" class="block text-sm font-medium text-ink-800 mb-1.5">Title</label>
              <input
                id="editTitle"
                v-model="editingTitle"
                type="text"
                class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
              />
            </div>

            <div>
              <label for="editDescription" class="block text-sm font-medium text-ink-800 mb-1.5">Description</label>
              <textarea
                id="editDescription"
                v-model="editingDescription"
                rows="2"
                class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition resize-y"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="editPriority" class="block text-sm font-medium text-ink-800 mb-1.5">Priority</label>
                <select
                  id="editPriority"
                  v-model="editingPriority"
                  class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition bg-white"
                >
                  <option disabled value="">Choose</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label for="editDueDate" class="block text-sm font-medium text-ink-800 mb-1.5">Deadline</label>
                <input
                  id="editDueDate"
                  v-model="editingDueDate"
                  type="date"
                  class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition bg-white"
                />
              </div>
            </div>

            <div v-if="auth.user?.role === 'admin'">
              <label for="editAssignee" class="block text-sm font-medium text-ink-800 mb-1.5">Assign to</label>
              <select
                id="editAssignee"
                v-model="editingUserId"
                class="w-full rounded-xl border border-ink-950/15 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition bg-white"
              >
                <option disabled value="">Choose a teammate</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }}
                </option>
              </select>
            </div>
          </div>

=======
>>>>>>> Stashed changes
          <div class="flex justify-end gap-2.5 mt-6">
            <button
              @click="cancelEdit"
              class="text-sm font-medium text-ink-800 border border-ink-950/15 hover:bg-ink-950/4 rounded-xl px-4 py-2.5 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmEdit"
              :disabled="isLoading"
              class="text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-5 py-2.5 shadow-[0_2px_10px_rgba(39,67,211,0.35)] disabled:opacity-50 transition-colors"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
<<<<<<< Updated upstream
import { useRouter } from 'vue-router'
=======
import { useRouter, useRoute } from 'vue-router'
>>>>>>> Stashed changes
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/task'
import { useUserStore } from '@/stores/user'
import { useProjectStore } from '@/stores/project'
import { fetchUsers } from '@/services/userService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskBoard from '@/components/TaskBoard.vue'
import TaskFilters from '@/components/TaskFilters.vue'

const auth = useAuthStore()
const taskStore = useTaskStore()
const userStore = useUserStore()
const projectStore = useProjectStore()
const router = useRouter()
const route = useRoute()

// ---------- UI state ----------
const toasts = ref([])
let toastId = 1

const editingTask = ref(null)
const editingTitle = ref('')
const editingDescription = ref('')
const editingPriority = ref('')
const editingDueDate = ref('')
const editingUserId = ref(null)

const isLoading = computed(() => !!auth.loading || !!taskStore.loading || !!userStore.loading)

function showToast(message, type = 'success', timeout = 3500) {
  const id = toastId++
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }, timeout)
}

// ---------- Filters & view ----------
const view = ref(localStorage.getItem('taskline:view') || 'list')
<<<<<<< Updated upstream
const ui = reactive({ search: '', status: '', priority: '', sort: 'latest' })

const filtersActive = computed(() => !!(ui.search || ui.status || ui.priority))
=======
const ui = reactive({ search: '', status: '', priority: '', sort: 'latest', project_id: route.query.project || '' })

const filtersActive = computed(() => !!(ui.search || ui.status || ui.priority || ui.project_id))
>>>>>>> Stashed changes

async function applyFilter(key, value) {
  ui[key] = value
  await refetchWithFilters()
}

function setView(v) {
  view.value = v
  localStorage.setItem('taskline:view', v)
  // The board always shows every status as its columns
  if (v === 'board' && ui.status) {
    applyFilter('status', '')
  }
}

async function clearFilters() {
  ui.search = ''
  ui.status = ''
  ui.priority = ''
<<<<<<< Updated upstream
=======
  ui.project_id = ''
>>>>>>> Stashed changes
  await refetchWithFilters()
}

function refetchWithFilters() {
  return taskStore.fetchTasks({
    search: ui.search,
    status: view.value === 'board' ? '' : ui.status,
    priority: ui.priority,
    sort: ui.sort,
<<<<<<< Updated upstream
=======
    project_id: ui.project_id,
>>>>>>> Stashed changes
  })
}

// ---------- Derived stats ----------
const visibleTasks = computed(() =>
  auth.user?.role === 'admin' ? [...taskStore.myTasks, ...taskStore.otherTasks] : taskStore.tasks,
)

const stats = computed(() => {
  const list = visibleTasks.value
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let pending = 0
  let inProgress = 0
  let completed = 0
  let overdue = 0
  for (const t of list) {
    if (t.status === 'completed') completed++
    else if (t.status === 'in-progress') inProgress++
    else pending++
    if (t.due_date && t.status !== 'completed') {
      const d = new Date(t.due_date.split(' ')[0] + 'T00:00:00')
      if (!isNaN(d) && d < today) overdue++
    }
  }
  return { total: list.length, pending, inProgress, completed, overdue }
})

const completionPct = computed(() =>
  stats.value.total ? Math.round((stats.value.completed / stats.value.total) * 100) : 0,
)

const ringCircumference = 2 * Math.PI * 52
const ringOffset = computed(() => ringCircumference * (1 - completionPct.value / 100))

const momentumLine = computed(() => {
  const pct = completionPct.value
  if (pct === 100) return 'everything is wrapped up.'
  if (pct >= 60) return 'the finish line is close.'
  if (pct > 0) return 'keep the momentum going.'
  return 'time to get moving.'
})

const firstName = computed(() => (auth.user?.name || 'there').split(' ')[0])

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
})

const todayLabel = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

// ---------- New task form ----------
<<<<<<< Updated upstream
=======
const composerOpen = ref(false)
>>>>>>> Stashed changes
const newTaskTitle = ref('')
const newTaskDescription = ref('')
const newTaskPriority = ref('')
const newTaskDueDate = ref('')
const assignedUserId = ref('')
const newTaskProjectId = ref('')

const priorityOptions = [
  { value: 'high', label: 'High', activeClass: 'border-rose-200 bg-rose-50 text-rose-600' },
  { value: 'medium', label: 'Medium', activeClass: 'border-amber-200 bg-amber-50 text-amber-700' },
  { value: 'low', label: 'Low', activeClass: 'border-sky-200 bg-sky-50 text-sky-700' },
]

function collapseComposer() {
  composerOpen.value = false
}

async function addTask() {
  const title = newTaskTitle.value.trim()
  if (!title) return
  try {
    const payload = {
      title,
      description: newTaskDescription.value.trim() || null,
      priority: newTaskPriority.value,
      due_date: newTaskDueDate.value || null,
      project_id: newTaskProjectId.value || null,
    }
    if (auth.user?.role === 'admin' && assignedUserId.value) {
      payload.user_id = assignedUserId.value
    }
    await taskStore.addTask(payload)
    showToast('Task added')
    newTaskTitle.value = ''
    newTaskDescription.value = ''
    newTaskPriority.value = ''
    newTaskDueDate.value = ''
    assignedUserId.value = ''
<<<<<<< Updated upstream
=======
    newTaskProjectId.value = ''
    composerOpen.value = false
>>>>>>> Stashed changes
  } catch {
    showToast(taskStore.error || 'Failed to add task', 'error')
  }
}

// ---------- Status ----------
async function changeStatus(task, status) {
  try {
    await taskStore.updateTask(task.id, { status })
    showToast('Status updated')
  } catch {
    showToast(taskStore.error || 'Failed to update task', 'error')
  }
}

// ---------- Delete ----------
async function removeTask(id) {
  if (!confirm('Delete this task?')) return
  try {
    await taskStore.deleteTask(id)
    showToast('Task deleted')
  } catch {
    showToast(taskStore.error || 'Failed to delete task', 'error')
  }
}

// ---------- Edit ----------
function startEdit(task) {
  editingTask.value = task
  editingTitle.value = task.title
  editingDescription.value = task.description
  editingPriority.value = task.priority
  editingDueDate.value = task.due_date ? task.due_date.split(' ')[0] : ''
  editingUserId.value = task.user_id
}

function cancelEdit() {
  editingTask.value = null
  editingTitle.value = ''
}

async function confirmEdit() {
  if (!editingTask.value) return
  const id = editingTask.value.id
  const payload = {
    title: editingTitle.value.trim(),
    description: editingDescription.value.trim(),
    priority: editingPriority.value,
    due_date: editingDueDate.value || null,
  }
  if (auth.user?.role === 'admin' && editingUserId.value) {
    payload.user_id = editingUserId.value
  }
  try {
    await taskStore.updateTask(id, payload)
    showToast('Changes saved')
    cancelEdit()
  } catch {
    showToast(taskStore.error || 'Failed to save changes', 'error')
  }
}

// ---------- Data loading ----------
const users = ref([])

onMounted(async () => {
  if (!auth.user && auth.token) {
    try {
      await auth.fetchUser()
    } catch (e) {
      console.log(e)
      auth.localLogout()
      router.push('/login')
      return
    }
  }

  await refetchWithFilters()
<<<<<<< Updated upstream
=======

  try {
    await projectStore.fetchProjects()
  } catch (e) {
    console.error('Failed to fetch projects', e)
  }
>>>>>>> Stashed changes

  if (auth.user?.role === 'admin') {
    try {
      const { data } = await fetchUsers(auth)
      users.value = data
    } catch (e) {
      console.error('Failed to fetch users', e)
    }
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  transform: translateY(-8px);
  opacity: 0;
}
.toast-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
</style>
