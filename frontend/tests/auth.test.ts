import { describe, expect, it } from 'vitest'
import { getProtectedInitialScreen, hasSupabaseConfig, normalizeIndianPhone } from '../lib/auth'

describe('auth helpers', () => {
  it('normalizes Indian phone numbers for Supabase OTP', () => {
    expect(normalizeIndianPhone('98765 43210')).toBe('+919876543210')
    expect(normalizeIndianPhone('+91 98765-43210')).toBe('+919876543210')
    expect(normalizeIndianPhone('12345')).toBeNull()
  })

  it('detects whether Supabase browser config is usable', () => {
    expect(hasSupabaseConfig({ NEXT_PUBLIC_SUPABASE_URL: 'https://abc.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon' })).toBe(true)
    expect(hasSupabaseConfig({ NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'public-anon-key' })).toBe(false)
    expect(hasSupabaseConfig({})).toBe(false)
  })

  it('sends unauthenticated users to login before protected screens', () => {
    expect(getProtectedInitialScreen('chat', false)).toBe('login')
    expect(getProtectedInitialScreen('home', true)).toBe('home')
    expect(getProtectedInitialScreen('login', true)).toBe('home')
  })
})
