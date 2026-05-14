'use client'

import { useState, useEffect } from 'react'

export default function LiveScoreBanner() {
  const [liveMatches, setLiveMatches] = useState([])
  const [show, setShow] = useState(false)

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/matches')
        const all = await res.json()
        const live = all.filter(m => m.status === 'played' && m.home_score !== null)
        const sorted = live.sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)).slice(0, 3)
        setLiveMatches(sorted)
        setShow(sorted.length > 0)
      } catch {}
    }
    check()
    const interval = setInterval(check, 10000)
    return () => clearInterval(interval)
  }, [])

  if (!show || liveMatches.length === 0) return null

  return (
    <div className="dark-card rounded-xl p-4 border border-[#D4AF37]/20">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-sm font-bold text-red-400">CANLI</span>
        <span className="text-xs text-white/30">son güncellemeler</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {liveMatches.map(m => (
          <div key={m.id} className="flex items-center justify-between bg-[#1a1a3a] rounded-lg px-4 py-2">
            <span className="text-xs text-white/60">{m.home_team?.name}</span>
            <span className="text-sm font-bold text-[#D4AF37] mx-2">{m.home_score} - {m.away_score}</span>
            <span className="text-xs text-white/60">{m.away_team?.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
