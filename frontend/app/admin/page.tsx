import { AlertTriangle, Activity, Users } from 'lucide-react'
import { AppShell } from '@/components/AppShell'

const stats = [
  { label: 'Members', value: '6', icon: Users },
  { label: 'Recent chats', value: '24', icon: Activity },
  { label: 'Safety flags', value: '0', icon: AlertTriangle },
]

export default function AdminPage() {
  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-vaidya-muted">Harsh-only overview of family profile readiness and safety events.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <section key={stat.label} className="rounded-lg border border-white/10 bg-vaidya-panel p-4">
            <stat.icon className="text-vaidya-teal" size={20} />
            <p className="mt-4 text-2xl font-semibold">{stat.value}</p>
            <p className="text-sm text-vaidya-muted">{stat.label}</p>
          </section>
        ))}
      </div>
      <section className="mt-4 rounded-lg border border-white/10 bg-vaidya-panel p-4">
        <h2 className="font-semibold">Recent Activity</h2>
        <div className="mt-4 divide-y divide-white/10 text-sm">
          {['Papa asked about dinner after diabetes medicine', 'Mummy updated thyroid notes', 'Dadi profile missing allergies'].map(
            (item) => (
              <p key={item} className="py-3 text-vaidya-muted">
                {item}
              </p>
            ),
          )}
        </div>
      </section>
    </AppShell>
  )
}

