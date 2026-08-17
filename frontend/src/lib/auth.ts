import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

export async function login(username: string, password: string) {
  const { data } = await axios.post(`${API_URL}/token/`, { username, password })
  localStorage.setItem('access_token', data.access)
  localStorage.setItem('refresh_token', data.refresh)
}

export async function register(username: string, password: string, email?: string) {
  await axios.post(`${API_URL}/accounts/register/`, { username, password, email })
}

export function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('access_token'))
}
