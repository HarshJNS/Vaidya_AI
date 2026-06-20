export type ProtectedScreen = 'login' | 'home' | 'chat' | 'family' | 'profile' | 'emergency' | 'settings' | 'admin'

type PublicEnv = Record<string, string | undefined>

export function normalizeIndianPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  const local = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits
  return local.length === 10 ? `+91${local}` : null
}

export function hasSupabaseConfig(env: PublicEnv = process.env) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(
    url &&
      anonKey &&
      url !== 'https://example.supabase.co' &&
      anonKey !== 'public-anon-key' &&
      url.includes('.supabase.co'),
  )
}

export function getProtectedInitialScreen(screen: ProtectedScreen, isAuthenticated: boolean): ProtectedScreen {
  if (!isAuthenticated) return 'login'
  return screen === 'login' ? 'home' : screen
}
