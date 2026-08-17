import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { useAuth } from '../context/AuthContext'
import { AuthLayout } from '../components/AuthLayout'
import { TextField } from '../components/TextField'

export function RegisterPage() {
  const { register, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await register(username, password, email || undefined)
      await login(username, password)
      navigate('/')
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data) {
        const firstError = Object.values(err.response.data).flat()[0]
        setError(typeof firstError === 'string' ? firstError : 'Não foi possível criar a conta.')
      } else {
        setError('Não foi possível criar a conta.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Comece a acompanhar cotações em segundos."
      footer={
        <>
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-[var(--color-accent)] hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <TextField
          label="Usuário"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
        />
        <TextField
          label="Email (opcional)"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
        />
        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          required
        />

        {error && (
          <p className="mb-4 rounded-lg bg-[var(--color-down)]/10 px-3 py-2 text-sm text-[var(--color-down)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer rounded-lg bg-[var(--color-accent)] py-2.5 text-sm font-medium text-[var(--color-accent-foreground)] shadow-sm transition-transform hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>
    </AuthLayout>
  )
}
