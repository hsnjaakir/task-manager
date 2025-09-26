import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Auth/Login.vue'
import Register from '../views/Auth/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import UserList from '../views/Users/UserList.vue'
import UserDetails from '@/views/Users/UserDetails.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/', redirect: '/login' },
  // New Admin-only routes
  { path: '/users', name: 'user.list', component: UserList, meta: { requiresAuth: true } },
  {
    path: '/users/:id',
    name: 'user.details',
    component: UserDetails,
    meta: { requiresAuth: true },
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

  // extra: only admins can access /users
  if (to.name === 'user.list' && auth.user?.role !== 'admin') {
    return next('/dashboard')
  }

  next()
})

export default router
