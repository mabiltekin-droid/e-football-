import StandingsTable from '@/components/StandingsTable'
import BestPlayers from '@/components/BestPlayers'
import RecentMatches from '@/components/RecentMatches'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [{ count: teamCount }, { count: playerCount }, { count: matchCount }] = await Promise.all([
    supabase.from('teams').select('*', { count: 'exact', head: true }),
    supabase.from('players').select('*', { count: 'exact', head: true }),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Takım', value: teamCount || 0, icon: '🏆', color: 'from-emerald-500 to-green-600' },
    { label: 'Oyuncu', value: playerCount || 0, icon: '⭐', color: 'from-blue-500 to-indigo-600' },
    { label: 'Maç', value: matchCount || 0, icon: '⚽', color: 'from-amber-500 to-orange-600' },
  ]

  return (
    <div className="space-y-10">
      <div className="hero-gradient rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative">
          <div className="text-5xl md:text-6xl mb-4 animate-bounce">🏟️</div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
            EFootball Lig
          </h1>
          <p className="text-green-100/80 text-lg max-w-lg mx-auto">
            EFootball Mobile turnuvalarının resmi puan durumu ve istatistik sayfası
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`animate-slideUp stagger-${i + 1} bg-white rounded-xl p-6 shadow-md border border-green-100/50 card-hover`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl shadow-lg`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="animate-slideUp stagger-4">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl">📊</span>
          <h2 className="text-2xl font-bold gradient-text">Puan Durumu</h2>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-green-100/50 overflow-hidden card-hover">
          <StandingsTable />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="animate-slideUp stagger-5">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">⭐</span>
            <h2 className="text-2xl font-bold gradient-text">En İyi Oyuncular</h2>
          </div>
          <BestPlayers />
        </section>

        <section className="animate-slideUp stagger-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">⚽</span>
            <h2 className="text-2xl font-bold gradient-text">Son Maçlar</h2>
          </div>
          <RecentMatches />
        </section>
      </div>
    </div>
  )
}
