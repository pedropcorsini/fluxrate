import type { ReactNode } from 'react'
import { TrendUp } from '@phosphor-icons/react'
import fluxrateSymbol from '../assets/brand/fluxrate_symbol.png'
import { Footer } from './Footer'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between p-12 bg-[#0b1120]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(500px circle at 15% 15%, rgba(129,140,248,0.35), transparent 60%), radial-gradient(500px circle at 85% 85%, rgba(34,197,94,0.25), transparent 55%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative flex items-center gap-2">
          <img src={fluxrateSymbol} alt="" className="h-8 w-8 rounded-lg" aria-hidden="true" />
          <span className="text-2xl font-semibold tracking-tight text-white">fluxrate</span>
        </div>

        <div className="relative max-w-sm">
          <div className="glass-panel mb-8 inline-flex items-center gap-3 rounded-xl px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-up)]/15 text-[var(--color-up)]">
              <TrendUp size={18} weight="bold" aria-hidden="true" />
            </span>
            <div>
              <p className="font-numeric text-sm font-semibold text-white">BTC/BRL +2.41%</p>
              <p className="text-xs text-white/50">atualizado agora</p>
            </div>
          </div>
          <h2 className="text-3xl font-semibold leading-tight text-white">
            Acompanhe cotações fiat e crypto em tempo real.
          </h2>
          <p className="mt-4 text-sm text-white/60">
            Monte sua watchlist, veja o histórico de preço e nunca perca uma variação
            relevante do mercado.
          </p>
        </div>

        <div className="relative text-xs text-white/40">© {new Date().getFullYear()} fluxrate</div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-10 px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">{footer}</div>
        </div>

        <Footer className="w-full max-w-sm" />
      </div>
    </div>
  )
}
