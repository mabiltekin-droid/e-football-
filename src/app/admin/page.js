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
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100/50">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🔐</div>
            <h1 className="text-2xl font-bold gradient-text">Admin Paneli</h1>
            <p className="text-sm text-gray-400 mt-1">Yetkili girişi</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Admin Şifresi</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-gray-50/50"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">
                <span>❌</span> {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-600 transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {loading ? 'Kontrol ediliyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const cards = [
    { href: '/admin/teams', icon: '🏆', title: 'Takımlar', desc: 'Takım ekle, düzenle, sil', color: 'from-emerald-500 to-green-600' },
    { href: '/admin/players', icon: '⭐', title: 'Oyuncular', desc: 'Oyuncu ekle, düzenle, sil', color: 'from-blue-500 to-indigo-600' },
    { href: '/admin/matches', icon: '📅', title: 'Maçlar', desc: 'Maç ekle, sonuç gir', color: 'from-amber-500 to-orange-600' },
    { href: '/admin/standings', icon: '📊', title: 'Puan Durumu', desc: 'Puan durumunu düzenle', color: 'from-purple-500 to-violet-600' },
  ]

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin Paneli</h1>
          <p className="text-gray-400 text-sm mt-1">Site içeriğini yönet</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
        >
          🚪 Çıkış Yap
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <a
            key={card.href}
            href={card.href}
            className="bg-white rounded-xl p-6 shadow-md border border-green-100/50 card-hover group animate-slideUp"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
              {card.icon}
            </div>
            <h2 className="text-lg font-bold text-gray-800 group-hover:text-green-700 transition-colors">{card.title}</h2>
            <p className="text-sm text-gray-400 mt-1">{card.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
