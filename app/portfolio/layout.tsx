import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carlos Guimaraes — Portfolio',
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@1&display=swap"
        rel="stylesheet"
      />
      <style>{`
        #portfolio-root html, #portfolio-root { scroll-behavior: smooth; }
        #portfolio-root a:hover { color: var(--accent1); }
        #portfolio-root ::selection { background: var(--accent2); color: #fff; }
        @keyframes pf-scroll-down { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
        @keyframes pf-role-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pf-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes pf-pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.7); } }
        [data-pf-reveal] { opacity: 0; transform: translateY(30px); transition: opacity 1s cubic-bezier(.25,.1,.25,1), transform 1s cubic-bezier(.25,.1,.25,1); }
        [data-pf-reveal].pf-in-view { opacity: 1; transform: none; }
      `}</style>
      {children}
    </>
  )
}
