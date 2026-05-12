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
      team_id: parseInt(teamId),
      played: parseInt(played),
      won: parseInt(won),
      drawn: parseInt(drawn),
      lost: parseInt(lost),
      goals_for: parseInt(goalsFor),
      goals_against: parseInt(goalsAgainst),
      goal_diff: goalDiff,
      points: points,
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
    setLost(row.lost); setGoalsFor(row.goals_for); setGoalsAgainst(row.goals_against)
    setEditingId(row.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return
    const res = await fetch('/api/standings', { method: 'DELETE', headers: adminHeaders(), body: JSON.stringify({ id }) })
    if (res.ok) loadData()
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Yükleniyor...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800">Puan Durumu Yönetimi</h1>
        <a href="/admin" className="text-sm text-green-600 hover:underline">← Admin Paneli</a>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">{editingId ? 'Puan Durumu Düzenle' : 'Yeni Puan Durumu Ekle'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Takım</label>
            <select value={teamId} onChange={(e) => setTeamId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" required>
              <option value="">Takım Seçin</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          {[{ label: 'Oynanan', val: played, set: setPlayed },
            { label: 'Galibiyet', val: won, set: setWon },
            { label: 'Beraberlik', val: drawn, set: setDrawn },
            { label: 'Mağlubiyet', val: lost, set: setLost },
            { label: 'Attığı', val: goalsFor, set: setGoalsFor },
            { label: 'Yediği', val: goalsAgainst, set: setGoalsAgainst },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input type="number" value={field.val} onChange={(e) => field.set(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" />
            </div>
          ))}
          <div className="md:col-span-3 flex gap-2">
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
            {standings.map((row) => (
              <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 font-medium">{row.teams?.name}</td>
                <td className="p-3 text-center">{row.played}</td>
                <td className="p-3 text-center">{row.won}</td>
                <td className="p-3 text-center">{row.drawn}</td>
                <td className="p-3 text-center">{row.lost}</td>
                <td className="p-3 text-center">{row.goals_for}</td>
                <td className="p-3 text-center">{row.goals_against}</td>
                <td className="p-3 text-center">{row.goal_diff}</td>
                <td className="p-3 text-center font-bold text-green-700">{row.points}</td>
                <td className="p-3 text-right">
                  <button onClick={() => handleEdit(row)} className="text-blue-600 hover:underline mr-3">Düzenle</button>
                  <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:underline">Sil</button>
                </td>
              </tr>
            ))}
            {standings.length === 0 && <tr><td colSpan={10} className="p-8 text-center text-gray-500">Henüz puan durumu eklenmemiş.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
