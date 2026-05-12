'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAdmin, adminHeaders } from '@/lib/auth'

export default function AdminPlayers() {
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [name, setName] = useState('')
  const [teamId, setTeamId] = useState('')
  const [position, setPosition] = useState('')
  const [goals, setGoals] = useState(0)
  const [assists, setAssists] = useState(0)
  const [rating, setRating] = useState(0)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin()) { router.push('/admin'); return }
    loadData()
  }, [])

  const loadData = async () => {
    const [playersRes, teamsRes] = await Promise.all([
      fetch('/api/players'),
      fetch('/api/teams'),
    ])
    setPlayers(await playersRes.json())
    setTeams(await teamsRes.json())
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editingId ? 'PUT' : 'POST'
    const body = editingId
      ? { id: editingId, name, team_id: parseInt(teamId), position, goals: parseInt(goals), assists: parseInt(assists), rating: parseFloat(rating) }
      : { name, team_id: parseInt(teamId), position, goals: parseInt(goals), assists: parseInt(assists), rating: parseFloat(rating) }
    const res = await fetch('/api/players', { method, headers: adminHeaders(), body: JSON.stringify(body) })
    if (res.ok) { resetForm(); loadData() }
  }

  const resetForm = () => {
    setName(''); setTeamId(''); setPosition(''); setGoals(0); setAssists(0); setRating(0); setEditingId(null)
  }

  const handleEdit = (player) => {
    setName(player.name); setTeamId(player.team_id || ''); setPosition(player.position || '')
    setGoals(player.goals); setAssists(player.assists); setRating(player.rating); setEditingId(player.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu oyuncuyu silmek istediğinize emin misiniz?')) return
    const res = await fetch('/api/players', { method: 'DELETE', headers: adminHeaders(), body: JSON.stringify({ id }) })
    if (res.ok) loadData()
  }

  const positions = ['Kaleci', 'Defans', 'Orta Saha', 'Forvet', 'Kanat']

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold gradient-text">⭐ Oyuncu Yönetimi</h1>
          <p className="text-sm text-gray-400 mt-1">Oyuncuları ekle, düzenle, sil</p>
        </div>
        <a href="/admin" className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">← Admin Paneli</a>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-green-100/50 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {editingId ? '✏️ Oyuncu Düzenle' : '➕ Yeni Oyuncu Ekle'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Oyuncu Adı</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-gray-50/50 transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Takım</label>
            <select value={teamId} onChange={(e) => setTeamId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-gray-50/50 transition-all" required>
              <option value="">Takım Seç</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Mevki</label>
            <select value={position} onChange={(e) => setPosition(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-gray-50/50 transition-all">
              <option value="">Seç</option>
              {positions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Gol</label>
              <input type="number" value={goals} onChange={(e) => setGoals(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-gray-50/50 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Asist</label>
              <input type="number" value={assists} onChange={(e) => setAssists(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-gray-50/50 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Rating</label>
              <input type="number" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-gray-50/50 transition-all" />
            </div>
          </div>
          <div className="md:col-span-4 flex gap-2">
            <button type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-600 transition-all shadow-md hover:shadow-lg">
              {editingId ? 'Güncelle' : 'Ekle'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm}
                className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all">
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-green-100/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-green-700 to-green-600 text-white">
              <th className="p-3 text-left">Oyuncu</th>
              <th className="p-3 text-left">Takım</th>
              <th className="p-3 text-left">Mevki</th>
              <th className="p-3 text-center">Gol</th>
              <th className="p-3 text-center">Asist</th>
              <th className="p-3 text-center">Rating</th>
              <th className="p-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, i) => (
              <tr key={player.id} className={`border-b border-gray-100 hover:bg-green-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <td className="p-3 font-medium text-gray-800">{player.name}</td>
                <td className="p-3 text-gray-500">{player.teams?.name}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{player.position}</span>
                </td>
                <td className="p-3 text-center font-semibold text-green-600">{player.goals}</td>
                <td className="p-3 text-center font-semibold text-blue-500">{player.assists}</td>
                <td className="p-3 text-center">
                  <span className="bg-gradient-to-r from-green-600 to-green-500 text-white px-2.5 py-0.5 rounded-lg font-bold text-xs shadow-sm">{player.rating}</span>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => handleEdit(player)} className="text-blue-500 hover:text-blue-700 font-medium mr-3 transition-colors">✏️</button>
                  <button onClick={() => handleDelete(player.id)} className="text-red-400 hover:text-red-600 font-medium transition-colors">🗑️</button>
                </td>
              </tr>
            ))}
            {players.length === 0 && (
              <tr><td colSpan={7} className="p-12 text-center text-gray-400">
                <div className="text-4xl mb-2">⭐</div>
                Henüz oyuncu eklenmemiş
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
