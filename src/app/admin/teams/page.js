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

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold gradient-text">🏆 Takım Yönetimi</h1>
          <p className="text-sm text-gray-400 mt-1">Ligdeki takımları yönet</p>
        </div>
        <a href="/admin" className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">← Admin Paneli</a>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-green-100/50 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {editingId ? '✏️ Takım Düzenle' : '➕ Yeni Takım Ekle'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Takım Adı</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-gray-50/50 transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Logo URL</label>
              <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-gray-50/50 transition-all" placeholder="https://..." />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-600 transition-all shadow-md hover:shadow-lg">
              {editingId ? 'Güncelle' : 'Ekle'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setName(''); setLogoUrl(''); setEditingId(null) }}
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
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Logo</th>
              <th className="p-3 text-left">Takım Adı</th>
              <th className="p-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, i) => (
              <tr key={team.id} className={`border-b border-gray-100 hover:bg-green-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <td className="p-3 text-gray-400">{team.id}</td>
                <td className="p-3">
                  {team.logo_url ? (
                    <img src={team.logo_url} alt="" className="w-9 h-9 object-contain rounded-full bg-green-50 p-1 border border-green-200" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center text-green-600 font-bold border border-green-200">
                      {team.name?.[0] || '?'}
                    </div>
                  )}
                </td>
                <td className="p-3 font-medium text-gray-800">{team.name}</td>
                <td className="p-3 text-right">
                  <button onClick={() => handleEdit(team)} className="text-blue-500 hover:text-blue-700 font-medium mr-3 transition-colors">✏️ Düzenle</button>
                  <button onClick={() => handleDelete(team.id)} className="text-red-400 hover:text-red-600 font-medium transition-colors">🗑️ Sil</button>
                </td>
              </tr>
            ))}
            {teams.length === 0 && (
              <tr><td colSpan={4} className="p-12 text-center text-gray-400">
                <div className="text-4xl mb-2">🏆</div>
                Henüz takım eklenmemiş
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
