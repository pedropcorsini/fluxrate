import { NavLink } from 'react-router-dom'
import { ChartLine, Compass, SignOut } from '@phosphor-icons/react'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from './ThemeToggle'

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]'
      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
  }`

export function Navbar() {
  const { logout } = useAuth()

  return (
    <header className="glass-panel sticky top-0 z-40 border-x-0 border-t-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold tracking-tight">fluxrate</span>
          <nav className="flex gap-1">
            <NavLink to="/" end className={linkClasses}>
              <ChartLine size={16} weight="bold" aria-hidden="true" />
              Dashboard
            </NavLink>
            <NavLink to="/assets" className={linkClasses}>
              <Compass size={16} weight="bold" aria-hidden="true" />
              Explorar ativos
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={logout}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-down)]"
            aria-label="Sair"
          >
            <SignOut size={18} weight="bold" />
          </button>
        </div>
      </div>
    </header>
  )
}
