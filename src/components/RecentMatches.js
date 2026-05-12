import { supabase } from '@/lib/supabase'

export default async function RecentMatches() {
  const { data: matches } = await supabase
    .from('matches')
    .select('*, home_team:home_team_id(name), away_team:away_team_id(name)')
    .order('week', { ascending: false })
    .order('match_date', { ascending: false })
    .limit(6)

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md border border-green-100/50">
        <div className="text-5xl mb-3">⚽</div>
        <p className="text-gray-400">Henüz maç eklenmedi</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <div
          key={match.id}
          className="bg-white rounded-xl p-4 shadow-md border border-green-100/50 card-hover"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Hafta {match.week}
            </span>
            {match.match_date && (
              <span className="text-xs text-gray-400">
                {new Date(match.match_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 text-right">
              <span className="font-semibold text-gray-800 text-sm md:text-base">
                {match.home_team?.name}
              </span>
            </div>

            <div className="flex-shrink-0">
              {match.status === 'played' ? (
                <div className="flex items-center gap-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl px-4 py-2 border border-green-200 animate-scorePop">
                  <span className="text-xl md:text-2xl font-black text-green-800">{match.home_score}</span>
                  <span className="text-xs font-bold text-gray-400">-</span>
                  <span className="text-xl md:text-2xl font-black text-green-800">{match.away_score}</span>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium border border-amber-200">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                  Bekliyor
                </span>
              )}
            </div>

            <div className="flex-1">
              <span className="font-semibold text-gray-800 text-sm md:text-base">
                {match.away_team?.name}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
