'use client'

import { useState } from 'react'
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
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-green-800 text-center mb-6">Admin Paneli</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Şifresi</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Şifre girin..."
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Kontrol ediliyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800">Admin Paneli</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
        >
          Çıkış Yap
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href="/admin/teams"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-100"
        >
          <div className="text-3xl mb-2">🏆</div>
          <h2 className="text-lg font-bold text-green-800">Takımlar</h2>
          <p className="text-sm text-gray-500 mt-1">Takım ekle/düzenle/sil</p>
        </a>
        <a
          href="/admin/players"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-100"
        >
          <div className="text-3xl mb-2">⚽</div>
          <h2 className="text-lg font-bold text-green-800">Oyuncular</h2>
          <p className="text-sm text-gray-500 mt-1">Oyuncu ekle/düzenle/sil</p>
        </a>
        <a
          href="/admin/matches"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-100"
        >
          <div className="text-3xl mb-2">📅</div>
          <h2 className="text-lg font-bold text-green-800">Maçlar</h2>
          <p className="text-sm text-gray-500 mt-1">Maç ekle/sonuç gir</p>
        </a>
        <a
          href="/admin/standings"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-100"
        >
          <div className="text-3xl mb-2">📊</div>
          <h2 className="text-lg font-bold text-green-800">Puan Durumu</h2>
          <p className="text-sm text-gray-500 mt-1">Puan durumu düzenle</p>
        </a>
      </div>
    </div>
  )
}
