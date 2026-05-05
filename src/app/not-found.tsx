import Link from 'next/link'
import { DollarCoin } from '@/components/chrome/DollarCoin'
import { AuroraBlobs } from '@/components/chrome/AuroraBlobs'

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dvc-bg">
      <AuroraBlobs />
      <div className="relative z-10 text-center">
        <DollarCoin size={88} />
        <h1 className="font-hand text-7xl text-dvc-cream mt-4">lost?</h1>
        <p className="font-body text-dvc-muted mt-2">
          this room hasn&apos;t been built yet.
        </p>
        <Link
          href="/map"
          className="inline-block mt-6 brut-btn bg-dvc-teal text-white px-5 py-2.5 rounded-md font-ui font-bold text-sm"
        >
          ← back to campus
        </Link>
      </div>
    </main>
  )
}
