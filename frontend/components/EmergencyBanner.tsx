import { AlertTriangle } from 'lucide-react'

export function EmergencyBanner() {
  return (
    <section className="rounded-lg border border-vaidya-rose/40 bg-vaidya-rose/10 p-4">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 shrink-0 text-vaidya-rose" size={20} />
        <div>
          <h2 className="text-sm font-semibold text-vaidya-text">Emergency symptoms need urgent care</h2>
          <p className="mt-1 text-sm leading-6 text-vaidya-muted">
            Chest pain, breathing trouble, stroke symptoms, unconsciousness, overdose, severe bleeding, or BP above 180
            should go to emergency services immediately. Call 112 in India.
          </p>
        </div>
      </div>
    </section>
  )
}

