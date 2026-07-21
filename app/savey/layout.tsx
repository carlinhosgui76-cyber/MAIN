import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Savey — track your money',
}

export default function SaveyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&family=Instrument+Serif:ital@0;1&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes svOrbFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        @keyframes svBlobMorph {
          0%,100% { border-radius: 46% 54% 52% 48% / 48% 46% 54% 52%; }
          50% { border-radius: 54% 46% 48% 52% / 52% 54% 46% 48%; }
        }
        @keyframes svFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes svFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes svScaleIn { from { opacity: 0; transform: scale(.55); } to { opacity: 1; transform: scale(1); } }
        @keyframes svPop { from { transform: scale(1.045); } to { transform: scale(1); } }
        @keyframes svGrowY { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes svBurst {
          from { transform: translate(0,0) scale(1); opacity: 1; }
          to { transform: translate(var(--bx), var(--by)) scale(0); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>
      {children}
    </>
  )
}
