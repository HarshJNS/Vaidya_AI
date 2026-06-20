'use client'

import { useMemo, useState } from 'react'
import { SendHorizonal } from 'lucide-react'
import { sendChatMessage } from '@/lib/api'
import { quickSafetyCheck } from '@/lib/safety'
import { EmergencyBanner } from './EmergencyBanner'
import { LanguageToggle } from './LanguageToggle'
import { VoiceInput } from './VoiceInput'

type Message = {
  id: string
  role: 'user' | 'assistant'
  text: string
  safety?: boolean
}

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'

export function ChatWindow() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text:
        'Namaste. Ask a health question and I will use the family profile, safety rules, and Ayurvedic knowledge base context where available.',
    },
  ])

  const hasQuickEmergency = useMemo(() => quickSafetyCheck(input), [input])

  async function submit() {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const assistantId = crypto.randomUUID()
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: 'user', text: trimmed },
      { id: assistantId, role: 'assistant', text: '' },
    ])
    setInput('')
    setLoading(true)

    try {
      await sendChatMessage(
        trimmed,
        DEMO_USER_ID,
        language,
        (chunk) => {
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId ? { ...message, text: message.text + chunk } : message,
            ),
          )
        },
        (_sources, safetyFlagged) => {
          setMessages((current) =>
            current.map((message) => (message.id === assistantId ? { ...message, safety: safetyFlagged } : message)),
          )
        },
      )
    } catch {
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                text:
                  'Backend is not connected yet. Start FastAPI on port 8000 and add Supabase/Gemini environment variables.',
              }
            : message,
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
      <section className="flex min-h-[70vh] flex-col rounded-lg border border-white/10 bg-vaidya-panel">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
          <div>
            <h1 className="text-xl font-semibold">Family Chat</h1>
            <p className="text-sm text-vaidya-muted">Personal answers with profile-aware safety checks</p>
          </div>
          <LanguageToggle value={language} onChange={setLanguage} />
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`max-w-[88%] rounded-lg px-4 py-3 text-sm leading-6 ${
                message.role === 'user'
                  ? 'ml-auto bg-vaidya-teal text-vaidya-bg'
                  : message.safety
                    ? 'border border-vaidya-rose/40 bg-vaidya-rose/10 text-vaidya-text'
                    : 'bg-white/[0.04] text-vaidya-text'
              }`}
            >
              {message.text || 'Thinking...'}
            </article>
          ))}
        </div>
        <div className="border-t border-white/10 p-4">
          {hasQuickEmergency && <div className="mb-3"><EmergencyBanner /></div>}
          <div className="flex gap-2">
            <VoiceInput language={language} onText={setInput} />
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={1}
              placeholder={language === 'hi' ? 'अपना सवाल लिखें...' : 'Ask about symptoms, diet, sleep, medicines...'}
              className="focus-ring min-h-11 flex-1 resize-none rounded-md border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-vaidya-text placeholder:text-vaidya-muted"
            />
            <button
              type="button"
              onClick={submit}
              disabled={loading || !input.trim()}
              className="focus-ring inline-grid h-11 w-11 place-items-center rounded-md bg-vaidya-teal text-vaidya-bg disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
              title="Send"
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      </section>
      <aside className="space-y-4">
        <EmergencyBanner />
        <section className="rounded-lg border border-white/10 bg-vaidya-panel p-4">
          <h2 className="text-sm font-semibold">Safety Rules</h2>
          <ul className="mt-3 space-y-2 text-sm text-vaidya-muted">
            <li>No stopping prescribed medicines.</li>
            <li>No exact prescription dosages.</li>
            <li>Emergency symptoms are redirected.</li>
            <li>Doctor consultation stays mandatory.</li>
          </ul>
        </section>
      </aside>
    </div>
  )
}

