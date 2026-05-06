'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { DollarCoin } from '@/components/chrome/DollarCoin'
import { AuroraBlobs } from '@/components/chrome/AuroraBlobs'

/**
 * App-level error boundary. Catches any uncaught render error from a route and
 * shows a brutalist recovery screen instead of white-screening.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[dvc-cowork app error]', error)
    }
  }, [error])

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dvc-bg">
      <AuroraBlobs />
      <div className="relative z-10 max-w-md w-full text-center px-6">
        <div className="inline-flex justify-center mb-4">
          <DollarCoin size={72} />
        </div>
        <h1 className="font-hand font-bold text-6xl text-dvc-cream">
          oof — that broke
        </h1>
        <p className="mt-3 font-body text-sm text-dvc-cream/70">
          something crashed while rendering this view. you can try again, or
          go back to the campus.
        </p>
        {error.message && (
          <pre className="mt-4 text-left bg-dvc-card border-2 border-dvc-border rounded-md p-3 font-mono text-[11px] text-rose-300 whitespace-pre-wrap break-words">
            {error.message}
          </pre>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="brut-btn bg-dvc-yellow text-dvc-border px-4 py-2 rounded-md font-ui font-bold text-sm"
          >
            try again
          </button>
          <Link
            href="/map"
            className="brut-btn bg-dvc-section text-dvc-cream px-4 py-2 rounded-md font-ui font-bold text-sm"
          >
            back to campus
          </Link>
        </div>
      </div>
    </main>
  )
}
