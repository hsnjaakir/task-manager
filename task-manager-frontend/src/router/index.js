import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Auth/Login.vue'
import Register from '../views/Auth/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import UserList from '../views/Users/UserList.vue'
import UserDetails from '@/views/Users/UserDetails.vue'
import ProjectList from '@/views/Projects/ProjectList.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/projects', name: 'project.list', component: ProjectList, meta: { requiresAuth: true } },
  { path: '/', redirect: '/login' },
  // Admin-only routes
  {
    path: '/users',
    name: 'user.list',
    component: UserList,
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: '/users/:id',
    name: 'user.details',
    component: UserDetails,
    meta: { requiresAuth: true, adminOnly: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  // Admin-only routes bounce non-admins back to the dashboard
  if (to.meta.adminOnly && auth.user?.role !== 'admin') {
    return next('/dashboard')
  }

  next()
})

export default router
