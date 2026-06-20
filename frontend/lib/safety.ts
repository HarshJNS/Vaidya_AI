const EMERGENCY_KEYWORDS = [
  'chest pain',
  'seene mein dard',
  'heart attack',
  'dil ka douraa',
  "can't breathe",
  'saans nahi',
  'stroke',
  'unconscious',
  'behosh',
  'heavy bleeding',
  'overdose',
  'zyada dawa',
  'fits',
  'seizure',
]

export function quickSafetyCheck(message: string): boolean {
  const lower = message.toLowerCase()
  return EMERGENCY_KEYWORDS.some((keyword) => lower.includes(keyword))
}

