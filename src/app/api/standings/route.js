import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

async function verifyAdmin(request) {
  const password = request.headers.get('x-admin-password')
  return password === process.env.ADMIN_PASSWORD
}

async function recalculateStandings() {
  const { data: teams } = await supabase.from('teams').select('id')
  if (!teams) return

  const { data: matches } = await supabase.from('matches').select('*').eq('status', 'played')
  if (!matches) return

  const standings = teams.map(team => {
    const teamMatches = matches.filter(m => m.home_team_id === team.id || m.away_team_id === team.id)
    let won = 0, drawn = 0, lost = 0, goals_for = 0, goals_against = 0

    teamMatches.forEach(m => {
      const isHome = m.home_team_id === team.id
      const gf = isHome ? m.home_score : m.away_score
      const ga = isHome ? m.away_score : m.home_score
      goals_for += gf
      goals_against += ga
      if (gf > ga) won++
      else if (gf === ga) drawn++
      else lost++
    })

    return {
      team_id: team.id,
      played: teamMatches.length,
      won, drawn, lost,
      goals_for, goals_against,
      goal_diff: goals_for - goals_against,
      points: won * 3 + drawn,
    }
  })

  for (const entry of standings) {
    await supabase.from('standings').upsert(entry, { onConflict: 'team_id' })
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from('standings')
    .select('*, teams(name, logo_url)')
    .order('points', { ascending: false })
    .order('goal_diff', { ascending: false })
    .order('goals_for', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(request) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await recalculateStandings()
  return NextResponse.json({ success: true })
}

export async function POST(request) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { data, error } = await supabase.from('standings').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(request) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { id, ...updates } = body
  const { data, error } = await supabase.from('standings').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await request.json()
  const { error } = await supabase.from('standings').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
