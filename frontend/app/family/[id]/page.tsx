import { AppShell } from '@/components/AppShell'

export default function MemberProfilePage({ params }: { params: { id: string } }) {
  return (
    <AppShell>
      <section className="rounded-lg border border-white/10 bg-vaidya-panel p-5">
        <p className="text-sm uppercase tracking-wide text-vaidya-muted">Family profile</p>
        <h1 className="mt-2 text-2xl font-semibold capitalize">{params.id}</h1>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {['Conditions', 'Medicines', 'Allergies'].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <h2 className="text-sm font-semibold">{item}</h2>
              <p className="mt-2 text-sm text-vaidya-muted">Connect Supabase to load saved {item.toLowerCase()}.</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  )
}

