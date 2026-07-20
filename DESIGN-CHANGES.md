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
