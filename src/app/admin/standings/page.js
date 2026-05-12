'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAdmin, adminHeaders } from '@/lib/auth'

export default function AdminStandings() {
  const [standings, setStandings] = useState([])
  const [teams, setTeams] = useState([])
  const [teamId, setTeamId] = useState('')
  const [played, setPlayed] = useState(0)
  const [won, setWon] = useState(0)
  const [drawn, setDrawn] = useState(0)
  const [lost, setLost] = useState(0)
  const [goalsFor, setGoalsFor] = useState(0)
  const [goalsAgainst, setGoalsAgainst] = useState(0)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin()) { router.push('/admin'); return }
    loadData()
  }, [])

  const loadData = async () => {
    const [standingsRes, teamsRes] = await Promise.all([
      fetch('/api/standings'),
      fetch('/api/teams'),
    ])
    setStandings(await standingsRes.json())
    setTeams(await teamsRes.json())
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const goalDiff = parseInt(goalsFor) - parseInt(goalsAgainst)
    const points = parseInt(won) * 3 + parseInt(drawn)
    const body = {
      team_id: parseInt(teamId), played: parseInt(played), won: parseInt(won),
      drawn: parseInt(drawn), lost: parseInt(lost),
      goals_for: parseInt(goalsFor), goals_against: parseInt(goalsAgainst),
      goal_diff: goalDiff, points,
    }
    if (editingId) body.id = editingId
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch('/api/standings', { method, headers: adminHeaders(), body: JSON.stringify(body) })
    if (res.ok) { resetForm(); loadData() }
  }

  const resetForm = () => {
    setTeamId(''); setPlayed(0); setWon(0); setDrawn(0); setLost(0)
    setGoalsFor(0); setGoalsAgainst(0); setEditingId(null)
  }

  const handleEdit = (row) => {
    setTeamId(row.team_id); setPlayed(row.played); setWon(row.won); setDrawn(row.drawn)
    setLost(row.lost); setGoalsFor(row.goals_for); setGoalsAgainst(row.goals_against); setEditingId(row.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return
    const res = await fetch('/api/standings', { method: 'DELETE', headers: adminHeaders(), body: JSON.stringify({ id }) })
    if (res.ok) loadData()
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const fields = [
    { label: 'Oynanan', val: played, set: setPlayed },
    { label: 'Galibiyet', val: won, set: setWon, color: 'text-[#D4AF37]' },
    { label: 'Beraberlik', val: drawn, set: setDrawn, color: 'text-white/60' },
    { label: 'Mağlubiyet', val: lost, set: setLost, color: 'text-red-400' },
    { label: 'Attığı', val: goalsFor, set: setGoalsFor },
    { label: 'Yediği', val: goalsAgainst, set: setGoalsAgainst },
  ]

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold gradient-text">📊 Puan Durumu</h1>
          <p className="text-sm text-[#D4AF37]/40 mt-1">Puan durumunu yönet</p>
        </div>
        <a href="/admin" className="text-sm text-[#D4AF37] hover:text-[#F5D061] font-medium transition-colors">← Admin Paneli</a>
      </div>

      <div className="dark-card rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold text-white/80 mb-4">
          {editingId ? '✏️ Puan Durumu Düzenle' : '➕ Yeni Puan Durumu Ekle'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#D4AF37]/60 mb-1.5">Takım</label>
            <select value={teamId} onChange={(e) => setTeamId(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white transition-all" required>
              <option value="" className="bg-[#0a0a18]">Takım Seç</option>
              {teams.map((t) => <option key={t.id} value={t.id} className="bg-[#0a0a18]">{t.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {fields.map((f) => (
              <div key={f.label}>
                <label className={`block text-sm font-medium mb-1.5 ${f.color || 'text-white/50'}`}>{f.label}</label>
                <input type="number" value={f.val} onChange={(e) => f.set(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white transition-all" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
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
              <th className="p-3 text-left">Takım</th>
              <th className="p-3 text-center">O</th>
              <th className="p-3 text-center">G</th>
              <th className="p-3 text-center">B</th>
              <th className="p-3 text-center">M</th>
              <th className="p-3 text-center">AG</th>
              <th className="p-3 text-center">YG</th>
              <th className="p-3 text-center">AV</th>
              <th className="p-3 text-center">P</th>
              <th className="p-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, i) => (
              <tr key={row.id} className={`border-b border-[#2a2a4a] transition-colors ${i % 2 === 0 ? 'bg-[#12122a]' : 'bg-[#161630]'} hover:bg-[#1a1a3a]`}>
                <td className="p-3 font-medium text-white/80">{row.teams?.name}</td>
                <td className="p-3 text-center text-white/50">{row.played}</td>
                <td className="p-3 text-center text-[#D4AF37] font-medium">{row.won}</td>
                <td className="p-3 text-center text-white/60">{row.drawn}</td>
                <td className="p-3 text-center text-red-400">{row.lost}</td>
                <td className="p-3 text-center text-white/80">{row.goals_for}</td>
                <td className="p-3 text-center text-white/50">{row.goals_against}</td>
                <td className={`p-3 text-center font-semibold ${row.goal_diff > 0 ? 'text-[#D4AF37]' : row.goal_diff < 0 ? 'text-red-400' : 'text-white/50'}`}>
                  {row.goal_diff > 0 ? '+' : ''}{row.goal_diff}
                </td>
                <td className="p-3 text-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs gold-gradient text-[#0a0a18]">
                    {row.points}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => handleEdit(row)} className="text-[#D4AF37] hover:text-[#F5D061] font-medium mr-3 transition-colors">✏️</button>
                  <button onClick={() => handleDelete(row.id)} className="text-red-400 hover:text-red-300 font-medium transition-colors">🗑️</button>
                </td>
              </tr>
            ))}
            {standings.length === 0 && (
              <tr><td colSpan={10} className="p-12 text-center text-[#D4AF37]/40">
                <div className="text-4xl mb-2">📊</div>
                Henüz puan durumu eklenmemiş
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
