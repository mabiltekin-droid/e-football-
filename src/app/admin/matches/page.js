'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAdmin, adminHeaders } from '@/lib/auth'

export default function AdminMatches() {
  const [matches, setMatches] = useState([])
  const [teams, setTeams] = useState([])
  const [homeTeamId, setHomeTeamId] = useState('')
  const [awayTeamId, setAwayTeamId] = useState('')
  const [week, setWeek] = useState(1)
  const [matchDate, setMatchDate] = useState('')
  const [homeScore, setHomeScore] = useState('')
  const [awayScore, setAwayScore] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin()) { router.push('/admin'); return }
    loadData()
  }, [])

  const loadData = async () => {
    const [matchesRes, teamsRes] = await Promise.all([
      fetch('/api/matches'),
      fetch('/api/teams'),
    ])
    setMatches(await matchesRes.json())
    setTeams(await teamsRes.json())
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const body = {
      home_team_id: parseInt(homeTeamId), away_team_id: parseInt(awayTeamId),
      week: parseInt(week), match_date: matchDate || null,
      home_score: homeScore ? parseInt(homeScore) : null, away_score: awayScore ? parseInt(awayScore) : null,
      status: homeScore ? 'played' : 'pending',
    }
    if (editingId) body.id = editingId
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch('/api/matches', { method, headers: adminHeaders(), body: JSON.stringify(body) })
    if (res.ok) { resetForm(); loadData() }
  }

  const resetForm = () => {
    setHomeTeamId(''); setAwayTeamId(''); setWeek(1); setMatchDate('')
    setHomeScore(''); setAwayScore(''); setEditingId(null)
  }

  const handleEdit = (match) => {
    setHomeTeamId(match.home_team_id); setAwayTeamId(match.away_team_id)
    setWeek(match.week); setMatchDate(match.match_date?.split('T')[0] || '')
    setHomeScore(match.home_score ?? ''); setAwayScore(match.away_score ?? ''); setEditingId(match.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu maçı silmek istediğinize emin misiniz?')) return
    const res = await fetch('/api/matches', { method: 'DELETE', headers: adminHeaders(), body: JSON.stringify({ id }) })
    if (res.ok) loadData()
  }

  const quickUpdateScore = async (id, home, away) => {
    await fetch('/api/matches', {
      method: 'PUT', headers: adminHeaders(),
      body: JSON.stringify({ id, home_score: home, away_score: away, status: 'played' }),
    })
    loadData()
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold gradient-text">📅 Maç Yönetimi</h1>
          <p className="text-sm text-[#D4AF37]/40 mt-1">Maçları ekle, sonuçları gir</p>
        </div>
        <a href="/admin" className="text-sm text-[#D4AF37] hover:text-[#F5D061] font-medium transition-colors">← Admin Paneli</a>
      </div>

      <div className="dark-card rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold text-white/80 mb-4">
          {editingId ? '✏️ Maç Düzenle' : '➕ Yeni Maç Ekle'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#D4AF37]/60 mb-1.5">Ev Sahibi</label>
            <select value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white transition-all" required>
              <option value="" className="bg-[#0a0a18]">Takım Seç</option>
              {teams.map((t) => <option key={t.id} value={t.id} className="bg-[#0a0a18]">{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#D4AF37]/60 mb-1.5">Deplasman</label>
            <select value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white transition-all" required>
              <option value="" className="bg-[#0a0a18]">Takım Seç</option>
              {teams.map((t) => <option key={t.id} value={t.id} className="bg-[#0a0a18]">{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#D4AF37]/60 mb-1.5">Hafta</label>
            <input type="number" value={week} onChange={(e) => setWeek(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#D4AF37]/60 mb-1.5">Tarih</label>
            <input type="date" value={matchDate} onChange={(e) => setMatchDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#D4AF37]/60 mb-1.5">Ev Skor</label>
            <input type="number" value={homeScore} onChange={(e) => setHomeScore(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white transition-all" placeholder="-" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#D4AF37]/60 mb-1.5">Dep. Skor</label>
            <input type="number" value={awayScore} onChange={(e) => setAwayScore(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white transition-all" placeholder="-" />
          </div>
          <div className="md:col-span-3 flex gap-2">
            <button type="submit"
              className="px-6 py-2.5 gold-gradient text-[#0a0a18] rounded-xl font-bold hover:opacity-90 transition-all shadow-md">
              {editingId ? 'Güncelle' : 'Ekle'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm}
                className="px-6 py-2.5 bg-white/5 text-white/60 rounded-xl font-medium hover:bg-white/10 transition-all">
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="dark-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="gold-gradient text-[#0a0a18]">
              <th className="p-3 text-left">Hafta</th>
              <th className="p-3 text-left">Ev</th>
              <th className="p-3 text-center">Skor</th>
              <th className="p-3 text-left">Dep.</th>
              <th className="p-3 text-center">Tarih</th>
              <th className="p-3 text-center">Durum</th>
              <th className="p-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, i) => (
              <tr key={match.id} className={`border-b border-[#2a2a4a] transition-colors ${i % 2 === 0 ? 'bg-[#12122a]' : 'bg-[#161630]'} hover:bg-[#1a1a3a]`}>
                <td className="p-3 font-medium text-[#D4AF37]/60">{match.week}</td>
                <td className="p-3 font-medium text-white/80">{match.home_team?.name}</td>
                <td className="p-3 text-center">
                  {match.status === 'played' ? (
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => quickUpdateScore(match.id, (match.home_score||0)+1, match.away_score)}
                        className="w-5 h-5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-xs hover:bg-[#D4AF37]/40 transition-colors">+</button>
                      <span className="font-bold text-[#D4AF37] mx-1 min-w-[20px]">{match.home_score}</span>
                      <span className="text-white/30">-</span>
                      <span className="font-bold text-[#D4AF37] mx-1 min-w-[20px]">{match.away_score}</span>
                      <button onClick={() => quickUpdateScore(match.id, match.home_score, (match.away_score||0)+1)}
                        className="w-5 h-5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-xs hover:bg-[#D4AF37]/40 transition-colors">+</button>
                    </div>
                  ) : <span className="text-white/30">-</span>}
                </td>
                <td className="p-3 font-medium text-white/80">{match.away_team?.name}</td>
                <td className="p-3 text-center text-xs text-white/30">
                  {match.match_date ? new Date(match.match_date).toLocaleDateString('tr-TR') : '-'}
                </td>
                <td className="p-3 text-center">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    match.status === 'played'
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                      : 'bg-white/10 text-white/50'
                  }`}>
                    {match.status === 'played' ? 'Oynandı' : 'Bekliyor'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => handleEdit(match)} className="text-[#D4AF37] hover:text-[#F5D061] font-medium mr-3 transition-colors">✏️</button>
                  <button onClick={() => handleDelete(match.id)} className="text-red-400 hover:text-red-300 font-medium transition-colors">🗑️</button>
                </td>
              </tr>
            ))}
            {matches.length === 0 && (
              <tr><td colSpan={7} className="p-12 text-center text-[#D4AF37]/40">
                <div className="text-4xl mb-2">⚽</div>
                Henüz maç eklenmemiş
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
