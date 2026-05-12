import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function MatchesPage() {
  const { data: matches } = await supabase
    .from('matches')
    .select('*, home_team:home_team_id(name), away_team:away_team_id(name)')
    .order('week', { ascending: true })
    .order('match_date', { ascending: true })

  if (!matches || matches.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-green-800 mb-6">Maçlar</h1>
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          Henüz maç eklenmedi.
        </div>
      </div>
    )
  }

  const weeks = [...new Set(matches.map((m) => m.week))].sort()

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-800 mb-6">Maçlar</h1>
      <div className="space-y-8">
        {weeks.map((week) => {
          const weekMatches = matches.filter((m) => m.week === week)
          return (
            <section key={week}>
              <h2 className="text-lg font-bold text-green-700 mb-3 border-b border-green-200 pb-1">
                Hafta {week}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {weekMatches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-right font-medium">{match.home_team?.name}</div>
                      <div className="flex items-center gap-3 mx-4">
                        {match.status === 'played' ? (
                          <span className="text-xl font-bold text-green-800">
                            {match.home_score} - {match.away_score}
                          </span>
                        ) : (
                          <span className="text-sm px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                            Bekliyor
                          </span>
                        )}
                      </div>
                      <div className="flex-1 font-medium">{match.away_team?.name}</div>
                    </div>
                    {match.match_date && (
                      <div className="text-xs text-gray-400 text-center mt-2">
                        {new Date(match.match_date).toLocaleDateString('tr-TR')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
