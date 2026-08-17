import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login(username, password)
      navigate('/')
    } catch {
      setError('Usuário ou senha inválidos.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
      >
        <h1 className="mb-1 text-xl font-semibold">fluxrate</h1>
        <p className="mb-6 text-sm text-[var(--color-text-muted)]">Entre na sua conta</p>

        <label className="mb-1 block text-sm text-[var(--color-text-muted)]">Usuário</label>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="mb-4 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          required
        />

        <label className="mb-1 block text-sm text-[var(--color-text-muted)]">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-4 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          required
        />

        {error && <p className="mb-4 text-sm text-[var(--color-down)]">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-[var(--color-accent)] py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
          Não tem conta?{' '}
          <Link to="/register" className="text-[var(--color-accent)]">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  )
}
