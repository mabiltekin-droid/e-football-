import StandingsTable from '@/components/StandingsTable'

export const dynamic = 'force-dynamic'

export default function StandingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold gradient-text mb-8">📊 Puan Durumu</h1>
      <div className="dark-card rounded-xl overflow-hidden card-hover">
        <StandingsTable />
      </div>
    </div>
  )
}
