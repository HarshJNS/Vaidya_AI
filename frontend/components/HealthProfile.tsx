'use client'

import { useState } from 'react'

const fields = [
  ['name', 'Name'],
  ['relation', 'Relation'],
  ['age', 'Age'],
  ['height', 'Height (cm)'],
  ['weight', 'Weight (kg)'],
  ['blood', 'Blood group'],
]

export function HealthProfile() {
  const [saved, setSaved] = useState(false)

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        setSaved(true)
      }}
    >
      <section className="rounded-lg border border-white/10 bg-vaidya-panel p-4">
        <h1 className="text-xl font-semibold">Health Profile</h1>
        <p className="mt-1 text-sm text-vaidya-muted">Keep the essentials complete so answers can be personal.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {fields.map(([name, label]) => (
            <label key={name} className="grid gap-1.5 text-sm">
              <span className="text-vaidya-muted">{label}</span>
              <input className="focus-ring rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-vaidya-text" />
            </label>
          ))}
        </div>
      </section>
      <section className="rounded-lg border border-white/10 bg-vaidya-panel p-4">
        <h2 className="font-semibold">Medical Details</h2>
        <div className="mt-4 grid gap-3">
          <label className="grid gap-1.5 text-sm">
            <span className="text-vaidya-muted">Conditions</span>
            <textarea className="focus-ring min-h-20 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-vaidya-text" />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-vaidya-muted">Medicines</span>
            <textarea className="focus-ring min-h-20 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-vaidya-text" />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-vaidya-muted">Allergies and notes</span>
            <textarea className="focus-ring min-h-24 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-vaidya-text" />
          </label>
        </div>
      </section>
      <div className="flex items-center gap-3">
        <button className="focus-ring rounded-md bg-vaidya-teal px-4 py-2 font-semibold text-vaidya-bg">Save</button>
        {saved && <span className="text-sm text-vaidya-teal">Saved locally. Connect Supabase to persist.</span>}
      </div>
    </form>
  )
}
