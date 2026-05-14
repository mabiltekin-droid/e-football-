'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAdmin, adminHeaders } from '@/lib/auth'

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin()) { router.push('/admin'); return }
    load()
  }, [])

  const load = async () => {
    const res = await fetch('/api/announcements')
    setAnnouncements(await res.json())
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    const res = await fetch('/api/announcements', {
      method: 'POST', headers: adminHeaders(),
      body: JSON.stringify({ title: title.trim(), content: content.trim() }),
    })
    if (res.ok) { setTitle(''); setContent(''); load() }
  }

  const handleDelete = async (id) => {
    if (!confirm('Silmek istediğine emin misin?')) return
    await fetch('/api/announcements', { method: 'DELETE', headers: adminHeaders(), body: JSON.stringify({ id }) })
    load()
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
          <h1 className="text-2xl font-bold gradient-text">📢 Duyuru Yönetimi</h1>
          <p className="text-sm text-[#D4AF37]/40 mt-1">Duyuru ekle, yayınla, sil</p>
        </div>
        <a href="/admin" className="text-sm text-[#D4AF37] hover:text-[#F5D061] font-medium transition-colors">← Admin Paneli</a>
      </div>

      <div className="dark-card rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold text-white/80 mb-4">➕ Yeni Duyuru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#D4AF37]/60 mb-1.5">Başlık</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#D4AF37]/60 mb-1.5">İçerik</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4}
              className="w-full px-4 py-2.5 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none text-white transition-all resize-none" required />
          </div>
          <button type="submit"
            className="px-6 py-2.5 gold-gradient text-[#0a0a18] rounded-xl font-bold hover:opacity-90 transition-all shadow-md">
            Yayınla
          </button>
        </form>
      </div>

      <div className="dark-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="gold-gradient text-[#0a0a18]">
              <th className="p-3 text-left">Başlık</th>
              <th className="p-3 text-left">İçerik</th>
              <th className="p-3 text-left">Tarih</th>
              <th className="p-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((a, i) => (
              <tr key={a.id} className={`border-b border-[#2a2a4a] ${i % 2 === 0 ? 'bg-[#12122a]' : 'bg-[#161630]'} hover:bg-[#1a1a3a]`}>
                <td className="p-3 font-medium text-white/80">{a.title}</td>
                <td className="p-3 text-white/50 max-w-xs truncate">{a.content}</td>
                <td className="p-3 text-white/30 text-xs">
                  {new Date(a.created_at).toLocaleDateString('tr-TR')}
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-300 transition-colors">🗑️</button>
                </td>
              </tr>
            ))}
            {announcements.length === 0 && (
              <tr><td colSpan={4} className="p-12 text-center text-[#D4AF37]/40">
                <div className="text-4xl mb-2">📢</div>
                Henüz duyuru yok
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
