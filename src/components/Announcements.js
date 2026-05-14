import { supabase } from '@/lib/supabase'

export default async function Announcements() {
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  if (!announcements || announcements.length === 0) return null

  return (
    <section className="animate-slideUp stagger-1">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">📢</span>
        <h2 className="text-2xl font-bold gradient-text">Duyurular</h2>
      </div>
      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="dark-card rounded-xl p-5 card-hover">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-white/90 text-base mb-1">{a.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{a.content}</p>
              </div>
              <span className="text-[10px] text-white/20 whitespace-nowrap mt-0.5">
                {new Date(a.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
