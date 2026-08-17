import { createContext, useContext, useState, type ReactNode } from 'react'
import * as authLib from '../lib/auth'

interface AuthContextValue {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string, email?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(authLib.isAuthenticated)

  async function login(username: string, password: string) {
    await authLib.login(username, password)
    setIsAuthenticated(true)
  }

  async function register(username: string, password: string, email?: string) {
    await authLib.register(username, password, email)
  }

  function logout() {
    authLib.logout()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
