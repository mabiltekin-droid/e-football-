import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

async function getTopScorers() {
  const { data } = await supabase.from('players').select('*, teams(name)').order('goals', { ascending: false }).limit(10)
  return data || []
}

async function getTopAssists() {
  const { data } = await supabase.from('players').select('*, teams(name)').order('assists', { ascending: false }).limit(10)
  return data || []
}

async function getStandings() {
  const { data } = await supabase.from('standings').select('*, teams(name)').order('points', { ascending: false })
  return data || []
}

async function getRecentResults() {
  const { data } = await supabase.from('matches').select('*, home_team:home_team_id(name), away_team:away_team_id(name)').eq('status', 'played').order('week', { ascending: false }).limit(5)
  return data || []
}

function FormBar({ won, drawn, lost }) {
  const total = won + drawn + lost || 1
  return (
    <div className="flex h-3 rounded-full overflow-hidden bg-[#1a1a3a]">
      <div className="bg-[#D4AF37] transition-all" style={{ width: `${(won / total) * 100}%` }} />
      <div className="bg-white/30 transition-all" style={{ width: `${(drawn / total) * 100}%` }} />
      <div className="bg-red-500/50 transition-all" style={{ width: `${(lost / total) * 100}%` }} />
    </div>
  )
}

function PieChart({ won, drawn, lost }) {
  const total = won + drawn + lost || 1
  const wPct = (won / total) * 100
  const dPct = (drawn / total) * 100
  const lPct = (lost / total) * 100
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-20 h-20 rounded-full flex-shrink-0"
        style={{
          background: `conic-gradient(#D4AF37 0% ${wPct}%, rgba(255,255,255,0.3) ${wPct}% ${wPct + dPct}%, rgba(239,68,68,0.5) ${wPct + dPct}% 100%)`,
        }}
      />
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-[#D4AF37]" /> Galibiyet: {won}</div>
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-white/30" /> Beraberlik: {drawn}</div>
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-red-500/50" /> Mağlubiyet: {lost}</div>
      </div>
    </div>
  )
}

function TeamForm({ teamId, matches }) {
  const teamMatches = matches.filter(m =>
    (m.home_team_id === teamId || m.away_team_id === teamId) && m.status === 'played'
  ).slice(0, 5)

  return (
    <div className="flex gap-1">
      {teamMatches.length === 0 ? (
        <span className="text-white/20 text-xs">-</span>
      ) : teamMatches.map((m, i) => {
        const won = (m.home_team_id === teamId && m.home_score > m.away_score) ||
                    (m.away_team_id === teamId && m.away_score > m.home_score)
        const drawn = m.home_score === m.away_score
        return (
          <span key={i}
            className={`w-5 h-5 rounded text-[9px] flex items-center justify-center font-bold ${
              won ? 'bg-[#D4AF37] text-[#0a0a18]' : drawn ? 'bg-white/20 text-white' : 'bg-red-500/50 text-white'
            }`}>
            {won ? 'G' : drawn ? 'B' : 'M'}
          </span>
        )
      })}
    </div>
  )
}

export default async function StatsPage() {
  const [scorers, assisters, standings, recentMatches] = await Promise.all([
    getTopScorers(), getTopAssists(), getStandings(), getRecentResults(),
  ])

  return (
    <div className="animate-fadeIn space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">📊 İstatistikler</h1>
        <p className="text-[#D4AF37]/40 text-sm">Lig geneli istatistik ve grafikler</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dark-card rounded-xl p-6">
          <h2 className="text-lg font-bold text-white/80 mb-4">⚽ Gol Krallığı</h2>
          <div className="space-y-2">
            {scorers.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 bg-[#1a1a3a] rounded-lg px-4 py-2.5">
                <span className="w-6 text-center text-sm font-bold text-[#D4AF37]">{i + 1}</span>
                <span className="flex-1 text-white/80 text-sm">{p.name}</span>
                <span className="text-xs text-[#D4AF37]/50">{p.teams?.name}</span>
                <span className="w-8 text-center font-bold text-[#D4AF37]">{p.goals}</span>
              </div>
            ))}
            {scorers.length === 0 && <p className="text-[#D4AF37]/30 text-sm text-center py-8">Henüz veri yok</p>}
          </div>
        </div>

        <div className="dark-card rounded-xl p-6">
          <h2 className="text-lg font-bold text-white/80 mb-4">🎯 Asist Krallığı</h2>
          <div className="space-y-2">
            {assisters.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 bg-[#1a1a3a] rounded-lg px-4 py-2.5">
                <span className="w-6 text-center text-sm font-bold text-[#D4AF37]">{i + 1}</span>
                <span className="flex-1 text-white/80 text-sm">{p.name}</span>
                <span className="text-xs text-[#D4AF37]/50">{p.teams?.name}</span>
                <span className="w-8 text-center font-bold text-[#F5D061]">{p.assists}</span>
              </div>
            ))}
            {assisters.length === 0 && <p className="text-[#D4AF37]/30 text-sm text-center py-8">Henüz veri yok</p>}
          </div>
        </div>
      </div>

      <div className="dark-card rounded-xl p-6">
        <h2 className="text-lg font-bold text-white/80 mb-4">📈 Takım İstatistikleri</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#D4AF37]/60 border-b border-[#2a2a4a]">
                <th className="p-3 text-left">Takım</th>
                <th className="p-3 text-center">P</th>
                <th className="p-3 text-center w-32">Dağılım</th>
                <th className="p-3 text-center">Form (son 5)</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row) => (
                <tr key={row.id} className="border-b border-[#2a2a4a] hover:bg-[#1a1a3a]">
                  <td className="p-3 font-medium text-white/80">{row.teams?.name}</td>
                  <td className="p-3 text-center font-bold text-[#D4AF37]">{row.points}</td>
                  <td className="p-3">
                    <FormBar won={row.won} drawn={row.drawn} lost={row.lost} />
                  </td>
                  <td className="p-3 text-center">
                    <TeamForm teamId={row.team_id} matches={recentMatches} />
                  </td>
                </tr>
              ))}
              {standings.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-[#D4AF37]/30">Henüz veri yok</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {standings.map((row) => (
        <div key={row.id} className="dark-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white/80">{row.teams?.name}</h3>
            <span className="text-sm font-bold text-[#D4AF37]">{row.points} puan</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PieChart won={row.won} drawn={row.drawn} lost={row.lost} />
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#1a1a3a] rounded-xl p-3"><div className="text-xl font-bold text-[#D4AF37]">{row.goals_for}</div><div className="text-[10px] text-white/30">Attığı</div></div>
              <div className="bg-[#1a1a3a] rounded-xl p-3"><div className="text-xl font-bold text-white/50">{row.goals_against}</div><div className="text-[10px] text-white/30">Yediği</div></div>
              <div className="bg-[#1a1a3a] rounded-xl p-3"><div className={`text-xl font-bold ${row.goal_diff > 0 ? 'text-[#D4AF37]' : row.goal_diff < 0 ? 'text-red-400' : 'text-white/50'}`}>{row.goal_diff > 0 ? '+' : ''}{row.goal_diff}</div><div className="text-[10px] text-white/30">Averaj</div></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
