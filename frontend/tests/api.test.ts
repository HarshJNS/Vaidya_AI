import { describe, expect, it } from 'vitest'
import { parseSseLines } from '../lib/api'

describe('parseSseLines', () => {
  it('extracts text chunks and done payloads from SSE data lines', () => {
    const events = parseSseLines('data: {"text":"hello","done":false}\n\ndata: {"text":"","done":true,"sources":["ashtanga"]}\n\n')

    expect(events).toEqual([
      { text: 'hello', done: false },
      { text: '', done: true, sources: ['ashtanga'] },
    ])
  })

  it('ignores malformed lines', () => {
    expect(parseSseLines('event: ping\ndata: nope\n')).toEqual([])
  })
})
