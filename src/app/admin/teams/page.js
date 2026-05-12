'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAdmin, adminHeaders } from '@/lib/auth'

export default function AdminTeams() {
  const [teams, setTeams] = useState([])
  const [name, setName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editingId ? 'PUT' : 'POST'
    const body = editingId ? { id: editingId, name, logo_url: logoUrl } : { name, logo_url: logoUrl }

    const res = await fetch('/api/teams', { method, headers: adminHeaders(), body: JSON.stringify(body) })
    if (res.ok) { setName(''); setLogoUrl(''); setEditingId(null); loadTeams() }
  }

  const handleEdit = (team) => {
    setName(team.name); setLogoUrl(team.logo_url || ''); setEditingId(team.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu takımı silmek istediğinize emin misiniz?')) return
    const res = await fetch('/api/teams', { method: 'DELETE', headers: adminHeaders(), body: JSON.stringify({ id }) })
    if (res.ok) loadTeams()
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Yükleniyor...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800">Takım Yönetimi</h1>
        <a href="/admin" className="text-sm text-green-600 hover:underline">← Admin Paneli</a>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">{editingId ? 'Takım Düzenle' : 'Yeni Takım Ekle'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Takım Adı</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (opsiyonel)</label>
            <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
              {editingId ? 'Güncelle' : 'Ekle'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setName(''); setLogoUrl(''); setEditingId(null) }} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Logo</th>
              <th className="p-3 text-left">Takım Adı</th>
              <th className="p-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 text-gray-500">{team.id}</td>
                <td className="p-3">{team.logo_url ? <img src={team.logo_url} alt="" className="w-8 h-8 object-contain" /> : <span className="text-gray-300">-</span>}</td>
                <td className="p-3 font-medium">{team.name}</td>
                <td className="p-3 text-right">
                  <button onClick={() => handleEdit(team)} className="text-blue-600 hover:underline mr-3">Düzenle</button>
                  <button onClick={() => handleDelete(team.id)} className="text-red-500 hover:underline">Sil</button>
                </td>
              </tr>
            ))}
            {teams.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500">Henüz takım eklenmemiş.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
