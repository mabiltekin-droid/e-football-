import StandingsTable from '@/components/StandingsTable'
import BestPlayers from '@/components/BestPlayers'
import RecentMatches from '@/components/RecentMatches'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-green-800">EFootball Lig</h1>
        <p className="text-gray-500 mt-2">EFootball Mobile Lig Sayfası</p>
      </div>

      <section>
        <h2 className="text-xl font-bold text-green-800 mb-4 border-b border-green-200 pb-2">
          Puan Durumu
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <StandingsTable />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h2 className="text-xl font-bold text-green-800 mb-4 border-b border-green-200 pb-2">
            En İyi Oyuncular
          </h2>
          <BestPlayers />
        </section>

        <section>
          <h2 className="text-xl font-bold text-green-800 mb-4 border-b border-green-200 pb-2">
            Son Maçlar
          </h2>
          <RecentMatches />
        </section>
      </div>
    </div>
  )
}
