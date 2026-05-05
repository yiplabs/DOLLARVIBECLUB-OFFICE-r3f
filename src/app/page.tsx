import Link from 'next/link'
import { AuroraBlobs } from '@/components/chrome/AuroraBlobs'
import { DollarCoin } from '@/components/chrome/DollarCoin'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-dvc-bg">
      <AuroraBlobs />

      {/* corner stickers */}
      <div className="absolute top-6 right-6 z-10 rotate-3">
        <div className="bg-dvc-yellow text-dvc-border border-2 border-dvc-border rounded-md px-3 py-1.5 shadow-brutSm font-ui font-black text-xs uppercase tracking-wider">
          v0 — proof of concept
        </div>
      </div>

      <a
        href="https://discord.gg/dollarvibeclub"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-6 left-6 z-10 -rotate-2 brut-btn bg-dvc-discord text-white border-2 border-dvc-border rounded-lg px-3 py-2 font-ui font-bold text-xs hover:rotate-0 transition-transform"
      >
        💬 join the discord
      </a>

      <a
        href="https://www.youtube.com/@dollarvibeclub"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-6 left-6 z-10 -rotate-3 brut-btn bg-rose-600 text-white border-2 border-dvc-border rounded-lg px-3 py-2 font-ui font-bold text-xs hover:rotate-0 transition-transform"
      >
        ▶ live on yt
      </a>

      <section className="relative z-10 text-center px-6 max-w-3xl">
        <div className="inline-flex justify-center mb-6">
          <DollarCoin size={88} spin />
        </div>

        <h1 className="font-hand font-bold text-7xl sm:text-8xl text-dvc-cream leading-none">
          the cowork
        </h1>
        <h2 className="font-hand font-bold text-5xl sm:text-6xl text-dvc-cream mt-1">
          for{' '}
          <span className="relative inline-block">
            vibe coders.
            <span className="absolute left-0 right-0 bottom-1 h-2 bg-dvc-teal -z-10 rounded-sm" />
          </span>
        </h2>

        <p className="font-body text-lg text-dvc-cream/80 mt-6 max-w-xl mx-auto">
          drop in. ship something. find your people.
        </p>

        <div className="mt-5 inline-block bg-dvc-section border-2 border-dvc-border rounded-md px-3 py-1.5 shadow-brutSm">
          <span className="font-ui font-bold text-sm text-dvc-yellow">
            just $1/month
          </span>
          <span className="mx-2 text-dvc-border">·</span>
          <span className="font-ui text-sm text-dvc-cream/80">
            all courses + every tool unlocked
          </span>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/map"
            className="brut-btn bg-dvc-teal text-white px-6 py-3 rounded-lg font-ui font-black text-base"
          >
            enter the cowork →
          </Link>
          <a
            href="https://dollarvibeclub.com"
            className="brut-btn bg-dvc-card text-dvc-cream border-2 border-dvc-border px-6 py-3 rounded-lg font-ui font-bold text-base"
          >
            ← back to dvc
          </a>
        </div>

        <p className="mt-8 font-ui text-xs text-dvc-muted">
          no signup needed for v0 · click to walk · ephemeral chat
        </p>
      </section>
    </main>
  )
}
