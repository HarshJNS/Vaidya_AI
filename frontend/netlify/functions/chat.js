const emergencyPatterns = [
  'chest pain',
  'seene mein dard',
  "can't breathe",
  'saans nahi',
  'heart attack',
  'dil ka douraa',
  'unconscious',
  'behosh',
  'stroke',
  'heavy bleeding',
  'overdose',
  'zyada dawa',
  'seizure',
  'fits',
]

const systemPrompt = `You are Vaidya, a private personal health assistant for one family.
You combine traditional Ayurvedic wisdom with practical modern health awareness.

STRICT RULES:
1. Never suggest stopping or changing prescribed medicine.
2. Never give exact prescription dosages.
3. Never claim guaranteed cures.
4. Never diagnose serious conditions definitively.
5. Always recommend consulting a doctor for meaningful health concerns.
6. Keep responses concise.

At the end of every answer, add:
"Always consult your doctor before making health decisions."`

function sse(payload) {
  return `data: ${JSON.stringify(payload)}\n\n`
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-headers': 'content-type',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  const message = String(body.message || '').trim()
  const language = body.language === 'hi' ? 'hi' : 'en'
  if (!message) return { statusCode: 400, body: 'Message is required' }

  const lower = message.toLowerCase()
  if (emergencyPatterns.some((word) => lower.includes(word))) {
    const text =
      language === 'hi'
        ? 'यह मेडिकल इमरजेंसी हो सकती है। कृपया तुरंत 112 पर कॉल करें या नज़दीकी अस्पताल जाएं।'
        : 'This sounds like a medical emergency. Please call 112 immediately or go to the nearest hospital.'
    return {
      statusCode: 200,
      headers: {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache',
        'access-control-allow-origin': '*',
      },
      body: sse({ text, done: false }) + sse({ text: '', done: true, safety: true }),
    }
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    const text =
      'Gemini is not configured on Netlify yet. Please set GEMINI_API_KEY in Netlify environment variables.'
    return {
      statusCode: 200,
      headers: {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache',
        'access-control-allow-origin': '*',
      },
      body: sse({ text, done: false }) + sse({ text: '', done: true, sources: [] }),
    }
  }

  const model = process.env.GEMINI_MODEL || 'models/gemini-2.5-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`
  const prompt = `${systemPrompt}

${language === 'hi' ? 'Respond in Hindi using Devanagari script.' : 'Respond in English.'}

User question:
${message}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error('Gemini function error:', detail)
      throw new Error('Gemini request failed')
    }

    const data = await response.json()
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join('')
        .trim() ||
      'I could not generate a response right now. Please try again.'

    return {
      statusCode: 200,
      headers: {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache',
        'access-control-allow-origin': '*',
      },
      body: sse({ text, done: false }) + sse({ text: '', done: true, sources: [] }),
    }
  } catch {
    const text = 'Sorry, I could not connect to Gemini right now. Please try again shortly.'
    return {
      statusCode: 200,
      headers: {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache',
        'access-control-allow-origin': '*',
      },
      body: sse({ text, done: false }) + sse({ text: '', done: true, sources: [] }),
    }
  }
}

