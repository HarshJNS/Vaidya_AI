'use client'

export function LanguageToggle({
  value,
  onChange,
}: {
  value: 'en' | 'hi'
  onChange: (value: 'en' | 'hi') => void
}) {
  return (
    <div className="inline-grid grid-cols-2 rounded-md border border-white/10 bg-white/[0.03] p-1">
      {(['en', 'hi'] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={`focus-ring rounded px-3 py-1.5 text-sm font-medium ${
            value === lang ? 'bg-vaidya-teal text-vaidya-bg' : 'text-vaidya-muted hover:text-vaidya-text'
          }`}
        >
          {lang === 'en' ? 'EN' : 'हिं'}
        </button>
      ))}
    </div>
  )
}

