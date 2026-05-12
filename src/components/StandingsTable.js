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
      <div className="text-center py-16 text-[#D4AF37]/40">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-lg">Henüz puan durumu oluşturulmadı</p>
        <p className="text-sm mt-1 text-[#D4AF37]/30">Admin panelinden ekleyebilirsin</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="gold-gradient text-[#0a0a18]">
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
                className={`border-b border-[#2a2a4a] transition-all duration-200 ${
                  isEven ? 'bg-[#12122a]' : 'bg-[#161630]'
                } ${isTop3 ? 'hover:bg-[#1a1a3a]' : 'hover:bg-[#1a1a3a]'}`}
              >
                <td className="p-3 text-center">
                  {isTop3 ? (
                    <span className="text-lg">{medals[i]}</span>
                  ) : (
                    <span className="text-[#D4AF37]/40">{pos}</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1a1a3a] flex items-center justify-center text-sm border border-[#D4AF37]/20">
                      {row.teams?.logo_url ? (
                        <img src={row.teams.logo_url} alt="" className="w-6 h-6 object-contain" />
                      ) : (
                        <span className="text-[#D4AF37] font-bold">{row.teams?.name?.[0] || '?'}</span>
                      )}
                    </div>
                    <span className={`${isTop3 ? 'text-[#D4AF37] font-semibold' : 'text-white/80'}`}>
                      {row.teams?.name || 'Bilinmeyen'}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-center text-white/50">{row.played}</td>
                <td className="p-3 text-center text-[#D4AF37] font-medium">{row.won}</td>
                <td className="p-3 text-center text-white/60">{row.drawn}</td>
                <td className="p-3 text-center text-red-400">{row.lost}</td>
                <td className="p-3 text-center text-white/80 font-medium">{row.goals_for}</td>
                <td className="p-3 text-center text-white/50">{row.goals_against}</td>
                <td className={`p-3 text-center font-semibold ${row.goal_diff > 0 ? 'text-[#D4AF37]' : row.goal_diff < 0 ? 'text-red-400' : 'text-white/50'}`}>
                  {row.goal_diff > 0 ? '+' : ''}{row.goal_diff}
                </td>
                <td className="p-3 text-center">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                    isTop3
                      ? 'gold-gradient text-[#0a0a18] shadow-lg animate-glow'
                      : 'bg-[#D4AF37]/20 text-[#D4AF37]'
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
