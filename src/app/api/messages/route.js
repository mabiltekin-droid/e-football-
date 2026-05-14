import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(request) {
  const { nickname, content } = await request.json()

  if (!nickname?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'Nickname ve mesaj gerekli' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({ nickname: nickname.trim().slice(0, 30), content: content.trim().slice(0, 500) })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
