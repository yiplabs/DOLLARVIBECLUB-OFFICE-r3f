import type { Metadata, Viewport } from 'next'
import { Sora, Nunito, Caveat, Epilogue } from 'next/font/google'
import { ToastProvider } from '@/components/chrome/ToastProvider'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-sora',
  display: 'swap',
})
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
})
const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-caveat',
  display: 'swap',
})
const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-epilogue',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DVC Cowork — vibe coders, find your people',
  description: 'Drop in. Ship something. Find your people. The 3D cowork space for vibe coders, an extension of Dollar Vibe Club.',
  metadataBase: new URL('https://cowork.dollarvibeclub.com'),
  openGraph: {
    title: 'DVC Cowork — vibe coders, find your people',
    description: 'Drop in. Ship something. Find your people.',
    url: 'https://cowork.dollarvibeclub.com',
    siteName: 'DVC Cowork',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DVC Cowork — vibe coders, find your people',
    description: 'Drop in. Ship something. Find your people.',
    creator: '@tommyyipxyz',
  },
}

export const viewport: Viewport = {
  themeColor: '#141412',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${nunito.variable} ${caveat.variable} ${epilogue.variable}`}
    >
      <body className="bg-dvc-bg text-dvc-cream font-body antialiased min-h-screen">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
