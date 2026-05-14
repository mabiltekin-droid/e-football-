'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function getInitials(name) {
  return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'
}

const avatarColors = [
  'from-[#D4AF37] to-[#B8962E]',
  'from-[#F5D061] to-[#D4AF37]',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-green-600',
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-violet-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-teal-600',
]

function hashColor(name) {
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function formatTime(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return 'şimdi'
  if (mins < 60) return `${mins} dk önce`
  if (hours < 24) return `${hours} sa önce`
  if (days < 7) return `${days} gün önce`
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [savedNickname, setSavedNickname] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('efootball_chat_nickname')
    if (saved) setSavedNickname(saved)

    fetch('/api/messages')
      .then(r => r.json())
      .then(data => {
        setMessages(data || [])
        setLoading(false)
      })

    const channel = supabase
      .channel('messages')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const joinChat = () => {
    if (!nickname.trim()) return
    localStorage.setItem('efootball_chat_nickname', nickname.trim())
    setSavedNickname(nickname.trim())
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!content.trim() || sending) return

    setSending(true)
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname: savedNickname, content: content.trim() }),
    })

    if (res.ok) setContent('')
    setSending(false)
  }

  if (!savedNickname) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center animate-fadeIn">
        <div className="dark-card rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">💬</div>
          <h1 className="text-2xl font-bold gradient-text mb-2">Sohbet</h1>
          <p className="text-[#D4AF37]/40 text-sm mb-6">Maçlar hakkında konuşmak için bir takma ad gir</p>
          <div className="space-y-4">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && joinChat()}
              className="w-full px-4 py-3 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white placeholder-white/20 text-center text-lg transition-all"
              placeholder="Takma adın ne?"
              maxLength={30}
            />
            <button
              onClick={joinChat}
              disabled={!nickname.trim()}
              className="w-full py-3 gold-gradient text-[#0a0a18] rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-30 shadow-lg"
            >
              Sohbete Katıl
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold gradient-text">💬 Sohbet</h1>
          <p className="text-[#D4AF37]/40 text-xs mt-0.5">
            <span className="inline-block w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse-dot mr-1.5" />
            {messages.length} mesaj
          </p>
        </div>
        <button
          onClick={() => { localStorage.removeItem('efootball_chat_nickname'); setSavedNickname('') }}
          className="text-xs px-3 py-1.5 bg-white/5 text-white/50 rounded-lg hover:bg-white/10 transition-colors"
        >
          🔄 Çıkış Yap
        </button>
      </div>

      <div className="dark-card rounded-xl overflow-hidden flex flex-col" style={{ height: '65vh' }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[#D4AF37]/30 text-center">
              <div>
                <div className="text-5xl mb-3">💬</div>
                <p className="text-lg">Henüz mesaj yok</p>
                <p className="text-sm mt-1">İlk mesajı sen yaz!</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.nickname === savedNickname ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${hashColor(msg.nickname)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md ${msg.nickname === savedNickname ? 'order-1' : ''}`}>
                  {getInitials(msg.nickname)}
                </div>
                <div className={`max-w-[75%] ${msg.nickname === savedNickname ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`flex items-center gap-2 mb-0.5 ${msg.nickname === savedNickname ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs font-medium text-[#D4AF37]/70">{msg.nickname}</span>
                    <span className="text-[10px] text-white/20">{formatTime(msg.created_at)}</span>
                  </div>
                  <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.nickname === savedNickname
                      ? 'gold-gradient text-[#0a0a18] rounded-tr-sm'
                      : 'bg-[#1a1a3a] text-white/80 border border-[#D4AF37]/10 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t border-[#D4AF37]/10 bg-[#0f0f24]">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bir şey yaz..."
              maxLength={500}
              className="flex-1 px-4 py-2.5 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white placeholder-white/20 transition-all text-sm"
            />
            <button
              type="submit"
              disabled={!content.trim() || sending}
              className="px-5 py-2.5 gold-gradient text-[#0a0a18] rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-30 shadow-md text-sm whitespace-nowrap"
            >
              {sending ? '...' : 'Gönder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
