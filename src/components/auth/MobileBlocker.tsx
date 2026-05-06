'use client'
import { DollarCoin } from '@/components/chrome/DollarCoin'

export function MobileBlocker() {
  return (
    <div className="lg:hidden fixed inset-0 z-[60] bg-dvc-bg flex items-center justify-center p-6 overflow-hidden">
      {/* Decorative aurora */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="aurora-blob animate-aurora-slow"
          style={{
            width: 360,
            height: 360,
            top: '-15%',
            left: '-10%',
            background: 'radial-gradient(circle, #0D9488 0%, transparent 70%)',
          }}
        />
        <div
          className="aurora-blob animate-aurora-slow"
          style={{
            width: 320,
            height: 320,
            bottom: '-10%',
            right: '-10%',
            background: 'radial-gradient(circle, #FBBF24 0%, transparent 70%)',
            animationDelay: '8s',
          }}
        />
      </div>

      <div className="relative bg-dvc-card border-2 border-dvc-border rounded-2xl shadow-brutLg p-8 max-w-sm w-full text-center animate-pop-in">
        <div className="flex justify-center animate-float">
          <DollarCoin size={88} />
        </div>
        <h2 className="font-hand font-bold text-4xl text-dvc-cream mt-5 leading-tight">
          open this on your laptop
        </h2>
        <p className="font-body text-sm text-dvc-muted mt-2">
          DVC Cowork is desktop-only for v0. The 3D scene needs a real keyboard
          and a wider canvas — mobile lands in v1.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-ui font-bold text-dvc-cream/60 uppercase tracking-wider">
          <span className="px-1.5 py-0.5 bg-dvc-section border-2 border-dvc-border rounded">
            click-to-walk
          </span>
          <span className="px-1.5 py-0.5 bg-dvc-section border-2 border-dvc-border rounded">
            6 themed rooms
          </span>
          <span className="px-1.5 py-0.5 bg-dvc-section border-2 border-dvc-border rounded">
            no signup
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <a
            href="https://discord.gg/dollarvibeclub"
            target="_blank"
            rel="noopener noreferrer"
            className="brut-btn bg-dvc-yellow text-dvc-border py-2 rounded-md font-ui font-bold text-sm"
          >
            join the discord
          </a>
          <a
            href="https://dollarvibeclub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="brut-btn bg-dvc-section text-dvc-cream py-2 rounded-md font-ui font-bold text-sm border-2 border-dvc-border"
          >
            ← back to dvc
          </a>
        </div>

        <p className="mt-5 font-ui text-[10px] text-dvc-muted">
          tap the link from a laptop to come back here.
        </p>
      </div>
    </div>
  )
}
