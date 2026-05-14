import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

async function verifyAdmin(request) {
  const password = request.headers.get('x-admin-password')
  return password === process.env.ADMIN_PASSWORD
}

function generateRoundRobin(teams, weekCount, startDate, endDate) {
  const n = teams.length
  const list = [...teams]
  const isOdd = n % 2 !== 0
  if (isOdd) list.push(null)

  const roundsCount = list.length - 1
  const half = list.length / 2
  const rounds = []

  for (let round = 0; round < roundsCount; round++) {
    const matches = []
    for (let i = 0; i < half; i++) {
      const home = list[i]
      const away = list[list.length - 1 - i]
      if (home !== null && away !== null) {
        matches.push({ home_team_id: home, away_team_id: away })
      }
    }
    rounds.push(matches)
    list.splice(1, 0, list.pop())
  }

  const returnRounds = rounds.map(r =>
    r.map(m => ({ home_team_id: m.away_team_id, away_team_id: m.home_team_id }))
  )

  let allRounds = [...rounds, ...returnRounds]

  const selectedWeeks = Math.min(weekCount, allRounds.length)

  const startMs = new Date(startDate).getTime()
  const endMs = new Date(endDate).getTime()
  const totalDays = (endMs - startMs) / (1000 * 60 * 60 * 24)
  const daysBetweenWeeks = selectedWeeks > 1 ? totalDays / (selectedWeeks - 1) : 0

  const result = []
  for (let w = 0; w < selectedWeeks; w++) {
    const weekDate = new Date(startMs + daysBetweenWeeks * w * 86400000)
    for (const match of allRounds[w]) {
      result.push({
        home_team_id: match.home_team_id,
        away_team_id: match.away_team_id,
        week: w + 1,
        match_date: weekDate.toISOString().split('T')[0],
        status: 'pending',
        home_score: null,
        away_score: null,
      })
    }
  }
  return result
}

export async function POST(request) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { teamIds, weekCount, startDate, endDate } = await request.json()

  if (!teamIds || teamIds.length < 2) {
    return NextResponse.json({ error: 'En az 2 takım seçmelisiniz' }, { status: 400 })
  }

  const matches = generateRoundRobin(teamIds, weekCount, startDate, endDate)

  const { data, error } = await supabase.from('matches').insert(matches).select('id')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, count: matches.length })
}
