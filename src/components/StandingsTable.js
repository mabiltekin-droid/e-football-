import { supabase } from '@/lib/supabase'

const medals = ['🥇', '🥈', '🥉']

export default async function StandingsTable() {
  const { data: standings } = await supabase
    .from('standings')
    .select('*, teams(name, logo_url)')
    .order('points', { ascending: false })
    .order('goal_diff', { ascending: false })
    .order('goals_for', { ascending: false })

  if (!standings || standings.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-lg">Henüz puan durumu oluşturulmadı</p>
        <p className="text-sm mt-1">Admin panelinden ekleyebilirsin</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-green-700 to-green-600 text-white">
            <th className="p-3 text-left w-12">#</th>
            <th className="p-3 text-left">Takım</th>
            <th className="p-3 text-center w-10">O</th>
            <th className="p-3 text-center w-10">G</th>
            <th className="p-3 text-center w-10">B</th>
            <th className="p-3 text-center w-10">M</th>
            <th className="p-3 text-center w-12">AG</th>
            <th className="p-3 text-center w-12">YG</th>
            <th className="p-3 text-center w-12">AV</th>
            <th className="p-3 text-center w-14 font-bold">P</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => {
            const pos = i + 1
            const isTop3 = i < 3
            const isEven = i % 2 === 0
            return (
              <tr
                key={row.id}
                className={`border-b border-gray-100 transition-all duration-200 hover:bg-green-50/80 ${
                  isEven ? 'bg-white' : 'bg-gray-50/30'
                } ${isTop3 ? 'font-medium' : ''}`}
              >
                <td className="p-3 text-center">
                  {isTop3 ? (
                    <span className="text-lg">{medals[i]}</span>
                  ) : (
                    <span className="text-gray-400">{pos}</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center text-sm border border-green-200">
                      {row.teams?.logo_url ? (
                        <img src={row.teams.logo_url} alt="" className="w-6 h-6 object-contain" />
                      ) : (
                        <span className="text-green-600 font-bold">{row.teams?.name?.[0] || '?'}</span>
                      )}
                    </div>
                    <span className={`${isTop3 ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                      {row.teams?.name || 'Bilinmeyen'}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-center text-gray-600">{row.played}</td>
                <td className="p-3 text-center text-green-600 font-medium">{row.won}</td>
                <td className="p-3 text-center text-amber-600">{row.drawn}</td>
                <td className="p-3 text-center text-red-500">{row.lost}</td>
                <td className="p-3 text-center text-gray-700 font-medium">{row.goals_for}</td>
                <td className="p-3 text-center text-gray-500">{row.goals_against}</td>
                <td className={`p-3 text-center font-semibold ${row.goal_diff > 0 ? 'text-green-600' : row.goal_diff < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                  {row.goal_diff > 0 ? '+' : ''}{row.goal_diff}
                </td>
                <td className="p-3 text-center">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-white text-sm ${
                    isTop3 ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-md animate-pulse-glow' : 'bg-green-700'
                  }`}>
                    {row.points}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
