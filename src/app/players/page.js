import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function PlayersPage() {
  const { data: players } = await supabase
    .from('players')
    .select('*, teams(name)')
    .order('rating', { ascending: false })

  if (!players || players.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-green-800 mb-6">Oyuncular</h1>
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          Henüz oyuncu eklenmedi.
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-800 mb-6">Oyuncular</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Oyuncu</th>
              <th className="p-3 text-left">Takım</th>
              <th className="p-3 text-left">Mevki</th>
              <th className="p-3 text-center">Gol</th>
              <th className="p-3 text-center">Asist</th>
              <th className="p-3 text-center">Rating</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, i) => (
              <tr key={player.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-500">{i + 1}</td>
                <td className="p-3 font-medium">{player.name}</td>
                <td className="p-3 text-gray-600">{player.teams?.name}</td>
                <td className="p-3 text-gray-600">{player.position}</td>
                <td className="p-3 text-center font-semibold text-green-700">{player.goals}</td>
                <td className="p-3 text-center font-semibold text-blue-600">{player.assists}</td>
                <td className="p-3 text-center">
                  <span className="bg-green-700 text-white px-2 py-0.5 rounded font-bold text-xs">
                    {player.rating}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
