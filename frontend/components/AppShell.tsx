import Link from 'next/link'
import { Activity, HeartPulse, Home, MessageCircle, Shield, Users } from 'lucide-react'

const nav = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/profile', label: 'Profile', icon: HeartPulse },
  { href: '/family', label: 'Family', icon: Users },
  { href: '/admin', label: 'Admin', icon: Shield },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="shell">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-vaidya-teal text-vaidya-bg">
              <Activity size={22} />
            </span>
            <span>
              <span className="block text-lg font-semibold leading-none">Vaidya</span>
              <span className="text-xs text-vaidya-muted">परिवार का स्वास्थ्य सहायक</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-vaidya-muted transition hover:bg-white/5 hover:text-vaidya-text"
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <div className="flex-1 pb-24 pt-6 md:pb-6">{children}</div>
        <nav className="sticky bottom-3 grid grid-cols-5 rounded-lg border border-white/10 bg-vaidya-panel/95 p-1 shadow-2xl shadow-black/30 backdrop-blur md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring grid place-items-center rounded-md px-2 py-2 text-xs text-vaidya-muted hover:bg-white/5 hover:text-vaidya-text"
              aria-label={item.label}
            >
              <item.icon size={19} />
            </Link>
          ))}
        </nav>
      </div>
    </main>
  )
}
