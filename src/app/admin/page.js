'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { setAdmin, isAdmin } from '@/lib/auth'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const authenticated = isAdmin()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      setAdmin(true, password)
      router.refresh()
    } else {
      setError('Hatalı şifre!')
    }
    setLoading(false)
  }

  const handleLogout = () => {
    setAdmin(false)
    router.refresh()
  }

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto mt-12 animate-fadeIn">
        <div className="dark-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🔐</div>
            <h1 className="text-2xl font-bold gradient-text">Admin Paneli</h1>
            <p className="text-sm text-[#D4AF37]/40 mt-1">Yetkili girişi</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#D4AF37]/60 mb-1.5">Admin Şifresi</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a3a] border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none transition-all text-white placeholder-white/20"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30">
                <span>❌</span> {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 gold-gradient text-[#0a0a18] rounded-xl font-bold hover:opacity-90 transition-all duration-200 disabled:opacity-50 shadow-lg"
            >
              {loading ? 'Kontrol ediliyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const cards = [
    { href: '/admin/teams', icon: '🏆', title: 'Takımlar', desc: 'Takım ekle, düzenle, sil', color: 'from-[#D4AF37] to-[#B8962E]' },
    { href: '/admin/players', icon: '⭐', title: 'Oyuncular', desc: 'Oyuncu ekle, düzenle, sil', color: 'from-[#F5D061] to-[#D4AF37]' },
    { href: '/admin/matches', icon: '⚽', title: 'Maçlar', desc: 'Maç ekle, sonuç gir', color: 'from-[#B8962E] to-[#8B6914]' },
    { href: '/admin/fixtures', icon: '📅', title: 'Fikstür', desc: 'Fikstür oluştur', color: 'from-[#D4AF37] to-[#8B6914]' },
    { href: '/admin/standings', icon: '📊', title: 'Puan Durumu', desc: 'Puan durumunu düzenle', color: 'from-emerald-500 to-green-600' },
    { href: '/admin/announcements', icon: '📢', title: 'Duyurular', desc: 'Duyuru yayınla', color: 'from-blue-500 to-indigo-600' },
  ]

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin Paneli</h1>
          <p className="text-[#D4AF37]/40 text-sm mt-1">Site içeriğini yönet</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 bg-red-900/30 text-red-400 rounded-xl hover:bg-red-900/50 transition-colors text-sm font-medium border border-red-800/30"
        >
          🚪 Çıkış Yap
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {cards.map((card, i) => (
          <a
            key={card.href}
            href={card.href}
            className="dark-card rounded-xl p-6 card-hover group animate-slideUp"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
              {card.icon}
            </div>
            <h2 className="text-lg font-bold text-white/80 group-hover:text-[#D4AF37] transition-colors">{card.title}</h2>
            <p className="text-sm text-[#D4AF37]/40 mt-1">{card.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
