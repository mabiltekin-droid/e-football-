import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function getInitials(name) {
  return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'
}

function ratingColor(rating) {
  if (rating >= 8) return 'from-[#D4AF37] to-[#B8962E]'
  if (rating >= 6) return 'from-[#F5D061] to-[#D4AF37]'
  if (rating >= 4) return 'from-[#B8962E] to-[#8B6914]'
  return 'from-red-600 to-red-800'
}

function positionBadge(pos) {
  const colors = {
    'Kaleci': 'bg-yellow-900/30 text-yellow-400 border-yellow-700/30',
    'Defans': 'bg-blue-900/30 text-blue-400 border-blue-700/30',
    'Orta Saha': 'bg-green-900/30 text-green-400 border-green-700/30',
    'Forvet': 'bg-red-900/30 text-red-400 border-red-700/30',
    'Kanat': 'bg-purple-900/30 text-purple-400 border-purple-700/30',
  }
  const c = colors[pos]
  return c ? `${c} border` : 'bg-white/5 text-white/50 border border-white/10'
}

export default async function PlayersPage() {
  const { data: players } = await supabase
    .from('players')
    .select('*, teams(name)')
    .order('rating', { ascending: false })

  if (!players || players.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-8">⭐ Oyuncular</h1>
        <div className="text-center py-20 dark-card rounded-xl">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-lg text-[#D4AF37]/40">Henüz oyuncu eklenmedi</p>
          <p className="text-sm text-[#D4AF37]/30 mt-1">Admin panelinden ekleyebilirsin</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold gradient-text mb-8">⭐ Oyuncular</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player, i) => (
          <div
            key={player.id}
            className="dark-card rounded-xl p-5 card-hover animate-fadeIn"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-[#1a1a3a] flex items-center justify-center text-lg border-2 border-[#D4AF37]/30 font-bold text-[#D4AF37] shadow-sm">
                  {getInitials(player.name)}
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full gold-gradient text-[#0a0a18] flex items-center justify-center text-[10px] font-bold shadow-md">
                  {i + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white/90 truncate text-base">{player.name}</div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-[#D4AF37]/50 font-medium">{player.teams?.name}</span>
                  {player.position && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${positionBadge(player.position)}`}>
                      {player.position}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2a2a4a]">
              <div className="flex items-center gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-[#D4AF37]">{player.goals}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider">Gol</div>
                </div>
                <div className="w-px h-8 bg-[#2a2a4a]" />
                <div>
                  <div className="text-lg font-bold text-[#F5D061]">{player.assists}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider">Asist</div>
                </div>
              </div>
              <div className={`bg-gradient-to-br ${ratingColor(player.rating)} text-[#0a0a18] rounded-lg px-3 py-1.5 text-center shadow-sm`}>
                <div className="font-bold text-sm">{player.rating}</div>
                <div className="text-[9px] opacity-70">Rating</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
