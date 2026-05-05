'use client'

export function AuroraBlobs() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="aurora-blob animate-aurora-slow"
        style={{
          width: 520,
          height: 520,
          top: '-12%',
          left: '-6%',
          background: 'radial-gradient(circle, #0D9488 0%, transparent 70%)',
        }}
      />
      <div
        className="aurora-blob animate-aurora-slow"
        style={{
          width: 460,
          height: 460,
          top: '40%',
          right: '-8%',
          background: 'radial-gradient(circle, #FBBF24 0%, transparent 70%)',
          animationDelay: '6s',
        }}
      />
      <div
        className="aurora-blob animate-aurora-slow"
        style={{
          width: 380,
          height: 380,
          bottom: '-10%',
          left: '20%',
          background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)',
          animationDelay: '12s',
        }}
      />
    </div>
  )
}
