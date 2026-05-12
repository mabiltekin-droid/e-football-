import { supabase } from '@/lib/supabase'

export default async function StandingsTable() {
  const { data: standings } = await supabase
    .from('standings')
    .select('*, teams(name, logo_url)')
    .order('points', { ascending: false })
    .order('goal_diff', { ascending: false })
    .order('goals_for', { ascending: false })

  if (!standings || standings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Henüz puan durumu oluşturulmadı.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-green-700 text-white">
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Takım</th>
            <th className="p-2 text-center">O</th>
            <th className="p-2 text-center">G</th>
            <th className="p-2 text-center">B</th>
            <th className="p-2 text-center">M</th>
            <th className="p-2 text-center">AG</th>
            <th className="p-2 text-center">YG</th>
            <th className="p-2 text-center">AV</th>
            <th className="p-2 text-center font-bold">P</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => (
            <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="p-2 font-medium text-gray-700">{i + 1}</td>
              <td className="p-2">
                <div className="flex items-center gap-2">
                  {row.teams?.logo_url && (
                    <img src={row.teams.logo_url} alt="" className="w-5 h-5 object-contain" />
                  )}
                  <span className="font-medium">{row.teams?.name || 'Bilinmeyen'}</span>
                </div>
              </td>
              <td className="p-2 text-center">{row.played}</td>
              <td className="p-2 text-center">{row.won}</td>
              <td className="p-2 text-center">{row.drawn}</td>
              <td className="p-2 text-center">{row.lost}</td>
              <td className="p-2 text-center">{row.goals_for}</td>
              <td className="p-2 text-center">{row.goals_against}</td>
              <td className="p-2 text-center">{row.goal_diff}</td>
              <td className="p-2 text-center font-bold text-green-700">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
