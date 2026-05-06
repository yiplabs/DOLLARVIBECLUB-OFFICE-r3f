import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowRight } from 'lucide-react'
import { AuroraBlobs } from '@/components/chrome/AuroraBlobs'
import { DollarCoin } from '@/components/chrome/DollarCoin'
import { ROOMS } from '@/lib/rooms/catalog'

const HeroAvatar = dynamic(
  () => import('@/components/landing/HeroAvatar').then((m) => m.HeroAvatar),
  { ssr: false, loading: () => <div className="w-full h-72 md:h-80 rounded-2xl bg-dvc-card animate-pulse" /> },
)

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden bg-dvc-bg">
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

      {/* Hero */}
      <section className="relative z-10 text-center px-6 max-w-3xl pt-20">
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

      {/* Hero 3D preview */}
      <section className="relative z-10 mt-16 px-6 max-w-3xl w-full">
        <HeroAvatar />
        <p className="mt-3 text-center font-ui text-xs text-dvc-muted">
          this is what you&apos;ll look like inside · build your own at{' '}
          <Link href="/create" className="text-dvc-yellow font-bold hover:underline">
            /create
          </Link>
        </p>
      </section>

      {/* Room tiles */}
      <section className="relative z-10 mt-20 px-6 max-w-6xl w-full pb-24">
        <div className="text-center mb-8">
          <h3 className="font-hand font-bold text-4xl text-dvc-cream">
            six rooms, one campus
          </h3>
          <p className="font-body text-sm text-dvc-muted mt-1">
            walk between them. stay where the vibe fits.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROOMS.map((room, idx) => (
            <Link
              key={room.slug}
              href={`/room/${room.slug}`}
              className="group bg-dvc-card border-2 border-dvc-border rounded-xl shadow-brutCard p-5 hover:shadow-brutLg hover:-translate-y-px hover:translate-x-px transition-all"
              style={{ rotate: `${idx % 2 === 0 ? '-1deg' : '1deg'}` }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="px-2 py-0.5 rounded font-ui font-bold text-[10px] uppercase tracking-wider border-2 border-dvc-border"
                  style={{ background: room.accent, color: '#141412' }}
                >
                  {room.theme}
                </span>
                <ArrowRight
                  size={14}
                  className="text-dvc-cream/40 group-hover:text-dvc-yellow transition-colors"
                />
              </div>
              <h4 className="mt-3 font-hand font-bold text-3xl text-dvc-cream leading-tight">
                {room.name}
              </h4>
              <p className="mt-1 font-ui font-bold text-xs text-dvc-yellow">
                {room.tagline}
              </p>
              <p className="mt-2 font-body text-sm text-dvc-cream/70 leading-snug">
                {room.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* What's in v0 */}
      <section className="relative z-10 mt-4 px-6 max-w-4xl w-full pb-24">
        <div className="bg-dvc-card/85 backdrop-blur-md border-2 border-dvc-border rounded-2xl shadow-brutCard p-6">
          <h3 className="font-hand font-bold text-3xl text-dvc-cream">
            what works in v0
          </h3>
          <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-2 font-body text-sm text-dvc-cream/80">
            <li>✦ click-to-move avatar with A* pathfinding</li>
            <li>✦ six themed rooms with their own lighting + furniture</li>
            <li>✦ time-of-day slider (dawn → night)</li>
            <li>✦ ephemeral chat bubbles in 3D</li>
            <li>✦ wave / dance / sit / clap emotes</li>
            <li>✦ camera follows the avatar</li>
            <li>✦ minimap, settings, music, onboarding tour</li>
            <li>✦ persistent local profile (zero signup)</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-dvc-border/60">
            <p className="font-ui text-xs text-dvc-muted">
              <span className="text-dvc-yellow font-bold">v1 is coming:</span>{' '}
              real multiplayer, magic-link auth, voice chat, sit-on-chair, project showcases.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
