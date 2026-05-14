import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const verifyAdmin = async (req) => req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD

export async function GET() {
  const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(10)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(req) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { title, content } = await req.json()
  const { data, error } = await supabase.from('announcements').insert({ title, content }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
