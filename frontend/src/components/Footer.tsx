import { GithubLogo, LinkedinLogo } from '@phosphor-icons/react'

const LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pedropassoscorsini/', icon: LinkedinLogo },
  { label: 'GitHub', href: 'https://github.com/pedropcorsini', icon: GithubLogo },
]

interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`flex flex-col items-center gap-3 text-xs text-[var(--color-text-muted)] sm:flex-row sm:justify-between ${className}`}>
      <p>© {new Date().getFullYear()} fluxrate</p>
      <div className="flex items-center gap-2">
        {LINKS.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={label}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <Icon size={18} weight="bold" aria-hidden="true" />
          </a>
        ))}
      </div>
    </footer>
  )
}
