'use client'

import { useEffect, useRef, useState } from 'react'

type Screen = 'login' | 'home' | 'chat' | 'family' | 'profile' | 'emergency' | 'settings' | 'admin'
type Lang = 'en' | 'hi'
type MemberKey = 'papa' | 'mummy' | 'dadi' | 'bhai' | 'didi' | 'harsh'

type Member = {
  name: string
  relation: string
  age: number
  av: string
  cls: string
  height: number
  weight: number
  blood: string
  dob: string
  conditions: string[]
  medicines: { name: string; dose: string; freq: string }[]
  allergies: string[]
  insight: string
}

type Message = {
  id: string
  role: 'ai' | 'user'
  text: string
  sources?: string[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

const members: Record<MemberKey, Member> = {
  papa: {
    name: 'Papa',
    relation: 'Father',
    age: 58,
    av: 'P',
    cls: 'av-teal',
    height: 172,
    weight: 78,
    blood: 'O+',
    dob: '12 Mar 1966',
    conditions: ['Type 2 diabetes', 'Hypertension', 'Knee arthritis'],
    medicines: [
      { name: 'Metformin', dose: '500mg', freq: 'Twice daily' },
      { name: 'Amlodipine', dose: '5mg', freq: 'Once daily' },
      { name: 'Atorvastatin', dose: '10mg', freq: 'Night' },
    ],
    allergies: ['Sulfa drugs', 'Penicillin'],
    insight:
      "Given Papa's diabetes and hypertension, avoid high-sodium and sugary preparations. Triphala churna is safe. Turmeric with warm water daily is suitable.",
  },
  mummy: {
    name: 'Mummy',
    relation: 'Mother',
    age: 54,
    av: 'M',
    cls: 'av-purple',
    height: 158,
    weight: 62,
    blood: 'B+',
    dob: '5 Jul 1970',
    conditions: ['Hypothyroidism'],
    medicines: [{ name: 'Thyroxine', dose: '75mcg', freq: 'Morning empty stomach' }],
    allergies: [],
    insight:
      "For Mummy's thyroid condition, avoid raw cruciferous vegetables like cabbage and cauliflower. Ashwagandha may interact for some people, so ask her doctor first.",
  },
  dadi: {
    name: 'Dadi',
    relation: 'Grandmother',
    age: 76,
    av: 'D',
    cls: 'av-coral',
    height: 152,
    weight: 58,
    blood: 'A+',
    dob: '3 Jan 1948',
    conditions: ['High BP', 'Joint pain'],
    medicines: [],
    allergies: ['Aspirin'],
    insight: "Dadi's medicines list is incomplete. Please add her current BP medications for accurate suggestions.",
  },
  bhai: {
    name: 'Bhai',
    relation: 'Brother',
    age: 26,
    av: 'B',
    cls: 'av-blue',
    height: 175,
    weight: 68,
    blood: 'O+',
    dob: '15 Sep 1998',
    conditions: [],
    medicines: [],
    allergies: [],
    insight: 'Bhai has no recorded conditions. Preventive care: regular exercise, sleep, and a consistent meal routine.',
  },
  didi: {
    name: 'Didi',
    relation: 'Sister',
    age: 30,
    av: 'S',
    cls: 'av-amber',
    height: 162,
    weight: 55,
    blood: 'AB+',
    dob: '22 Feb 1994',
    conditions: ['Chronic migraine'],
    medicines: [{ name: 'Sumatriptan', dose: '50mg', freq: 'As needed' }],
    allergies: [],
    insight:
      "For Didi's migraines, avoid known food triggers and excess screen time. For recurring attacks, keep her doctor involved.",
  },
  harsh: {
    name: 'Harsh',
    relation: 'You',
    age: 22,
    av: 'H',
    cls: 'av-teal',
    height: 178,
    weight: 72,
    blood: 'O+',
    dob: '10 Mar 2002',
    conditions: [],
    medicines: [],
    allergies: [],
    insight: 'You are healthy. Preventive care: consistent sleep, exercise, and regular health checkups.',
  },
}

const emergencyWords = [
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

const demoResponses = {
  remedies:
    'For general wellness, Triphala at night with warm water can support digestion. Turmeric in daily cooking is also helpful for inflammation. Please avoid strong herbs if someone is on BP, diabetes, or blood thinner medicines without asking the doctor.',
  medicines:
    'I can help flag possible herb-medicine concerns, but I cannot advise stopping or changing prescribed medicines. For Papa on diabetes and BP medicines, avoid licorice root preparations unless his doctor approves.',
  diet:
    'For the family: keep salt modest for BP, avoid sugary preparations for diabetes, and keep thyroid medicines separated from food as prescribed. Simple home food with dal, vegetables, curd if tolerated, and regular meal timing is best.',
  default:
    "Based on your family's health profiles, I can help with Ayurvedic guidance, diet suggestions, symptom understanding, and herb-medicine safety checks. Always consult your doctor before making health decisions.",
}

function uid() {
  return Math.random().toString(36).slice(2)
}

function StatusBar({ time }: { time: string }) {
  return (
    <div className="sbar">
      <span className="sbar-time">{time}</span>
      <div className="sbar-icons">●●●</div>
    </div>
  )
}

function Avatar({ member, size = 34, active = false }: { member: Member; size?: number; active?: boolean }) {
  return (
    <div
      className={`av ${member.cls}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(10, Math.round(size / 3)),
        border: active ? '2px solid var(--teal)' : '1.5px solid var(--border2)',
      }}
    >
      {member.av}
    </div>
  )
}

function Pill({ children, tone = 'teal' }: { children: React.ReactNode; tone?: 'teal' | 'red' | 'amber' | 'purple' }) {
  return <span className={`pill pill-${tone}`}>{children}</span>
}

export function MobileVaidyaApp({ initialScreen = 'home' }: { initialScreen?: Screen }) {
  const [screen, setScreen] = useState<Screen>(initialScreen)
  const [stack, setStack] = useState<Screen[]>([])
  const [lang, setLang] = useState<Lang>('en')
  const [toast, setToast] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loginStep, setLoginStep] = useState<'phone' | 'otp'>('phone')
  const [selectedMember, setSelectedMember] = useState<MemberKey>('papa')
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [time, setTime] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'hello',
      role: 'ai',
      text: 'Namaskar! Main Vaidya hoon — aapka personal Ayurvedic health assistant. Aaj kaise madad kar sakta hoon?',
      sources: ['Vaidya'],
    },
  ])
  const chatRef = useRef<HTMLDivElement>(null)

  const member = members[selectedMember]
  const langLabel = lang === 'hi' ? 'हि' : 'EN'

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const existing = document.getElementById('vaidya-mobile-styles')
    if (existing) return
    const style = document.createElement('style')
    style.id = 'vaidya-mobile-styles'
    style.textContent = mobileStylesForReference
    document.head.appendChild(style)
  }, [])

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight })
  }, [messages, isTyping])

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  function navigate(to: Screen) {
    if (to === screen) return
    setStack((current) => [...current, screen])
    setScreen(to)
  }

  function goBack() {
    setStack((current) => {
      const next = [...current]
      const previous = next.pop() || 'home'
      setScreen(previous)
      return next
    })
  }

  function toggleLang() {
    setLang((current) => (current === 'en' ? 'hi' : 'en'))
    showToast(lang === 'en' ? 'Hindi mode on' : 'English mode on')
  }

  function goToProfile(key: MemberKey) {
    setSelectedMember(key)
    navigate('profile')
  }

  function quickAsk(type: keyof typeof demoResponses) {
    navigate('chat')
    window.setTimeout(() => sendMessage(type === 'default' ? demoResponses.default : {
      remedies: 'What are good Ayurvedic remedies for the family?',
      medicines: 'Can you check medicine interactions for Papa?',
      diet: 'What diet should our family follow given their conditions?',
    }[type] || 'How do I understand common symptoms in Ayurveda?'), 250)
  }

  async function sendMessage(forced?: string) {
    const msg = (forced || input).trim()
    if (!msg || isTyping) return

    setInput('')
    setMessages((current) => [...current, { id: uid(), role: 'user', text: msg }])
    setIsTyping(true)

    const lower = msg.toLowerCase()
    if (emergencyWords.some((word) => lower.includes(word))) {
      window.setTimeout(() => {
        setMessages((current) => [
          ...current,
          {
            id: uid(),
            role: 'ai',
            text: 'This sounds like a medical emergency. Please call 112 immediately or go to the nearest hospital. Do not wait.',
          },
        ])
        setIsTyping(false)
        navigate('emergency')
      }, 500)
      return
    }

    if (API_URL) {
      const chatUrl = API_URL === 'netlify' ? '/.netlify/functions/chat' : `${API_URL}/chat/`
      const aiId = uid()
      setMessages((current) => [...current, { id: aiId, role: 'ai', text: '' }])
      try {
        const response = await fetch(chatUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg, user_id: '00000000-0000-0000-0000-000000000001', language: lang }),
        })
        if (!response.ok || !response.body) throw new Error('Chat request failed')
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const lines = decoder.decode(value).split('\n')
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            try {
              const data = JSON.parse(line.slice(6)) as { text?: string; done?: boolean; sources?: string[] }
              if (data.text) {
                setMessages((current) =>
                  current.map((item) => (item.id === aiId ? { ...item, text: item.text + data.text } : item)),
                )
              }
              if (data.done && data.sources?.length) {
                setMessages((current) =>
                  current.map((item) => (item.id === aiId ? { ...item, sources: data.sources } : item)),
                )
              }
            } catch {}
          }
        }
      } catch {
        setMessages((current) =>
          current.map((item) =>
            item.id === aiId
              ? { ...item, text: 'Sorry, I could not connect right now. Please check the backend and try again.' }
              : item,
          ),
        )
      } finally {
        setIsTyping(false)
      }
      return
    }

    window.setTimeout(() => {
      let response = demoResponses.default
      if (lower.includes('remedy') || lower.includes('upay') || lower.includes('gharelu')) response = demoResponses.remedies
      if (lower.includes('medicine') || lower.includes('dawa') || lower.includes('tablet')) response = demoResponses.medicines
      if (lower.includes('diet') || lower.includes('food') || lower.includes('khana') || lower.includes('khaana')) response = demoResponses.diet
      setMessages((current) => [...current, { id: uid(), role: 'ai', text: response, sources: ['Ashtanga Hridayam'] }])
      setIsTyping(false)
    }, 700)
  }

  return (
    <>
      <div id="app">
        <div id="toast" className={toast ? 'show' : ''}>
          {toast}
        </div>

        <section className={`screen ${screen === 'login' ? '' : 'hidden'}`}>
          <StatusBar time={time} />
          <div className="scroll login-scroll">
            <div className="login-brand">
              <div className="brand-icon">⌂</div>
              <h1>Vaidya</h1>
              <p>परिवार का स्वास्थ्य सहायक</p>
              <small>Family health assistant</small>
            </div>
            {loginStep === 'phone' ? (
              <div>
                <label className="form-label">Mobile number</label>
                <div className="phone-row">
                  <div className="country">+91</div>
                  <input
                    className="input-field"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit number"
                  />
                </div>
                <button
                  className="btn-primary"
                  disabled={phone.length !== 10}
                  onClick={() => {
                    setLoginStep('otp')
                    showToast(`OTP sent to +91 ${phone}`)
                  }}
                >
                  Send OTP
                </button>
                <p className="login-note">Only family members can access Vaidya</p>
              </div>
            ) : (
              <div>
                <p className="otp-text">OTP sent to +91 {phone}</p>
                <label className="form-label">Enter OTP</label>
                <input
                  className="input-field otp-input"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6-digit code"
                />
                <button
                  className="btn-primary"
                  disabled={otp.length !== 6}
                  onClick={() => {
                    showToast('Welcome to Vaidya!')
                    setScreen('home')
                  }}
                >
                  Verify & Enter
                </button>
                <button className="btn-ghost" onClick={() => setLoginStep('phone')}>
                  Change number
                </button>
              </div>
            )}
          </div>
        </section>

        <section className={`screen ${screen === 'home' ? '' : 'hidden'}`}>
          <StatusBar time={time} />
          <div className="home-head">
            <div>
              <div className="app-title">Vaidya</div>
              <div className="subtitle">Good morning — how is everyone feeling?</div>
            </div>
            <button className="lang-btn" onClick={toggleLang}>
              {langLabel} ◌
            </button>
            <div className="avatars">
              {(Object.keys(members) as MemberKey[]).map((key) => (
                <button key={key} onClick={() => goToProfile(key)} className="avatar-btn">
                  <Avatar member={members[key]} active={key === 'harsh'} />
                </button>
              ))}
              <span>6 members</span>
            </div>
          </div>
          <div className="scroll body-scroll">
            <button className="emrg" onClick={() => navigate('emergency')}>
              <span>!</span>
              <span className="emrg-text">Emergency — call doctor now</span>
              <span className="chev">›</span>
            </button>
            <div className="block">
              <div className="section-lbl">Quick ask</div>
              <div className="quick-icons" aria-hidden="true">
                <span>🌿</span>
                <span>💊</span>
                <span>🥗</span>
                <span>🩺</span>
              </div>
              <div className="quick-grid">
                <button className="card" onClick={() => quickAsk('remedies')}>
                  <span className="quick-card-icon">🌿</span>
                  <b>Remedies</b>
                  <span>Ayurvedic solutions</span>
                </button>
                <button className="card" onClick={() => quickAsk('medicines')}>
                  <span className="quick-card-icon">💊</span>
                  <b>Medicines</b>
                  <span>Check interactions</span>
                </button>
                <button className="card" onClick={() => quickAsk('diet')}>
                  <span className="quick-card-icon">🥗</span>
                  <b>Diet & food</b>
                  <span>What to eat / avoid</span>
                </button>
                <button className="card" onClick={() => quickAsk('default')}>
                  <span className="quick-card-icon">🩺</span>
                  <b>Symptoms</b>
                  <span>What does this mean</span>
                </button>
              </div>
            </div>
            <div className="block">
              <div className="section-lbl">Recent</div>
              <div className="recent-list">
                {[
                  ['Papa', 'P', 'Subah ghutne mein dard hota hai...'],
                  ['Mummy', 'M', 'Thyroid ke liye kaunsa diet follow karein...'],
                ].map((item) => (
                  <button key={item[0]} className="card-sm recent" onClick={() => navigate('chat')}>
                    <div>
                      <span className="tiny-avatar">{item[1]}</span>
                      <span>{item[0]} · answered</span>
                      <Pill>Answered</Pill>
                    </div>
                    <p>{item[2]}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="askbar">
            <button onClick={() => navigate('chat')}>Ask anything about health...</button>
            <button className="mic" onClick={() => showToast('Voice not supported in this preview')}>⌕</button>
          </div>
          <BottomNav screen={screen} navigate={navigate} />
        </section>

        <section className={`screen ${screen === 'chat' ? '' : 'hidden'}`}>
          <StatusBar time={time} />
          <div className="nav-hdr">
            <button className="nav-back" onClick={goBack}>←</button>
            <div className="center">
              <div className="nav-title">Vaidya</div>
              <div className="online">● Online</div>
            </div>
            <div className="chat-actions">
              <Avatar member={member} size={30} />
              <button className="nav-action" onClick={toggleLang}>{langLabel}</button>
            </div>
          </div>
          <div className="scroll chat-messages" ref={chatRef}>
            {messages.map((message) => (
              <div className={message.role === 'user' ? 'msg user' : 'msg ai'} key={message.id}>
                <div className={message.role === 'user' ? 'bubble-user' : 'bubble-ai'}>
                  <div className="bubble-text">{message.text || 'Thinking...'}</div>
                  {message.sources?.length ? (
                    <div className="sources">
                      {message.sources.map((source) => (
                        <span key={source}>📚 {source}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {isTyping ? (
              <div className="typing-wrap">
                <div className="bubble-ai typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            ) : null}
          </div>
          <div className="chat-inputbar">
            <div className="textarea-wrap">
              <textarea
                id="chat-input"
                className="input-field"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Type your question..."
                rows={1}
              />
              <button id="send-btn" onClick={() => sendMessage()} aria-label="Send message">➤</button>
            </div>
            <button className="voice" onClick={() => showToast('Voice not supported in this preview')}>⌕</button>
          </div>
        </section>

        <section className={`screen ${screen === 'family' ? '' : 'hidden'}`}>
          <StatusBar time={time} />
          <div className="plain-head">
            <h2>Family</h2>
            <p>6 members · tap to view profile</p>
          </div>
          <div className="scroll">
            {(Object.keys(members) as MemberKey[]).map((key) => {
              const item = members[key]
              return (
                <button className="member-row" key={key} onClick={() => goToProfile(key)}>
                  <Avatar member={item} size={46} active={key === 'harsh'} />
                  <div className="member-info">
                    <div className="member-name">
                      {item.name} {key === 'harsh' ? <span className="admin-tag">Admin</span> : null}
                    </div>
                    <div className="member-sub">
                      {item.age} yrs · {item.relation} · {item.conditions.join(', ') || 'No conditions'}
                    </div>
                    <div className="pill-row">
                      {item.conditions.slice(0, 2).map((condition) => (
                        <Pill key={condition} tone={condition.includes('BP') || condition.includes('diabetes') ? 'red' : 'amber'}>
                          {condition}
                        </Pill>
                      ))}
                      <Pill>Profile {key === 'dadi' ? '80' : '100'}%</Pill>
                    </div>
                  </div>
                  <span className="row-chev">›</span>
                </button>
              )
            })}
          </div>
          <BottomNav screen={screen} navigate={navigate} />
        </section>

        <section className={`screen ${screen === 'profile' ? '' : 'hidden'}`}>
          <StatusBar time={time} />
          <div className="nav-hdr">
            <button className="nav-back" onClick={goBack}>←</button>
            <div className="nav-title">Health profile</div>
            <button className="nav-action" onClick={() => showToast('Edit profile coming soon')}>✎</button>
          </div>
          <div className="scroll">
            <div className="profile-hero">
              <Avatar member={member} size={60} active />
              <div>
                <h2>{member.name}</h2>
                <p>{member.relation} · {member.age} years old</p>
                <Pill>Profile complete</Pill>
              </div>
            </div>
            <div className="stat-grid">
              <div className="stat-box"><b>{member.height}</b><span>Height cm</span></div>
              <div className="stat-box"><b>{member.weight}</b><span>Weight kg</span></div>
              <div className="stat-box"><b>{member.blood}</b><span>Blood group</span></div>
            </div>
            <DetailBlock title="Basic details" rows={[['Date of birth', member.dob], ['Activity level', 'Light'], ['Sleep hours', '6-7 hrs'], ['Diet type', 'Vegetarian']]} />
            <ChipBlock title="Conditions" items={member.conditions.length ? member.conditions : ['No conditions recorded']} tone={member.conditions.length ? 'red' : 'teal'} />
            <div className="detail-section">
              <div className="section-lbl no-pad">Current medicines</div>
              {member.medicines.length ? member.medicines.map((med) => (
                <div className="card-sm med" key={med.name}>
                  <span>{med.name}</span>
                  <Pill tone="purple">{med.dose} · {med.freq}</Pill>
                </div>
              )) : <div className="card-sm muted">No medicines recorded</div>}
            </div>
            <ChipBlock title="Allergies" items={member.allergies.length ? member.allergies : ['No allergies recorded']} tone={member.allergies.length ? 'red' : 'teal'} />
            <div className="insight">
              <b>✦ Vaidya&apos;s insight for {member.name}</b>
              <p>{member.insight}</p>
              <small>Based on this health profile</small>
            </div>
            <div className="profile-actions">
              <button onClick={() => navigate('chat')}>Ask about {member.name}</button>
              <button onClick={() => navigate('chat')}>Chat history</button>
            </div>
          </div>
        </section>

        <section className={`screen ${screen === 'emergency' ? '' : 'hidden'}`}>
          <StatusBar time={time} />
          <div className="nav-hdr">
            <button className="nav-back" onClick={goBack}>←</button>
            <div className="nav-title red">Emergency</div>
            <div className="spacer" />
          </div>
          <div className="scroll emergency-screen">
            <div className="danger-card">
              <div className="danger-icon">!</div>
              <h2>Call emergency services NOW</h2>
              <p>Do not wait. Do not try home remedies first.</p>
            </div>
            <a className="call-main" href="tel:112">Call 112 — Emergency</a>
            <a className="call-alt" href="tel:108">Call 108 — Ambulance</a>
            <div className="section-lbl no-pad">Recognize these emergencies</div>
            {['Chest pain or tightness', "Can't breathe", 'Face drooping / sudden weakness', 'Unconscious / not responding', 'BP above 180'].map((item) => (
              <div className="card-sm emergency-item" key={item}>
                <b>{item}</b>
                <span>Go to ER immediately</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`screen ${screen === 'settings' ? '' : 'hidden'}`}>
          <StatusBar time={time} />
          <div className="plain-head"><h2>Settings</h2></div>
          <div className="scroll settings-list">
            <button className="card setting" onClick={toggleLang}>
              <span><b>Language</b><small>Hindi / English toggle</small></span>
              <span className="lang-btn">{langLabel}</span>
            </button>
            <button className="card setting red-text" onClick={() => navigate('emergency')}>Emergency contacts & info</button>
            <div className="card setting"><span><b>About Vaidya</b><small>Private family health assistant. Always consult your doctor for serious health decisions.</small></span></div>
            <button className="card setting teal-text" onClick={() => navigate('admin')}>Admin dashboard</button>
            <button className="btn-ghost" onClick={() => setScreen('login')}>Sign out</button>
          </div>
          <BottomNav screen={screen} navigate={navigate} />
        </section>

        <section className={`screen ${screen === 'admin' ? '' : 'hidden'}`}>
          <StatusBar time={time} />
          <div className="nav-hdr">
            <button className="nav-back" onClick={goBack}>←</button>
            <div className="nav-title">Admin dashboard</div>
            <div className="spacer" />
          </div>
          <div className="scroll admin-screen">
            <div className="admin-stats">
              <div><b>6</b><span>Total members</span></div>
              <div><b>2</b><span>Safety alerts</span></div>
            </div>
            <div className="section-lbl no-pad">All members</div>
            {(['papa', 'mummy', 'dadi'] as MemberKey[]).map((key) => (
              <button className="card-sm admin-row" key={key} onClick={() => goToProfile(key)}>
                <Avatar member={members[key]} size={36} />
                <span><b>{members[key].name} · {members[key].age}</b><small>{members[key].conditions.join(', ') || 'No conditions'}</small></span>
                <Pill tone={key === 'papa' ? 'red' : key === 'dadi' ? 'amber' : 'teal'}>{key === 'papa' ? '2 alerts' : key === 'dadi' ? 'Incomplete' : 'OK'}</Pill>
              </button>
            ))}
            <div className="section-lbl no-pad">Recent safety flags</div>
            <div className="flag red-flag"><b>Papa · Chest tightness mentioned</b><span>Redirected to emergency info · 3h ago</span></div>
            <div className="flag"><b>Dadi · Asked about stopping BP medicine</b><span>Hard blocked · 1d ago</span></div>
          </div>
        </section>
      </div>
    </>
  )
}

function BottomNav({ screen, navigate }: { screen: Screen; navigate: (screen: Screen) => void }) {
  const items: { screen: Screen; label: string; icon: string }[] = [
    { screen: 'home', label: 'Home', icon: '⌂' },
    { screen: 'family', label: 'Family', icon: '♙' },
    { screen: 'chat', label: 'Chat', icon: '◌' },
    { screen: 'settings', label: 'Settings', icon: '⚙' },
  ]
  return (
    <div className="bnav">
      {items.map((item) => (
        <button key={item.screen} className={`bnav-item ${screen === item.screen ? 'active' : ''}`} onClick={() => navigate(item.screen)}>
          <span className="bnav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}

function DetailBlock({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="detail-section">
      <div className="section-lbl no-pad">{title}</div>
      {rows.map(([label, value]) => (
        <div className="detail-row" key={label}>
          <span>{label}</span>
          <b>{value}</b>
        </div>
      ))}
    </div>
  )
}

function ChipBlock({ title, items, tone }: { title: string; items: string[]; tone: 'teal' | 'red' | 'amber' | 'purple' }) {
  return (
    <div className="detail-section">
      <div className="section-lbl no-pad">{title}</div>
      <div className="chip-row">
        {items.map((item) => <Pill key={item} tone={tone}>{item}</Pill>)}
      </div>
    </div>
  )
}

export const mobileStylesForReference = `
:root {
  --bg:#0F1117; --bg2:#141820; --bg3:#1a1d27; --border:rgba(255,255,255,.08);
  --border2:rgba(255,255,255,.14); --text:#E8DCC8; --text2:rgba(232,220,200,.5);
  --text3:rgba(232,220,200,.28); --teal:#5DCAA5; --teal-bg:rgba(29,158,117,.12);
  --teal-bd:rgba(29,158,117,.25); --teal-dk:#0F6E56; --amber:#EF9F27;
  --amber-bg:rgba(186,117,23,.12); --purple:#AFA9EC; --purple-bg:rgba(83,74,183,.12);
  --red:#F09595; --red-bg:rgba(163,45,45,.12); --red-bd:rgba(163,45,45,.28);
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{height:100%;overflow:hidden;background:var(--bg);font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:var(--text)}
body{margin:0}
button,input,textarea{font:inherit}
button{cursor:pointer}
#app{height:100vh;display:flex;flex-direction:column;max-width:480px;margin:0 auto;position:relative;overflow:hidden;background:var(--bg)}
.screen{position:absolute;inset:0;display:flex;flex-direction:column;background:var(--bg)}
.screen.hidden{display:none}
.sbar{display:flex;justify-content:space-between;align-items:center;padding:12px 20px 6px;flex-shrink:0}
.sbar-time{font-size:13px;font-weight:600}.sbar-icons{font-size:11px;color:var(--text2)}
.scroll{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch}.scroll::-webkit-scrollbar{display:none}
.nav-hdr{display:flex;align-items:center;justify-content:space-between;padding:8px 20px 12px;flex-shrink:0}
.nav-back,.nav-action{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.06);border:.5px solid var(--border2);display:flex;align-items:center;justify-content:center;color:var(--text2)}
.nav-title{font-size:15px;font-weight:500}.center{text-align:center}.online{font-size:10px;color:var(--teal);margin-top:1px}.chat-actions{display:flex;align-items:center;gap:6px}.spacer{width:34px}.red{color:var(--red)}
.home-head,.plain-head{padding:6px 20px 14px;flex-shrink:0}.app-title,.plain-head h2{font-size:22px;font-weight:600;letter-spacing:-.3px;margin:0}.subtitle,.plain-head p{font-size:11px;color:var(--text3);margin-top:2px}.avatars{display:flex;gap:8px;align-items:center;margin-top:14px}.avatars span{font-size:10px;color:var(--text3);margin-left:2px}.avatar-btn{background:transparent;border:0;padding:0}
.av{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;flex-shrink:0}.av-teal{background:#1D4A3A;color:var(--teal)}.av-purple{background:#3C2A5A;color:var(--purple)}.av-coral{background:#4A2010;color:#F0997B}.av-blue{background:#0C2A4A;color:#85B7EB}.av-amber{background:#3A2A00;color:var(--amber)}
.lang-btn{background:rgba(255,255,255,.06);border:.5px solid var(--border2);border-radius:20px;padding:5px 11px;color:var(--text2);font-size:11px;font-weight:500}
.body-scroll{padding-bottom:20px}.emrg{background:var(--red-bg);border:.5px solid var(--red-bd);border-radius:12px;padding:11px 14px;display:flex;align-items:center;gap:10px;margin:0 20px;width:calc(100% - 40px);color:var(--red)}.emrg-text{font-size:12px;font-weight:500}.chev{margin-left:auto;opacity:.5}
.block{margin-top:22px}.section-lbl{font-size:10px;font-weight:600;color:var(--text3);letter-spacing:1.2px;text-transform:uppercase;margin-bottom:10px;padding:0 20px}.section-lbl.no-pad{padding:0}
.quick-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 20px}.card,.card-sm{background:rgba(255,255,255,.04);border:.5px solid var(--border);color:var(--text);text-align:left}.card{border-radius:16px;padding:14px}.card b{font-size:13px;display:block}.card span,.card small{display:block;font-size:10px;color:var(--text3);margin-top:4px;line-height:1.5}.card-sm{border-radius:12px;padding:10px 12px}
.recent-list{padding:0 20px;display:flex;flex-direction:column;gap:8px}.recent>div{display:flex;align-items:center;gap:8px;margin-bottom:7px}.recent p{font-size:12px;color:var(--text);line-height:1.5;margin:0}.tiny-avatar{width:26px;height:26px;border-radius:50%;background:#1D4A3A;color:var(--teal);display:inline-flex;align-items:center;justify-content:center;font-weight:600;font-size:10px}
.pill{display:inline-block;font-size:10px;padding:3px 9px;border-radius:20px;font-weight:500}.pill-teal{background:var(--teal-bg);color:var(--teal);border:.5px solid var(--teal-bd)}.pill-red{background:var(--red-bg);color:var(--red);border:.5px solid var(--red-bd)}.pill-amber{background:var(--amber-bg);color:var(--amber);border:.5px solid rgba(186,117,23,.25)}.pill-purple{background:var(--purple-bg);color:var(--purple);border:.5px solid rgba(83,74,183,.25)}
.askbar,.chat-inputbar{padding:10px 20px max(18px,env(safe-area-inset-bottom));border-top:.5px solid var(--border);background:rgba(15,17,23,.95);backdrop-filter:blur(12px);display:flex;gap:8px;align-items:center;flex-shrink:0}.askbar button:first-child{flex:1;background:rgba(255,255,255,.05);border:.5px solid var(--border2);border-radius:22px;padding:10px 16px;text-align:left;font-size:13px;color:var(--text3)}.mic,.voice{width:42px;height:42px;background:var(--teal-dk);border-radius:50%;border:0;color:var(--teal);flex-shrink:0}
.bnav{display:flex;justify-content:space-around;align-items:center;padding:10px 0 max(18px,env(safe-area-inset-bottom));border-top:.5px solid var(--border);background:rgba(10,13,20,.95);backdrop-filter:blur(12px);flex-shrink:0}.bnav-item{display:flex;flex-direction:column;align-items:center;gap:3px;padding:4px 16px;border-radius:10px;background:transparent;border:0;color:var(--text3);font-size:9px;font-weight:500}.bnav-icon{font-size:20px;line-height:20px}.bnav-item.active{color:var(--teal)}
.chat-messages{padding:8px 16px 16px;display:flex;flex-direction:column;gap:12px}.msg{display:flex;flex-direction:column}.msg.user{align-items:flex-end}.msg.ai{align-items:flex-start}.bubble-ai,.bubble-user{padding:12px 14px;max-width:85%;border:.5px solid var(--border2)}.bubble-ai{background:rgba(255,255,255,.05);border-radius:4px 16px 16px 16px}.bubble-user{background:#1D3A2A;border-color:var(--teal-dk);border-radius:16px 4px 16px 16px}.bubble-text{font-size:13px;line-height:1.6;color:var(--text);white-space:pre-wrap}.sources{margin-top:6px;display:flex;gap:4px;flex-wrap:wrap}.sources span{background:var(--teal-bg);color:var(--teal);font-size:9px;padding:2px 6px;border-radius:4px;border:.5px solid var(--teal-bd)}
.typing-wrap{display:flex}.typing{display:inline-flex;gap:4px;align-items:center}.typing-dot{width:6px;height:6px;border-radius:50%;background:var(--teal);display:inline-block;animation:typing 1.2s infinite ease-in-out}.typing-dot:nth-child(2){animation-delay:.2s}.typing-dot:nth-child(3){animation-delay:.4s}@keyframes typing{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}
.textarea-wrap{flex:1;position:relative}.input-field{width:100%;background:rgba(255,255,255,.05);border:.5px solid var(--border2);border-radius:12px;padding:13px 14px;color:var(--text);font-size:14px;outline:none}.input-field::placeholder{color:var(--text3)}textarea.input-field{resize:none;overflow:hidden;padding-right:42px;min-height:44px;max-height:120px;line-height:1.5}#send-btn{position:absolute;right:8px;bottom:8px;width:28px;height:28px;background:var(--teal-dk);border-radius:50%;border:0;color:var(--teal)}
.member-row{display:flex;align-items:center;gap:12px;padding:12px 20px;border:0;border-bottom:.5px solid var(--border);background:transparent;width:100%;text-align:left;color:var(--text)}.member-info{flex:1;min-width:0}.member-name{font-size:14px;font-weight:500}.member-sub{font-size:11px;color:var(--text2);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pill-row,.chip-row{margin-top:5px;display:flex;gap:5px;flex-wrap:wrap}.row-chev{font-size:20px;color:var(--text3)}.admin-tag{font-size:9px;color:var(--teal);background:var(--teal-bg);padding:1px 6px;border-radius:8px;margin-left:4px}
.profile-hero{background:var(--bg2);padding:20px;border-bottom:.5px solid var(--border);display:flex;gap:14px;align-items:center}.profile-hero h2{font-size:18px;margin:0}.profile-hero p{font-size:12px;color:var(--text2);margin:2px 0 6px}.stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 20px}.stat-box{background:rgba(255,255,255,.04);border:.5px solid var(--border);border-radius:12px;padding:10px;text-align:center}.stat-box b{font-size:17px}.stat-box span{display:block;font-size:9px;color:var(--text3);margin-top:3px}.detail-section{padding:14px 20px 0}.detail-row{display:flex;justify-content:space-between;padding:9px 0;border-bottom:.5px solid var(--border);font-size:12px}.detail-row span{color:var(--text2)}.med{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}.muted{color:var(--text3);font-size:12px}.insight{margin:16px 20px;background:rgba(29,158,117,.07);border:.5px solid var(--teal-bd);border-radius:14px;padding:14px}.insight b{font-size:10px;color:var(--teal)}.insight p{font-size:12px;color:var(--text);line-height:1.65}.insight small{font-size:10px;color:var(--text3)}.profile-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 20px 28px}.profile-actions button{background:var(--teal-bg);border:.5px solid var(--teal-bd);border-radius:12px;padding:12px;color:var(--teal);font-size:12px;font-weight:500}
.emergency-screen,.settings-list,.admin-screen{padding:20px}.danger-card{background:var(--red-bg);border:.5px solid var(--red-bd);border-radius:16px;padding:20px;text-align:center}.danger-icon{width:38px;height:38px;border-radius:50%;border:1px solid var(--red);display:grid;place-items:center;margin:0 auto 10px;color:var(--red);font-weight:700}.danger-card h2{font-size:16px;color:var(--red)}.danger-card p{font-size:13px;color:var(--text2)}.call-main,.call-alt{display:block;text-align:center;text-decoration:none;border-radius:14px;font-weight:700;margin-top:10px}.call-main{padding:18px;background:#7A1010;border:.5px solid var(--red-bd);color:var(--red)}.call-alt{padding:15px;background:rgba(255,255,255,.04);border:.5px solid var(--border2);color:var(--text)}.emergency-item{margin-top:8px}.emergency-item b{display:block;color:var(--red);font-size:12px}.emergency-item span{font-size:11px;color:var(--text2)}
.setting{width:100%;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center}.setting b{display:block;font-size:13px}.setting small{display:block;font-size:11px;color:var(--text2);margin-top:2px;line-height:1.6}.red-text{color:var(--red)}.teal-text{color:var(--teal)}.btn-primary,.btn-ghost{width:100%;border-radius:14px;font-weight:600}.btn-primary{padding:15px;background:var(--teal-dk);border:0;color:var(--teal);margin-top:8px}.btn-primary:disabled{opacity:.35}.btn-ghost{padding:12px;background:transparent;border:.5px solid var(--border2);color:var(--text2);margin-top:10px}.login-scroll{padding:40px 24px}.login-brand{margin-bottom:48px}.brand-icon{width:52px;height:52px;background:var(--teal-dk);border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;color:var(--teal);font-size:26px}.login-brand h1{font-size:28px;margin:0}.login-brand p{color:var(--text2);font-size:14px;margin:4px 0 0}.login-brand small{color:var(--text3);font-size:12px}.form-label{font-size:11px;color:var(--text2);font-weight:500;margin-bottom:6px;display:block}.phone-row{display:flex;align-items:center;gap:8px}.country{background:rgba(255,255,255,.05);border:.5px solid var(--border2);border-radius:12px;padding:13px 14px;color:var(--text2);font-size:14px}.login-note{color:var(--text3);font-size:11px;text-align:center;margin-top:16px}.otp-text{color:var(--text2);font-size:13px;margin-bottom:20px}.otp-input{text-align:center;letter-spacing:8px;font-size:22px}
.admin-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}.admin-stats div{background:rgba(255,255,255,.04);border:.5px solid var(--border);border-radius:12px;padding:14px;text-align:center}.admin-stats b{font-size:24px}.admin-stats span{display:block;font-size:10px;color:var(--text3);margin-top:3px}.admin-row{width:100%;display:flex;align-items:center;gap:10px;margin-bottom:8px}.admin-row span:nth-child(2){flex:1}.admin-row b{display:block;font-size:13px}.admin-row small{display:block;font-size:10px;color:var(--text2);margin-top:2px}.flag{background:rgba(255,255,255,.03);border:.5px solid var(--border);border-radius:12px;padding:12px;margin-top:8px}.flag.red-flag{background:var(--red-bg);border-color:var(--red-bd)}.flag b{display:block;font-size:11px;color:var(--text)}.red-flag b{color:var(--red)}.flag span{display:block;font-size:11px;color:var(--text2);margin-top:4px;line-height:1.5}
#toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%) translateY(20px);background:#1a1d27;border:.5px solid var(--teal-bd);color:var(--teal);padding:10px 18px;border-radius:20px;font-size:12px;font-weight:500;opacity:0;transition:all .25s;z-index:999;white-space:nowrap}#toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
`
