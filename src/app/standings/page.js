import StandingsTable from '@/components/StandingsTable'

export const dynamic = 'force-dynamic'

export default function StandingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-green-800 mb-6">Puan Durumu</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <StandingsTable />
      </div>
    </div>
  )
}
