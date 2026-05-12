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
      <div className="text-center py-8 text-gray-500">
        Henüz maç eklenmedi.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {matches.map((match) => (
        <div key={match.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-400 mb-1">Hafta {match.week}</div>
          <div className="flex items-center justify-between">
            <div className="flex-1 font-medium text-right">{match.home_team?.name}</div>
            <div className="flex items-center gap-3 mx-4">
              {match.status === 'played' ? (
                <span className="text-lg font-bold text-green-800">
                  {match.home_score} - {match.away_score}
                </span>
              ) : (
                <span className="text-sm text-gray-400">vs</span>
              )}
            </div>
            <div className="flex-1 font-medium">{match.away_team?.name}</div>
          </div>
          {match.match_date && (
            <div className="text-xs text-gray-400 text-center mt-1">
              {new Date(match.match_date).toLocaleDateString('tr-TR')}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
