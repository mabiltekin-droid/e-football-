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

  if (loading) return <div className="text-center py-12 text-gray-500">Yükleniyor...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800">Oyuncu Yönetimi</h1>
        <a href="/admin" className="text-sm text-green-600 hover:underline">← Admin Paneli</a>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">{editingId ? 'Oyuncu Düzenle' : 'Yeni Oyuncu Ekle'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Oyuncu Adı</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Takım</label>
            <select value={teamId} onChange={(e) => setTeamId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" required>
              <option value="">Takım Seçin</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mevki</label>
            <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" placeholder="Örn: Forvet, Orta Saha" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gol</label>
              <input type="number" value={goals} onChange={(e) => setGoals(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asist</label>
              <input type="number" value={assists} onChange={(e) => setAssists(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <input type="number" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" />
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
            {players.map((player) => (
              <tr key={player.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 font-medium">{player.name}</td>
                <td className="p-3 text-gray-600">{player.teams?.name}</td>
                <td className="p-3 text-gray-600">{player.position}</td>
                <td className="p-3 text-center">{player.goals}</td>
                <td className="p-3 text-center">{player.assists}</td>
                <td className="p-3 text-center"><span className="bg-green-700 text-white px-2 py-0.5 rounded font-bold text-xs">{player.rating}</span></td>
                <td className="p-3 text-right">
                  <button onClick={() => handleEdit(player)} className="text-blue-600 hover:underline mr-3">Düzenle</button>
                  <button onClick={() => handleDelete(player.id)} className="text-red-500 hover:underline">Sil</button>
                </td>
              </tr>
            ))}
            {players.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-500">Henüz oyuncu eklenmemiş.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
