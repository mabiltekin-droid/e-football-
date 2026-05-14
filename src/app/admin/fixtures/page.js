'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAdmin, adminHeaders } from '@/lib/auth'

export default function AdminFixtures() {
  const [teams, setTeams] = useState([])
  const [selectedTeams, setSelectedTeams] = useState([])
  const [weekCount, setWeekCount] = useState(6)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [preview, setPreview] = useState(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin()) { router.push('/admin'); return }
    loadTeams()
  }, [])

  const loadTeams = async () => {
    const res = await fetch('/api/teams')
    const data = await res.json()
    setTeams(data)
    setLoading(false)
  }

  const toggleTeam = (id) => {
    setSelectedTeams(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
    setPreview(null)
    setSuccess(false)
  }

  const selectAll = () => {
    setSelectedTeams(teams.map(t => t.id))
    setPreview(null)
    setSuccess(false)
  }

  const deselectAll = () => {
    setSelectedTeams([])
    setPreview(null)
    setSuccess(false)
  }

  const generatePreview = () => {
    if (selectedTeams.length < 2) {
      setError('En az 2 takım seçmelisiniz')
      return
    }
    if (!startDate || !endDate) {
      setError('Tarih aralığı seçmelisiniz')
      return
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError('Bitiş tarihi başlangıç tarihinden sonra olmalı')
      return
    }
    setError('')

    const n = selectedTeams.length
    const list = [...selectedTeams]
    const isOdd = n % 2 !== 0
    if (isOdd) list.push(null)
    const roundsCount = list.length - 1
    const half = list.length / 2
    const rounds = []
    for (let round = 0; round < roundsCount; round++) {
      const matches = []
      for (let i = 0; i < half; i++) {
        const home = list[i]; const away = list[list.length - 1 - i]
        if (home !== null && away !== null) matches.push({ home, away })
      }
      rounds.push(matches)
      list.splice(1, 0, list.pop())
    }
    const returnRounds = rounds.map(r => r.map(m => ({ home: m.away, away: m.home })))
    let allRounds = [...rounds, ...returnRounds]
    const selectedWeeks = Math.min(weekCount, allRounds.length)

    const startMs = new Date(startDate).getTime()
    const endMs = new Date(endDate).getTime()
    const totalDays = (endMs - startMs) / (1000 * 60 * 60 * 24)
    const daysBetweenWeeks = selectedWeeks > 1 ? totalDays / (selectedWeeks - 1) : 0

    const previewData = []
    for (let w = 0; w < selectedWeeks; w++) {
      const weekDate = new Date(startMs + daysBetweenWeeks * w * 86400000)
      const weekMatches = allRounds[w].map(m => {
        const homeTeam = teams.find(t => t.id === m.home)
        const awayTeam = teams.find(t => t.id === m.away)
        return { home: homeTeam?.name, away: awayTeam?.name }
      })
      previewData.push({ week: w + 1, date: weekDate, matches: weekMatches })
    }
    setPreview(previewData)
  }

  const saveFixtures = async () => {
    setGenerating(true)
    setError('')

    const res = await fetch('/api/fixtures', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({
        teamIds: selectedTeams,
        weekCount: Math.min(weekCount, (selectedTeams.length - 1) * 2),
        startDate,
        endDate,
      }),
    })

    const data = await res.json()
    if (res.ok) {
      setSuccess(true)
      setPreview(null)
    } else {
      setError(data.error || 'Bir hata oluştu')
    }
    setGenerating(false)
  }

  const totalPossibleWeeks = selectedTeams.length > 1 ? (selectedTeams.length - 1) * 2 : 0

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold gradient-text">📅 Fikstür Oluşturucu</h1>
          <p className="text-sm text-[#D4AF37]/40 mt-1">Takımlar için otomatik fikstür oluştur</p>
        </div>
        <a href="/admin" className="text-sm text-[#D4AF37] hover:text-[#F5D061] font-medium transition-colors">← Admin Paneli</a>
      </div>

      {success && (
        <div className="dark-card rounded-xl p-6 mb-6 border border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✅</span>
            <div>
              <p className="text-[#D4AF37] font-semibold text-lg">Fikstür başarıyla oluşturuldu!</p>
              <p className="text-white/40 text-sm">Maçlar otomatik olarak eklendi. Ana sayfada görüntüleyebilirsin.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="dark-card rounded-xl p-6">
            <h2 className="text-lg font-bold text-white/80 mb-4">⚙️ Ayarlar</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D4AF37]/60 mb-1.5">Takımlar</label>
                <div className="flex gap-2 mb-2">
                  <button onClick={selectAll} className="text-xs px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/20 transition-colors">Tümünü Seç</button>
                  <button onClick={deselectAll} className="text-xs px-3 py-1 bg-white/5 text-white/50 rounded-lg hover:bg-white/10 transition-colors">Temizle</button>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 bg-[#1a1a3a] rounded-xl p-2 border border-[#D4AF37]/10">
                  {teams.map(team => (
                    <label
                      key={team.id}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                        selectedTeams.includes(team.id)
                          ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                          : 'text-white/50 hover:bg-white/5'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTeams.includes(team.id)}
                        onChange={() => toggleTeam(team.id)}
                        className="w-4 h-4 accent-[#D4AF37]"
                      />
                      <span className="text-sm font-medium">{team.name}</span>
                    </label>
                  ))}
                  {teams.length === 0 && (
                    <p className="text-white/30 text-sm text-center py-4">Önce takım eklemelisin</p>
                  )}
                </div>
                <p className="text-xs text-white/30 mt-1.5">{selectedTeams.length} takım seçildi</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#D4AF37]/60 mb-1.5">Hafta Sayısı</label>
                <input
                  type="number"
                  value={weekCount}
                  onChange={(e) => { setWeekCount(parseInt(e.target.value) || 1); setPreview(null); setSuccess(false) }}
                  min="1"
                  max={totalPossibleWeeks || 38}
                  className="w-full px-4 py-2.5 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white transition-all"
                />
                <p className="text-xs text-white/30 mt-1">Maksimum {totalPossibleWeeks} hafta (çift devreli lig)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#D4AF37]/60 mb-1.5">Başlangıç Tarihi</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPreview(null); setSuccess(false) }}
                  className="w-full px-4 py-2.5 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#D4AF37]/60 mb-1.5">Bitiş Tarihi</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPreview(null); setSuccess(false) }}
                  className="w-full px-4 py-2.5 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white transition-all"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30">{error}</div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={generatePreview}
                  disabled={selectedTeams.length < 2 || !startDate || !endDate}
                  className="flex-1 px-4 py-2.5 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all disabled:opacity-30"
                >
                  👁️ Önizle
                </button>
                <button
                  onClick={saveFixtures}
                  disabled={!preview || generating}
                  className="flex-1 px-4 py-2.5 gold-gradient text-[#0a0a18] rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-30 shadow-md"
                >
                  {generating ? 'Oluşturuluyor...' : '💾 Kaydet'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="dark-card rounded-xl p-6">
            <h2 className="text-lg font-bold text-white/80 mb-4">
              {preview ? `👁️ Fikstür Önizleme (${preview.length} Hafta)` : '📋 Fikstür'}
            </h2>

            {!preview && !success && (
              <div className="text-center py-16 text-[#D4AF37]/30">
                <div className="text-5xl mb-4">📅</div>
                <p className="text-lg">Henüz fikstür oluşturulmadı</p>
                <p className="text-sm mt-1">Soldaki ayarları yapıp "Önizle" ye bas</p>
              </div>
            )}

            {preview && (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {preview.map((week) => (
                  <div key={week.week} className="bg-[#1a1a3a] rounded-xl p-4 border border-[#D4AF37]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-7 h-7 rounded-lg gold-gradient text-[#0a0a18] flex items-center justify-center text-xs font-bold">
                        {week.week}
                      </span>
                      <span className="font-semibold text-white/80 text-sm">Hafta {week.week}</span>
                      <span className="text-xs text-white/30 ml-auto">
                        🗓️ {week.date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {week.matches.map((match, mi) => (
                        <div key={mi} className="flex items-center justify-between bg-[#12122a] rounded-lg px-4 py-2 border border-[#2a2a4a]">
                          <span className="text-sm text-white/70">{match.home}</span>
                          <span className="text-xs px-3 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full font-medium mx-2">VS</span>
                          <span className="text-sm text-white/70">{match.away}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {success && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-[#D4AF37] text-lg font-semibold">Fikstür başarıyla kaydedildi!</p>
                <p className="text-white/40 text-sm mt-1">Maçlar ana sayfada ve maçlar bölümünde görünecek.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
