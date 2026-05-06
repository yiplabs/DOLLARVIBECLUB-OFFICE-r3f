import Link from 'next/link'
import { DollarCoin } from '@/components/chrome/DollarCoin'
import { AuroraBlobs } from '@/components/chrome/AuroraBlobs'
import { ROOMS } from '@/lib/rooms/catalog'

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dvc-bg">
      <AuroraBlobs />
      <div className="relative z-10 text-center max-w-lg px-6">
        <div className="inline-flex justify-center animate-float">
          <DollarCoin size={88} />
        </div>
        <h1 className="font-hand font-bold text-7xl text-dvc-cream mt-4">
          lost?
        </h1>
        <p className="font-body text-dvc-muted mt-2">
          this room isn&apos;t built yet — or you took a wrong turn.
        </p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ROOMS.map((r) => (
            <Link
              key={r.slug}
              href={`/room/${r.slug}`}
              className="bg-dvc-card border-2 border-dvc-border rounded-md shadow-brutSm p-2 text-left hover:bg-dvc-section transition-colors"
            >
              <span
                className="inline-block px-1.5 py-0.5 rounded text-[9px] font-ui font-black uppercase tracking-wider border-2 border-dvc-border"
                style={{ background: r.accent, color: '#141412' }}
              >
                {r.theme}
              </span>
              <div className="font-hand font-bold text-base text-dvc-cream mt-1 leading-tight">
                {r.name}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/map"
            className="brut-btn bg-dvc-teal text-white px-5 py-2.5 rounded-md font-ui font-bold text-sm"
          >
            ← back to campus
          </Link>
          <Link
            href="/"
            className="brut-btn bg-dvc-card text-dvc-cream border-2 border-dvc-border px-5 py-2.5 rounded-md font-ui font-bold text-sm"
          >
            home
          </Link>
        </div>
      </div>
    </main>
  )
}
