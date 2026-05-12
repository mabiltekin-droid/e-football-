import { supabase } from '@/lib/supabase'

const rankColors = [
  'from-[#D4AF37] to-[#B8962E]',
  'from-[#C0C0C0] to-[#A0A0A0]',
  'from-[#CD7F32] to-[#A0522D]',
]

function getInitials(name) {
  return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'
}

function ratingColor(rating) {
  if (rating >= 8) return 'from-[#D4AF37] to-[#B8962E]'
  if (rating >= 6) return 'from-[#F5D061] to-[#D4AF37]'
  if (rating >= 4) return 'from-[#B8962E] to-[#8B6914]'
  return 'from-red-600 to-red-800'
}

export default async function BestPlayers() {
  const { data: players } = await supabase
    .from('players')
    .select('*, teams(name)')
    .order('rating', { ascending: false })
    .limit(5)

  if (!players || players.length === 0) {
    return (
      <div className="text-center py-12 dark-card rounded-xl">
        <div className="text-5xl mb-3">⭐</div>
        <p className="text-[#D4AF37]/40">Henüz oyuncu eklenmedi</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {players.map((player, i) => (
        <div
          key={player.id}
          className="dark-card rounded-xl p-4 card-hover flex items-center gap-4"
        >
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${rankColors[i] || 'from-[#D4AF37]/50 to-[#B8962E]/50'} flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}>
            {i + 1}
          </div>

          <div className="w-11 h-11 rounded-full bg-[#1a1a3a] flex items-center justify-center text-sm border-2 border-[#D4AF37]/30 flex-shrink-0 font-bold text-[#D4AF37]">
            {getInitials(player.name)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white/90 truncate">{player.name}</div>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37]/50">
              <span className="px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full font-medium">
                {player.teams?.name || 'Free'}
              </span>
              {player.position && (
                <span>{player.position}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="text-center">
              <div className="font-bold text-[#D4AF37] text-base">{player.goals}</div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider">Gol</div>
            </div>
            <div className="w-px h-8 bg-[#2a2a4a]" />
            <div className="text-center">
              <div className="font-bold text-[#F5D061] text-base">{player.assists}</div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider">Asist</div>
            </div>
            <div className="w-px h-8 bg-[#2a2a4a]" />
            <div className={`bg-gradient-to-br ${ratingColor(player.rating)} text-[#0a0a18] rounded-lg px-2.5 py-1.5 min-w-[46px] text-center shadow-sm font-bold`}>
              <div className="font-bold text-sm">{player.rating}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
