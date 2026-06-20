const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export type SseEvent = {
  text?: string
  done?: boolean
  sources?: string[]
  safety?: boolean
}

export function parseSseLines(raw: string): SseEvent[] {
  return raw
    .split('\n')
    .filter((line) => line.startsWith('data: '))
    .flatMap((line) => {
      try {
        return [JSON.parse(line.slice(6)) as SseEvent]
      } catch {
        return []
      }
    })
}

export async function sendChatMessage(
  message: string,
  userId: string,
  language: 'en' | 'hi',
  onChunk: (text: string) => void,
  onDone: (sources: string[], safetyFlagged: boolean) => void,
) {
  const response = await fetch(`${API_URL}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, user_id: userId, language }),
  })

  if (!response.ok || !response.body) {
    throw new Error('Unable to reach Vaidya backend')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    for (const event of parseSseLines(decoder.decode(value))) {
      if (event.text) onChunk(event.text)
      if (event.done) onDone(event.sources || [], event.safety || false)
    }
  }
}

export async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`)
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json() as Promise<T>
}

