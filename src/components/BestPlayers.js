import { supabase } from '@/lib/supabase'

const rankColors = [
  'from-yellow-400 to-amber-500',
  'from-gray-300 to-gray-400',
  'from-amber-600 to-amber-700',
]

function getInitials(name) {
  return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'
}

function ratingColor(rating) {
  if (rating >= 8) return 'from-green-500 to-emerald-600'
  if (rating >= 6) return 'from-blue-500 to-cyan-600'
  if (rating >= 4) return 'from-amber-500 to-orange-600'
  return 'from-red-500 to-rose-600'
}

export default async function BestPlayers() {
  const { data: players } = await supabase
    .from('players')
    .select('*, teams(name)')
    .order('rating', { ascending: false })
    .limit(5)

  if (!players || players.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md border border-green-100/50">
        <div className="text-5xl mb-3">⭐</div>
        <p className="text-gray-400">Henüz oyuncu eklenmedi</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {players.map((player, i) => (
        <div
          key={player.id}
          className="bg-white rounded-xl p-4 shadow-md border border-green-100/50 card-hover flex items-center gap-4"
        >
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${rankColors[i] || 'from-green-500 to-green-600'} flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}>
            {i + 1}
          </div>

          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center text-sm border-2 border-green-200 flex-shrink-0 font-bold text-green-700">
            {getInitials(player.name)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">{player.name}</div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-medium">
                {player.teams?.name || 'Free'}
              </span>
              {player.position && (
                <span>{player.position}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="text-center">
              <div className="font-bold text-green-600 text-base">{player.goals}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Gol</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <div className="font-bold text-blue-500 text-base">{player.assists}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Asist</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className={`bg-gradient-to-br ${ratingColor(player.rating)} text-white rounded-lg px-2.5 py-1.5 min-w-[46px] text-center shadow-sm`}>
              <div className="font-bold text-sm">{player.rating}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
