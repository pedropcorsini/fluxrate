import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let isRefreshing = false
let refreshQueue: Array<() => void> = []

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      clearSession()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push(() => resolve(api(originalRequest)))
      })
    }

    isRefreshing = true
    try {
      const { data } = await axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken })
      localStorage.setItem('access_token', data.access)
      refreshQueue.forEach((resolve) => resolve())
      refreshQueue = []
      return api(originalRequest)
    } catch (refreshError) {
      clearSession()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

function clearSession() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  window.location.href = '/login'
}
