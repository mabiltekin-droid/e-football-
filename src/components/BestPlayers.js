import { supabase } from '@/lib/supabase'

export default async function BestPlayers() {
  const { data: players } = await supabase
    .from('players')
    .select('*, teams(name)')
    .order('rating', { ascending: false })
    .limit(5)

  if (!players || players.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Henüz oyuncu eklenmedi.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {players.map((player, i) => (
        <div key={player.id} className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center font-bold text-sm">
            {i + 1}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{player.name}</div>
            <div className="text-xs text-gray-500">{player.teams?.name} - {player.position}</div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-green-700">{player.goals}</div>
              <div className="text-xs text-gray-400">Gol</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-600">{player.assists}</div>
              <div className="text-xs text-gray-400">Asist</div>
            </div>
            <div className="text-center bg-green-700 text-white rounded-lg px-2 py-1 min-w-[40px]">
              <div className="font-bold text-sm">{player.rating}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
