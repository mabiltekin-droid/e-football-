import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function getInitials(name) {
  return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'
}

function ratingColor(rating) {
  if (rating >= 8) return 'bg-gradient-to-br from-green-500 to-emerald-600'
  if (rating >= 6) return 'bg-gradient-to-br from-blue-500 to-cyan-600'
  if (rating >= 4) return 'bg-gradient-to-br from-amber-500 to-orange-600'
  return 'bg-gradient-to-br from-red-500 to-rose-600'
}

function positionBadge(pos) {
  const colors = {
    'Kaleci': 'bg-yellow-100 text-yellow-700',
    'Defans': 'bg-blue-100 text-blue-700',
    'Orta Saha': 'bg-green-100 text-green-700',
    'Forvet': 'bg-red-100 text-red-700',
  }
  return colors[pos] || 'bg-gray-100 text-gray-600'
}

export default async function PlayersPage() {
  const { data: players } = await supabase
    .from('players')
    .select('*, teams(name)')
    .order('rating', { ascending: false })

  if (!players || players.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-8">Oyuncular</h1>
        <div className="text-center py-20 bg-white rounded-xl shadow-md border border-green-100/50">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-lg text-gray-400">Henüz oyuncu eklenmedi</p>
          <p className="text-sm text-gray-300 mt-1">Admin panelinden ekleyebilirsin</p>
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
            className="bg-white rounded-xl p-5 shadow-md border border-green-100/50 card-hover animate-fadeIn"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center text-lg border-2 border-green-200 font-bold text-green-700 shadow-sm">
                  {getInitials(player.name)}
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                  {i + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate text-base">{player.name}</div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-gray-500 font-medium">{player.teams?.name}</span>
                  {player.position && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${positionBadge(player.position)}`}>
                      {player.position}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">{player.goals}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Gol</div>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div>
                  <div className="text-lg font-bold text-blue-500">{player.assists}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Asist</div>
                </div>
              </div>
              <div className={`${ratingColor(player.rating)} text-white rounded-lg px-3 py-1.5 text-center shadow-sm`}>
                <div className="font-bold text-sm">{player.rating}</div>
                <div className="text-[9px] opacity-80">Rating</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
