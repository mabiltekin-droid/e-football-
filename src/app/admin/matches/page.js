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
  const [status, setStatus] = useState('pending')
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
      home_team_id: parseInt(homeTeamId),
      away_team_id: parseInt(awayTeamId),
      week: parseInt(week),
      match_date: matchDate || null,
      home_score: homeScore ? parseInt(homeScore) : null,
      away_score: awayScore ? parseInt(awayScore) : null,
      status: homeScore ? 'played' : 'pending',
    }
    if (editingId) body.id = editingId

    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch('/api/matches', { method, headers: adminHeaders(), body: JSON.stringify(body) })
    if (res.ok) { resetForm(); loadData() }
  }

  const resetForm = () => {
    setHomeTeamId(''); setAwayTeamId(''); setWeek(1); setMatchDate('')
    setHomeScore(''); setAwayScore(''); setStatus('pending'); setEditingId(null)
  }

  const handleEdit = (match) => {
    setHomeTeamId(match.home_team_id); setAwayTeamId(match.away_team_id)
    setWeek(match.week); setMatchDate(match.match_date?.split('T')[0] || '')
    setHomeScore(match.home_score ?? ''); setAwayScore(match.away_score ?? '')
    setStatus(match.status); setEditingId(match.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu maçı silmek istediğinize emin misiniz?')) return
    const res = await fetch('/api/matches', { method: 'DELETE', headers: adminHeaders(), body: JSON.stringify({ id }) })
    if (res.ok) loadData()
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Yükleniyor...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800">Maç Yönetimi</h1>
        <a href="/admin" className="text-sm text-green-600 hover:underline">← Admin Paneli</a>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">{editingId ? 'Maç Düzenle' : 'Yeni Maç Ekle'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ev Sahibi</label>
            <select value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" required>
              <option value="">Takım Seçin</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deplasman</label>
            <select value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" required>
              <option value="">Takım Seçin</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hafta</label>
            <input type="number" value={week} onChange={(e) => setWeek(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tarih (opsiyonel)</label>
            <input type="date" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ev Skor</label>
              <input type="number" value={homeScore} onChange={(e) => setHomeScore(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" placeholder="-" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dep. Skor</label>
              <input type="number" value={awayScore} onChange={(e) => setAwayScore(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" placeholder="-" />
            </div>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
              {editingId ? 'Güncelle' : 'Ekle'}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">İptal</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-700 text-white">
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
            {matches.map((match) => (
              <tr key={match.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 text-gray-500">{match.week}</td>
                <td className="p-3 font-medium">{match.home_team?.name}</td>
                <td className="p-3 text-center font-bold">
                  {match.status === 'played' ? `${match.home_score} - ${match.away_score}` : '-'}
                </td>
                <td className="p-3 font-medium">{match.away_team?.name}</td>
                <td className="p-3 text-center text-gray-500 text-xs">
                  {match.match_date ? new Date(match.match_date).toLocaleDateString('tr-TR') : '-'}
                </td>
                <td className="p-3 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded ${match.status === 'played' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {match.status === 'played' ? 'Oynandı' : 'Bekliyor'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => handleEdit(match)} className="text-blue-600 hover:underline mr-3">Düzenle</button>
                  <button onClick={() => handleDelete(match.id)} className="text-red-500 hover:underline">Sil</button>
                </td>
              </tr>
            ))}
            {matches.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-500">Henüz maç eklenmemiş.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
