'use client'

import { Mic } from 'lucide-react'

type SpeechRecognitionCtor = new () => {
  lang: string
  interimResults: boolean
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null
  start: () => void
}

export function VoiceInput({ language, onText }: { language: 'en' | 'hi'; onText: (text: string) => void }) {
  function start() {
    const browserWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionCtor
      webkitSpeechRecognition?: SpeechRecognitionCtor
    }
    const Recognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition
    if (!Recognition) return
    const recognition = new Recognition()
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
    recognition.interimResults = false
    recognition.onresult = (event) => {
      onText(event.results[0][0].transcript)
    }
    recognition.start()
  }

  return (
    <button
      type="button"
      onClick={start}
      className="focus-ring inline-grid h-11 w-11 place-items-center rounded-md border border-white/10 text-vaidya-muted hover:bg-white/5 hover:text-vaidya-text"
      aria-label="Voice input"
      title="Voice input"
    >
      <Mic size={18} />
    </button>
  )
}
