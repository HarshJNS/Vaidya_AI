import Link from 'next/link'

export type Member = {
  id: string
  name: string
  relation: string
  age: number
  profile_pct: number
  conditions?: string[]
}

export function MemberCard({ member }: { member: Member }) {
  return (
    <Link
      href={`/family/${member.id}`}
      className="focus-ring block rounded-lg border border-white/10 bg-vaidya-panel p-4 transition hover:border-vaidya-teal/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{member.name}</h3>
          <p className="text-sm text-vaidya-muted">
            {member.relation} · {member.age} yrs
          </p>
        </div>
        <span className="rounded bg-white/5 px-2 py-1 text-xs text-vaidya-muted">{member.profile_pct}%</span>
      </div>
      <div className="mt-4 h-1.5 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-vaidya-teal" style={{ width: `${member.profile_pct}%` }} />
      </div>
      <p className="mt-3 truncate text-sm text-vaidya-muted">{member.conditions?.join(', ') || 'No conditions recorded'}</p>
    </Link>
  )
}

