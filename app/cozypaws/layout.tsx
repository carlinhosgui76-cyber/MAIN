import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CozyPaws — Everything Your Pets Love',
}

export default function CozyPawsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes cpFadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cpFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cpSlideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes cpSlideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes cpWordPop {
          0% { opacity: 0; transform: translateY(60px) scale(0.7) rotate(-4deg); filter: blur(8px); }
          60% { opacity: 1; transform: translateY(-8px) scale(1.05) rotate(1deg); filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(0); filter: blur(0); }
        }
        @keyframes cpScaleIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes cpPhotoReveal { from { opacity: 0; transform: translateY(80px) scale(1.02); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cpDrawerIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
      {children}
    </>
  )
}
