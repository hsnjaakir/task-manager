# Taskline — Design Overhaul

## What changed

### Design system (`src/assets/main.css`)
- Removed the leftover Vue starter styles (`base.css`, `#app { width: 75% }`, `body` flex-centering) — these were actively constraining and mis-centering the whole app.
- New token system on Tailwind 4 `@theme`:
  - **Ink** (`ink-950…200`) — deep navy surfaces for the navbar, auth panel, header band, toasts.
  - **Canvas** — warm paper background (`#f2f2ee`) instead of flat gray.
  - **Brand** — cobalt scale for primary actions and accents.
  - Semantic colors: priority (rose/amber/sky), status (slate/amber/emerald).
- Self-hosted fonts via npm (no external font CDN needed):
  - **Space Grotesk** for headings, numbers, and the wordmark.
  - **Inter** for body text.
- Global visible keyboard focus + `prefers-reduced-motion` respected.

### New components (`src/components/`)
- `AppLogo.vue` — "Taskline" wordmark with a tilted check mark.
- `UserAvatar.vue` — initials avatar with a stable color per name.
- `TaskCard.vue` — one task row used everywhere (replaces three near-identical
  hand-written lists in Dashboard). Priority rail, status pill select,
  due-date chip with automatic **Overdue** highlighting, assignee chip,
  hover-revealed edit/delete actions, `readonly` mode for the user-details page.

### Pages
- **Login / Register** — new split-panel `AuthShell` (brand panel with drafting-grid
  texture + product pitch, labeled form fields with proper autocomplete attributes).
- **Dashboard** — greeting header with date, live stat chips (pending / in progress /
  completed / overdue) and an animated **completion ring**; tidy labeled composer;
  sectioned task lists with counts; restyled edit modal (backdrop click to close);
  dark toast notifications; friendly empty states.
- **Users (Team)** — card table with avatars, role badges, responsive columns.
- **User details** — fully implemented (was a "Hello" placeholder): profile card
  with task stats + read-only assigned-task list, back navigation.
- **Layout** — sticky ink navbar with active-link states, user chip with role,
  ghost logout button, footer.

### Behavior / correctness fixes (kept all existing store logic intact)
- Router: `/users/:id` is now admin-guarded like `/users` (it previously wasn't).
- Nav links now show an active state instead of hiding the current page's link.
- Toast error calls fixed (previously passed the exception object as the toast type).
- Deleted unused scaffold files (HelloWorld, TheWelcome, icons, counter store, About/Home views).

### Backend (small addition to power the User Details page)
- `GET /api/users/{id}` (admin-only) → `{ user, tasks }`
  - `UserController::show` → `UserService::getUserWithTasks` → `UserRepository::getById`

## To run
```bash
cd task-manager-frontend
npm install        # picks up the two new @fontsource packages
npm run dev
```
Backend is unchanged apart from the new route — no migration needed.

---

# Phase 2 — Features Integrated

## 1. Search, filter & sort (server-side)
- `GET /api/tasks` now accepts `status`, `priority`, `search` (matches title + description), and `sort` (`latest` | `due_date` | `priority`).
- Implemented in `TaskRepository::applyFilters()` with portable SQL (works on MySQL/SQLite/Postgres); tasks without deadlines sort last under "By deadline".
- Frontend: new `TaskFilters.vue` toolbar (debounced search — one request per pause, not per keystroke). Filters live in the Pinia store so every add/edit/delete refetches with the same filters applied.

## 2. Kanban board view (drag & drop)
- New `TaskBoard.vue` using `vuedraggable` — three columns (Pending / In progress / Completed).
- Dragging a card to another column calls the existing `PUT /tasks/{id}` with the new status and shows a toast; double-click or the pencil icon opens the edit modal.
- List ⇄ Board toggle in the toolbar; the choice is remembered in localStorage. The status filter applies only to list view (the board's columns are the statuses).
- Admins get two boards: My tasks and Team tasks (with assignee avatars).

## 3. Database indexes
- New migration `2026_07_20_000000_add_indexes_to_tasks_table.php`: indexes on `status`, `priority`, `due_date` (`user_id` is already indexed by its foreign key). Run `php artisan migrate`.

## 4. Environment-based API URL
- `axios.js` now reads `VITE_API_URL` from `.env` (falls back to `http://localhost:9000/api`). `.env` and `.env.example` added to the frontend.

## New dependency
- `vuedraggable@next` — installed via `npm install`.

## Still on the roadmap (need infrastructure decisions)
- Real-time updates (Laravel Reverb/Pusher + Echo), AI task entry (needs an LLM API key), comments/activity log, recurring tasks, calendar view.
<<<<<<< Updated upstream
=======

---

# Phase 3 — Projects feature

Tasks can now be grouped into **projects**. Full-stack, following the existing Controller → Service → Repository pattern.

## Backend
- **Migrations**
  - `create_projects_table` — id, user_id (owner), name, description, color (hex), timestamps.
  - `add_project_id_to_tasks_table` — nullable `project_id` FK on tasks with `nullOnDelete()`, so deleting a project keeps its tasks (just unassigns them). Existing tasks remain valid.
- **Model** `Project` (belongsTo user, hasMany tasks); `Task` gains a `project()` relation and `project_id` in `$fillable`.
- **ProjectRepository / ProjectService / ProjectController** — full CRUD. Regular users see and manage only their own projects; admins see all. Each project returns a live `tasks_count`.
- **Form requests** `StoreProjectRequest` / `UpdateProjectRequest` — validate name, description, and a `#RRGGBB` color.
- **Routes** `Route::apiResource('projects', ...)` inside the Sanctum group.
- **Task integration** — `project_id` is now an accepted field on task create/update, an eager-loaded relation (`project:id,name,color`), and a supported filter on `GET /tasks?project_id=`.

## Frontend
- **`projectService.js` + `stores/project.js`** — CRUD store mirroring the task store.
- **`views/Projects/ProjectList.vue`** — responsive card grid with colored accents and live task counts; create/edit modal with an 8-swatch color picker; delete with confirmation; "View tasks" deep-links to the dashboard filtered by that project. Added to the nav (all users) and router at `/projects`.
- **Dashboard integration**
  - Composer has a Project dropdown; new tasks can be filed under a project.
  - Task filtering honors a project (via the toolbar and the `?project=<id>` query param used by the "View tasks" links).
  - `TaskCard` shows a colored project badge when a task belongs to a project.

## To run
```bash
cd task-manager-backend
php artisan migrate     # inside Docker: docker compose exec laravel php artisan migrate

cd ../task-manager-frontend
npm install && npm run dev
```

## Natural next steps that build on this
- Per-project board/detail page (reuse TaskBoard filtered to one project).
- Subtasks (a `parent_id` on tasks) and project progress bars.
- Comments + activity log per task.

---

# Phase 4 — Create Task redesign (progressive quick-add)

Replaced the always-expanded 5-field composer with a progressive quick-add that makes the common case instant while keeping full control one click away.

## What changed
- **Collapsed by default** — a single line: title input ("Add a task and press Enter…"), three inline priority buttons, and Add task. Roughly a quarter of the old vertical footprint.
- **Press Enter to add** — no need to reach for the button for a quick task.
- **Priority as segmented buttons**, not a dropdown — high (up arrow / rose), medium (dash / amber), low (down arrow / sky). Click to toggle; the color encodes urgency. Faster than opening a select, and the choice is visible at a glance.
- **Details reveal on focus** — Description, Deadline, Project, and Assign-to slide in only when you focus the title (or pick a priority), then collapse again after adding or via the Collapse button.
- **Border accent** brightens (brand-200) while the composer is active, so it reads as focused.
- **Copy fixes** — labels are quiet uppercase micro-labels; Assign-to now offers "Assign to myself" as the clear default instead of a disabled placeholder.

## Responsiveness / a11y
- Mobile: priority becomes full-width labeled pills; fields stack; the icon/title/add row stays usable at 390px.
- Every control keeps a visible focus ring and an aria-label; priority buttons expose `aria-pressed`. The reveal respects `prefers-reduced-motion` (global rule).

Files touched: `src/views/Dashboard.vue` (composer markup + `composerOpen` state, `priorityOptions`, `collapseComposer`). No backend or store changes.

---

# Phase 5 — Composer layout fix + Notifications

## Create Task — horizontal balance reworked
The previous version left priority arrows stranded in the middle of the quick-add row and had an orphaned "Assign to" row in the expanded grid. Rebuilt so the horizontal rhythm is deliberate:
- **Quick-add row** is now just `[icon] [title, flexible] [Add]` — no floating middle elements. On mobile the Add button becomes a square icon button.
- **Expanded details** use one consistent layout on every screen (no separate mobile/desktop priority treatments):
  - Priority is a full-width 3-column segmented control (High/Medium/Low with direction icons + color when active).
  - Deadline / Project / Assign-to are an even 3-up grid (`lg:grid-cols-3`, `sm:grid-cols-2`, 1 col on mobile) — each field self-contained so no row is ever orphaned.
  - Description spans full width.
  - Footer has Cancel + Add task.
- Collapses back to the single line after adding or via Cancel.

## Notifications (in-app bell + email)
Triggers: **task assigned to you** and **task due soon** (within 24h), per request.

### Backend
- **`notifications` table** migration (Laravel's standard schema). `User` already had the `Notifiable` trait.
- **Notification classes** `TaskAssigned` and `TaskDueSoon`, each sending over **two channels**: `database` (in-app bell) and `mail` (email).
- **Assignment trigger** — `TaskService` now fires `TaskAssigned` on create and on update whenever a task's assignee changes to someone other than the actor (never notifies you about assigning to yourself).
- **Due-soon trigger** — `php artisan tasks:notify-due-soon` command finds incomplete tasks due within 24h and notifies each assignee; scheduled daily at 08:00 in `app/Console/Kernel.php` (Laravel 10 uses the Kernel's `schedule()` method — the `Schedule` facade is 11+ only).
- **API** — `GET /notifications` (latest 20 + unread count), `POST /notifications/{id}/read`, `POST /notifications/read-all`.

### Frontend
- **`NotificationBell.vue`** in the navbar: unread badge, dropdown with per-type icons, unread highlighting, relative timestamps, "Mark all read", click-through to the dashboard. Closes on outside-click; width-constrained on mobile.
- **`stores/notification.js`** polls every 60s (no websockets needed) and does optimistic read-marking.

### Email setup note
Email uses your existing `MAIL_*` config in `.env`. With `QUEUE_CONNECTION=sync` mail sends inline; for production set a real mailer and consider a queue. To actually send scheduled due-soon mail, run Laravel's scheduler (e.g. cron: `* * * * * php artisan schedule:run`, or inside Docker via the app container).

## To run
```bash
cd task-manager-backend
php artisan migrate      # inside Docker: docker compose exec laravel php artisan migrate

cd ../task-manager-frontend
npm install && npm run dev
```

---

# Fix — mail host (mailpit) not resolving

Adding a task that triggered an email failed with `getaddrinfo for mailpit failed` because `.env` had `MAIL_HOST=mailpit` but no such service existed in docker-compose.

Fix options (all valid):
- **Quickest:** set `MAIL_MAILER=log` in `.env`, then `php artisan config:clear`. Mail is written to `storage/logs/laravel.log`; nothing network-dependent.
- **Real inbox (applied here):** added a `mailpit` service to `task-manager-backend/docker-compose.yml` (SMTP on 1025, web UI on http://localhost:8025) and to the `laravel` service's `depends_on`. Run `docker compose up -d`; emails appear at localhost:8025. `.env` already points at `mailpit:1025`, so no env change needed.
- **No email at all:** change the `via()` method in `app/Notifications/TaskAssigned.php` and `TaskDueSoon.php` to return `['database']` only; the in-app bell keeps working.

Note: assignment emails send inline because `QUEUE_CONNECTION=sync`. For production, use a queue so a slow/broken mail server never blocks the request.
>>>>>>> Stashed changes
