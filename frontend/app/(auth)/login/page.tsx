'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function sendOTP() {
    if (!supabase) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ phone: `+91${phone}` })
    if (!error) setStep('otp')
    setLoading(false)
  }

  async function verifyOTP() {
    if (!supabase) return
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({ phone: `+91${phone}`, token: otp, type: 'sms' })
    if (!error) router.push('/')
    setLoading(false)
  }

  return (
    <main className="shell grid min-h-screen place-items-center px-4">
      <section className="w-full max-w-sm rounded-lg border border-white/10 bg-vaidya-panel p-5">
        <h1 className="text-2xl font-semibold">Vaidya</h1>
        <p className="mt-1 text-sm text-vaidya-muted">परिवार का स्वास्थ्य सहायक</p>
        {step === 'phone' ? (
          <div className="mt-8 grid gap-3">
            <label className="grid gap-1.5 text-sm">
              <span className="text-vaidya-muted">Mobile number</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
                className="focus-ring rounded-md border border-white/10 bg-white/[0.04] px-3 py-3 text-lg tracking-widest text-vaidya-text"
                placeholder="10-digit number"
                inputMode="tel"
              />
            </label>
            <button
              onClick={sendOTP}
              disabled={!supabase || phone.length !== 10 || loading}
              className="focus-ring rounded-md bg-vaidya-teal px-4 py-3 font-semibold text-vaidya-bg disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-3">
            <label className="grid gap-1.5 text-sm">
              <span className="text-vaidya-muted">OTP sent to +91 {phone}</span>
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                className="focus-ring rounded-md border border-white/10 bg-white/[0.04] px-3 py-3 text-center text-2xl tracking-[0.25em] text-vaidya-text"
                placeholder="000000"
                inputMode="numeric"
              />
            </label>
            <button
              onClick={verifyOTP}
              disabled={!supabase || otp.length !== 6 || loading}
              className="focus-ring rounded-md bg-vaidya-teal px-4 py-3 font-semibold text-vaidya-bg disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Enter'}
            </button>
            <button onClick={() => setStep('phone')} className="focus-ring rounded-md px-4 py-2 text-sm text-vaidya-muted">
              Change number
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
