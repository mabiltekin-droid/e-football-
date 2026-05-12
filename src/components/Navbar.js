'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: '/', label: 'Ana Sayfa', icon: '👑' },
    { href: '/standings', label: 'Puan Durumu', icon: '📊' },
    { href: '/matches', label: 'Maçlar', icon: '⚽' },
    { href: '/players', label: 'Oyuncular', icon: '⭐' },
    { href: '/admin', label: 'Admin', icon: '⚙️' },
  ]

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-[#0a0a18] border-b border-[#D4AF37]/20 text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-90 transition-opacity"
          >
            <span className="text-2xl">👑</span>
            <span className="gradient-text">EFootball Lig</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'gold-gradient text-[#0a0a18] shadow-lg'
                      : 'text-[#D4AF37]/70 hover:text-[#D4AF37] hover:bg-white/5'
                  }`}
                >
                  <span className="mr-1.5">{link.icon}</span>
                  {link.label}
                </Link>
              )
            })}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Menüyü aç/kapat"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`block h-0.5 w-full bg-[#D4AF37] rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
              <span className={`block h-0.5 w-full bg-[#D4AF37] rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-full bg-[#D4AF37] rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 space-y-1 border-t border-[#D4AF37]/10">
          {links.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'gold-gradient text-[#0a0a18]'
                    : 'text-[#D4AF37]/70 hover:text-[#D4AF37] hover:bg-white/5'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
