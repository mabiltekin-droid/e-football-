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
        <h1 className="text-3xl font-bold gradient-text mb-8">📍 Maçlar</h1>
        <div className="text-center py-20 dark-card rounded-xl">
          <div className="text-6xl mb-4">⚽</div>
          <p className="text-lg text-[#D4AF37]/40">Henüz maç eklenmedi</p>
          <p className="text-sm text-[#D4AF37]/30 mt-1">Admin panelinden ekleyebilirsin</p>
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
                <span className="w-8 h-8 rounded-lg gold-gradient text-[#0a0a18] flex items-center justify-center text-sm font-bold shadow-md">
                  {week}
                </span>
                <h2 className="text-xl font-bold text-white/80">Hafta {week}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#D4AF37]/30 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weekMatches.map((match) => (
                  <div
                    key={match.id}
                    className="dark-card rounded-xl p-5 card-hover"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-right pr-4">
                        <span className="font-semibold text-white/80 text-lg">
                          {match.home_team?.name}
                        </span>
                      </div>

                      <div className="flex-shrink-0">
                        {match.status === 'played' ? (
                          <div className="flex items-center gap-3 bg-[#D4AF37]/10 rounded-2xl px-5 py-2.5 border-2 border-[#D4AF37]/20">
                            <span className="text-2xl font-black text-[#D4AF37]">{match.home_score}</span>
                            <span className="text-sm font-bold text-white/30">:</span>
                            <span className="text-2xl font-black text-[#D4AF37]">{match.away_score}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#D4AF37]/5 text-[#D4AF37]/60 rounded-xl text-sm font-medium border border-[#D4AF37]/10">
                            <span className="w-2 h-2 bg-[#D4AF37]/60 rounded-full animate-pulse-dot" />
                            Maç Bekleniyor
                          </span>
                        )}
                      </div>

                      <div className="flex-1 pl-4">
                        <span className="font-semibold text-white/80 text-lg">
                          {match.away_team?.name}
                        </span>
                      </div>
                    </div>
                    {match.match_date && (
                      <div className="text-center mt-3 text-xs text-white/30">
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
