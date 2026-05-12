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
      <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold gradient-text">🏆 Takım Yönetimi</h1>
          <p className="text-sm text-[#D4AF37]/40 mt-1">Ligdeki takımları yönet</p>
        </div>
        <a href="/admin" className="text-sm text-[#D4AF37] hover:text-[#F5D061] font-medium transition-colors">← Admin Paneli</a>
      </div>

      <div className="dark-card rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold text-white/80 mb-4">
          {editingId ? '✏️ Takım Düzenle' : '➕ Yeni Takım Ekle'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#D4AF37]/60 mb-1.5">Takım Adı</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white placeholder-white/20 transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#D4AF37]/60 mb-1.5">Logo URL</label>
              <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white placeholder-white/20 transition-all" placeholder="https://..." />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit"
              className="px-6 py-2.5 gold-gradient text-[#0a0a18] rounded-xl font-bold hover:opacity-90 transition-all shadow-md">
              {editingId ? 'Güncelle' : 'Ekle'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setName(''); setLogoUrl(''); setEditingId(null) }}
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
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Logo</th>
              <th className="p-3 text-left">Takım Adı</th>
              <th className="p-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, i) => (
              <tr key={team.id} className={`border-b border-[#2a2a4a] transition-colors ${i % 2 === 0 ? 'bg-[#12122a]' : 'bg-[#161630]'} hover:bg-[#1a1a3a]`}>
                <td className="p-3 text-white/40">{team.id}</td>
                <td className="p-3">
                  {team.logo_url ? (
                    <img src={team.logo_url} alt="" className="w-9 h-9 object-contain rounded-full bg-[#1a1a3a] p-1 border border-[#D4AF37]/20" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#1a1a3a] flex items-center justify-center text-[#D4AF37] font-bold border border-[#D4AF37]/20">
                      {team.name?.[0] || '?'}
                    </div>
                  )}
                </td>
                <td className="p-3 font-medium text-white/80">{team.name}</td>
                <td className="p-3 text-right">
                  <button onClick={() => handleEdit(team)} className="text-[#D4AF37] hover:text-[#F5D061] font-medium mr-3 transition-colors">✏️</button>
                  <button onClick={() => handleDelete(team.id)} className="text-red-400 hover:text-red-300 font-medium transition-colors">🗑️</button>
                </td>
              </tr>
            ))}
            {teams.length === 0 && (
              <tr><td colSpan={4} className="p-12 text-center text-[#D4AF37]/40">
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
