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
        <h1 className="text-3xl font-bold gradient-text mb-8">Maçlar</h1>
        <div className="text-center py-20 bg-white rounded-xl shadow-md border border-green-100/50">
          <div className="text-6xl mb-4">⚽</div>
          <p className="text-lg text-gray-400">Henüz maç eklenmedi</p>
          <p className="text-sm text-gray-300 mt-1">Admin panelinden ekleyebilirsin</p>
        </div>
      </div>
    )
  }

  const weeks = [...new Set(matches.map((m) => m.week))].sort()

  return (
    <div>
      <h1 className="text-3xl font-bold gradient-text mb-8">📍 Maçlar</h1>
      <div className="space-y-10">
        {weeks.map((week, wi) => {
          const weekMatches = matches.filter((m) => m.week === week)
          return (
            <section key={week} className="animate-slideUp" style={{ animationDelay: `${wi * 0.1}s` }}>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center text-sm font-bold shadow-md">
                  {week}
                </span>
                <h2 className="text-xl font-bold text-gray-800">Hafta {week}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weekMatches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-white rounded-xl p-5 shadow-md border border-green-100/50 card-hover"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-right pr-4">
                        <span className="font-semibold text-gray-800 text-lg">
                          {match.home_team?.name}
                        </span>
                      </div>

                      <div className="flex-shrink-0">
                        {match.status === 'played' ? (
                          <div className="flex items-center gap-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl px-5 py-2.5 border-2 border-green-200">
                            <span className="text-2xl font-black text-green-800">{match.home_score}</span>
                            <span className="text-sm font-bold text-gray-300">:</span>
                            <span className="text-2xl font-black text-green-800">{match.away_score}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium border border-amber-200">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                            Maç Bekleniyor
                          </span>
                        )}
                      </div>

                      <div className="flex-1 pl-4">
                        <span className="font-semibold text-gray-800 text-lg">
                          {match.away_team?.name}
                        </span>
                      </div>
                    </div>
                    {match.match_date && (
                      <div className="text-center mt-3 text-xs text-gray-400">
                        🗓️ {new Date(match.match_date).toLocaleDateString('tr-TR', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
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
