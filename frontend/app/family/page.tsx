import { AppShell } from '@/components/AppShell'
import { MemberCard, type Member } from '@/components/MemberCard'

const members: Member[] = [
  { id: 'papa', name: 'Papa', relation: 'Father', age: 58, profile_pct: 88, conditions: ['Type 2 diabetes'] },
  { id: 'mummy', name: 'Mummy', relation: 'Mother', age: 52, profile_pct: 76, conditions: ['Thyroid'] },
  { id: 'dadi', name: 'Dadi', relation: 'Grandmother', age: 78, profile_pct: 64, conditions: ['BP'] },
  { id: 'harsh', name: 'Harsh', relation: 'Admin', age: 21, profile_pct: 92, conditions: [] },
]

export default function FamilyPage() {
  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">Family</h1>
        <p className="mt-1 text-sm text-vaidya-muted">Profile status and health context for each member.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </AppShell>
  )
}

