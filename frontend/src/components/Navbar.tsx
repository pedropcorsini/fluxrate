import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from './ThemeToggle'

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-[var(--color-accent)] text-white'
      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
  }`

export function Navbar() {
  const { logout } = useAuth()

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold tracking-tight">fluxrate</span>
          <nav className="flex gap-1">
            <NavLink to="/" end className={linkClasses}>
              Dashboard
            </NavLink>
            <NavLink to="/assets" className={linkClasses}>
              Explorar ativos
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={logout}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-down)]"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}
