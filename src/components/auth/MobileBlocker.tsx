'use client'
import { DollarCoin } from '@/components/chrome/DollarCoin'

export function MobileBlocker() {
  return (
    <div className="lg:hidden fixed inset-0 z-[60] bg-dvc-bg flex items-center justify-center p-6">
      <div className="bg-dvc-card border-2 border-dvc-border rounded-2xl shadow-brutLg p-8 max-w-sm w-full text-center">
        <div className="flex justify-center">
          <DollarCoin size={88} />
        </div>
        <h2 className="font-hand font-bold text-4xl text-dvc-cream mt-5 leading-tight">
          open this on your laptop
        </h2>
        <p className="font-body text-sm text-dvc-muted mt-2">
          DVC Cowork is desktop-only for v0. We&apos;re bringing mobile soon.
        </p>
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
      </div>
    </div>
  )
}
