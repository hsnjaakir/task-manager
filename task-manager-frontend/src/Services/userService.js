import api from '@/plugins/axios'

export async function fetchUsers(auth) {
  if (auth.user?.role === 'admin') {
    return api.get('/users', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
  }
}
