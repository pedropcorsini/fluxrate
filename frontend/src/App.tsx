import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { AssetsPage } from './pages/AssetsPage'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(600px circle at 10% 0%, var(--color-accent), transparent 60%), radial-gradient(500px circle at 90% 20%, var(--color-up), transparent 55%), radial-gradient(450px circle at 50% 100%, var(--color-accent-secondary), transparent 50%)',
          filter: 'blur(60px)',
        }}
      />
      <Navbar />
      {children}
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedLayout>
            <DashboardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/assets"
        element={
          <ProtectedLayout>
            <AssetsPage />
          </ProtectedLayout>
        }
      />
    </Routes>
  )
}
