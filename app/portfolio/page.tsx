'use client'

import { useEffect, useRef, useState } from 'react'

const ACCENT1 = '#89AACC'
const ACCENT2 = '#4E85BF'
const HERO_IMG = '/portfolio/hero.jpeg'

type Project = {
  id: string
  title: string
  url: string
  img: string
  category: string
}

const WORDS = ['Design', 'Create', 'Inspire']
const ROLES = ['Creative', 'Fullstack', 'Founder', 'Scholar']

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'work-cozypaws',
    title: 'Cozy Paws',
    url: '/cozypaws',
    img: '/portfolio/cozypaws-thumb.png',
    category: 'Product / Web',
  },
]

function Reveal({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('pf-in-view')
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.15, rootMargin: '-60px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} data-pf-reveal className={className} style={style}>
      {children}
    </div>
  )
}

export default function PortfolioPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [roleIndex, setRoleIndex] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)

  useEffect(() => {
    const dur = 2700
    const start = performance.now()
    let raf = 0
    let wordTimer: ReturnType<typeof setInterval>
    let roleTimer: ReturnType<typeof setInterval>
    let doneTimer: ReturnType<typeof setTimeout>

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      setCount(Math.round(p * 100))
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        clearInterval(wordTimer)
        doneTimer = setTimeout(() => setIsLoading(false), 400)
      }
    }
    raf = requestAnimationFrame(tick)
    wordTimer = setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 900)
    roleTimer = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 2000)

    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(wordTimer)
      clearInterval(roleTimer)
      clearTimeout(doneTimer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  function addProject() {
    const url = newUrl.trim()
    if (!url) return
    let host = url
    try {
      host = new URL(url).hostname.replace('www.', '')
    } catch {
      // not a full URL — keep raw string as host fallback
    }
    const title = newTitle.trim() || host
    const id = 'work-' + Date.now()
    setProjects((p) => [...p, { id, title, url, img: '', category: 'Website' }])
    setNewUrl('')
    setNewTitle('')
  }

  function removeProject(id: string) {
    setProjects((p) => p.filter((x) => x.id !== id))
  }

  const countStr = String(count).padStart(3, '0')
  const countRatio = count / 100

  const explorationItems = [
    { id: 'exp-photo', img: HERO_IMG, label: '', rotate: 'rotate(-2deg)', marginLeft: '0' },
    ...projects.map((p, i) => ({
      id: 'exp-' + p.id,
      img: p.img || '',
      label: p.title,
      rotate: i % 2 === 0 ? 'rotate(1.5deg)' : 'rotate(-1.5deg)',
      marginLeft: i % 2 === 0 ? '12%' : '8%',
    })),
  ]

  return (
    <div
      id="portfolio-root"
      style={{
        position: 'relative',
        width: '100%',
        background: '#0a0a0a',
        color: '#f5f5f5',
        fontFamily: "'Inter', sans-serif",
        WebkitFontSmoothing: 'antialiased',
        overflowX: 'hidden',
        ['--accent1' as string]: ACCENT1,
        ['--accent2' as string]: ACCENT2,
      }}
    >
      {isLoading && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: 32, left: 32, fontSize: 11, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '.3em' }}>Portfolio</div>
          <div key={wordIndex} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(2.4rem,7vw,5rem)', color: 'rgba(245,245,245,.82)', animation: 'pf-role-fade-in .5s ease-out' }}>
            {WORDS[wordIndex]}
          </div>
          <div style={{ position: 'absolute', bottom: 28, right: 32, fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(3.5rem,12vw,9rem)', lineHeight: 1, color: '#f5f5f5', fontVariantNumeric: 'tabular-nums' }}>
            {countStr}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'rgba(31,31,31,.5)' }}>
            <div style={{ height: '100%', transformOrigin: 'left', transform: `scaleX(${countRatio})`, background: `linear-gradient(90deg, ${ACCENT1} 0%, ${ACCENT2} 100%)`, boxShadow: `0 0 8px color-mix(in srgb, ${ACCENT1} 45%, transparent)` }} />
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', justifyContent: 'center', padding: '20px 16px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 999, backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.08)', background: 'rgba(20,20,20,.72)', padding: 8, boxShadow: scrolled ? '0 10px 34px rgba(0,0,0,.5)' : 'none', transition: 'box-shadow .4s ease' }}>
          <a href="#top" style={{ width: 36, height: 36, borderRadius: 999, background: `linear-gradient(120deg, ${ACCENT1}, ${ACCENT2})`, padding: 1.5, display: 'flex', transition: 'transform .3s ease' }}>
            <span style={{ flex: 1, borderRadius: 999, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 13, color: '#f5f5f5' }}>CG</span>
          </a>
          <span style={{ width: 1, height: 20, background: '#1f1f1f', margin: '0 6px' }} />
          <a href="#top" style={{ fontSize: 13, borderRadius: 999, padding: '8px 16px', color: '#f5f5f5', background: 'rgba(31,31,31,.5)', transition: 'all .25s' }}>Home</a>
          <a href="#work" style={{ fontSize: 13, borderRadius: 999, padding: '8px 16px', color: '#8a8a8a', transition: 'all .25s' }}>Work</a>
          <a href="#contact" style={{ fontSize: 13, borderRadius: 999, padding: '8px 16px', color: '#8a8a8a', transition: 'all .25s' }}>Resume</a>
          <span style={{ width: 1, height: 20, background: '#1f1f1f', margin: '0 6px' }} />
          <a href="#contact" style={{ fontSize: 13, borderRadius: 999, padding: '8px 16px', color: '#f5f5f5', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'box-shadow .3s, background .3s' }}>
            Say hi <span style={{ fontSize: 11 }}>&#8599;</span>
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section id="top" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center 30%', filter: 'saturate(1.05)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,.45)', mixBlendMode: 'normal', opacity: 0.7 }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 220, background: 'linear-gradient(to top, #0a0a0a, transparent)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 180, background: 'linear-gradient(to bottom, rgba(10,10,10,.7), transparent)' }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: 720 }}>
          <div style={{ fontSize: 11, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '.3em', marginBottom: 'clamp(10px,3vh,28px)' }}>Collection &#8217;26</div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, letterSpacing: '-.02em', fontSize: 'clamp(2.6rem,10vw,9rem)', lineHeight: 0.9, color: '#f5f5f5', margin: '0 0 clamp(8px,2vh,20px)' }}>
            Carlos Guimaraes
          </h1>
          <p style={{ fontSize: 'clamp(1rem,3vw,1.6rem)', color: 'rgba(245,245,245,.85)', margin: '0 0 clamp(8px,2vh,26px)', fontWeight: 300 }}>
            A{' '}
            <span key={roleIndex} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: '#f5f5f5', display: 'inline-block', animation: 'pf-role-fade-in .4s ease-out' }}>
              {ROLES[roleIndex]}
            </span>{' '}
            lives in Seattle.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: '#8a8a8a', maxWidth: 440, margin: '0 auto clamp(16px,5vh,44px)' }}>
            Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
            <a href="#work" style={{ borderRadius: 999, fontSize: 14, padding: '14px 28px', background: '#f5f5f5', color: '#0a0a0a', fontWeight: 500, transition: 'all .3s ease', textAlign: 'center' }}>See Works</a>
            <a href="#contact" style={{ borderRadius: 999, fontSize: 14, padding: '14px 28px', border: '2px solid #1f1f1f', background: '#0a0a0a', color: '#f5f5f5', fontWeight: 500, transition: 'all .3s ease' }}>Reach out &#8599;</a>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 'clamp(10px,2vh,28px)', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '.2em' }}>Scroll</span>
          <span style={{ width: 1, height: 'clamp(20px,4vh,40px)', background: '#1f1f1f', position: 'relative', overflow: 'hidden', display: 'block' }}>
            <span style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 14, background: ACCENT1, animation: 'pf-scroll-down 1.5s ease-in-out infinite' }} />
          </span>
        </div>
      </section>

      {/* SELECTED WORKS */}
      <section id="work" style={{ background: '#0a0a0a', padding: '96px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Reveal style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 56 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <span style={{ width: 32, height: 1, background: '#1f1f1f' }} />
                <span style={{ fontSize: 11, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '.3em' }}>Selected Work</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', margin: '0 0 14px', fontWeight: 400, letterSpacing: '-.02em' }}>
                Featured <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>projects</span>
              </h2>
              <p style={{ color: '#8a8a8a', fontSize: 15, maxWidth: 400, margin: 0 }}>A selection of projects I&#8217;ve worked on, from concept to launch.</p>
            </div>
            <a href="#work" style={{ borderRadius: 999, fontSize: 13, padding: '12px 22px', border: '1px solid #1f1f1f', color: '#f5f5f5', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'box-shadow .3s' }}>
              View all work <span>&#8594;</span>
            </a>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {projects.map((p) => (
              <Reveal key={p.id}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener"
                  style={{ position: 'relative', borderRadius: 26, overflow: 'hidden', border: '1px solid #1f1f1f', background: '#141414', aspectRatio: '21/9', display: 'block', cursor: 'pointer' }}
                >
                  <div style={{ position: 'absolute', inset: 0 }}>
                    {p.img ? (
                      <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a4a4a', fontSize: 13 }}>
                        Drop project image
                      </div>
                    )}
                  </div>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle,#000 1px,transparent 1px)', backgroundSize: '4px 4px', opacity: 0.2, mixBlendMode: 'multiply', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', left: 26, bottom: 24, pointerEvents: 'none', zIndex: 2 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 999, background: `linear-gradient(90deg, ${ACCENT1}, ${ACCENT2})`, color: '#0a0a0a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em' }}>Featured</span>
                      <span style={{ fontSize: 11, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '.2em' }}>{p.category}</span>
                    </div>
                    <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 30 }}>{p.title}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeProject(p.id)
                    }}
                    title="Remove"
                    style={{ position: 'absolute', top: 16, right: 16, zIndex: 3, width: 30, height: 30, borderRadius: 999, background: 'rgba(10,10,10,.65)', border: '1px solid rgba(255,255,255,.15)', color: '#f5f5f5', fontSize: 15, cursor: 'pointer', lineHeight: 1 }}
                  >
                    &#215;
                  </button>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal style={{ marginTop: 28, padding: 22, borderRadius: 22, border: '1px solid #1f1f1f', background: 'rgba(20,20,20,.4)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Project title (optional)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ flex: 1, minWidth: 160, background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: 10, padding: '12px 14px', color: '#f5f5f5', fontSize: 14, outline: 'none' }}
            />
            <input
              type="url"
              placeholder="https://your-project-link.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              style={{ flex: 2, minWidth: 220, background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: 10, padding: '12px 14px', color: '#f5f5f5', fontSize: 14, outline: 'none' }}
            />
            <button
              onClick={addProject}
              style={{ borderRadius: 999, fontSize: 13, padding: '12px 26px', background: '#f5f5f5', color: '#0a0a0a', fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'transform .2s' }}
            >
              Add Project
            </button>
          </Reveal>
        </div>
      </section>

      {/* ABOUT ME */}
      <section style={{ background: '#0a0a0a', padding: '80px 0' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 'clamp(32px,6vw,80px)', alignItems: 'center' }}>
          <Reveal style={{ aspectRatio: '4/5', borderRadius: 28, overflow: 'hidden', border: '1px solid #1f1f1f' }}>
            <img src={HERO_IMG} alt="Carlos Guimaraes" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </Reveal>
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <span style={{ width: 32, height: 1, background: '#1f1f1f' }} />
              <span style={{ fontSize: 11, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '.3em' }}>About Me</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', margin: '0 0 22px', fontWeight: 400, letterSpacing: '-.02em' }}>
              Brazilian <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>roots</span>, Seattle grind
            </h2>
            <p style={{ color: '#c9c9c9', fontSize: 16, lineHeight: 1.8, margin: '0 0 18px' }}>
              I&#8217;m Carlos Guimaraes, a 17-year-old developer and designer born in Brazil and now based in Seattle. I grew up switching between Portuguese and English, and somewhere in that mix I fell hard for computers — first for games, then for the realization I could build the things I wanted to play with.
            </p>
            <p style={{ color: '#8a8a8a', fontSize: 15, lineHeight: 1.8, margin: '0 0 18px' }}>
              Most nights you&#8217;ll find me deep in a code editor or sketching interfaces, chasing the same feeling skateboarding and soccer give me: small reps, steady improvement, the occasional wipeout. I care about clean systems, quiet UI, and building things fast without cutting corners.
            </p>
            <p style={{ color: '#8a8a8a', fontSize: 15, lineHeight: 1.8, margin: 0 }}>
              Right now I&#8217;m shipping side projects like Cozy Paws, learning everything I can about product design, and figuring out what I want to study after high school. Still a teenager, still figuring it out — but already building.
            </p>
          </Reveal>
        </div>
      </section>

      {/* EXPLORATIONS */}
      <section style={{ background: '#0a0a0a', padding: '80px 0', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px,6vw,120px)', alignItems: 'start' }}>
            <div style={{ position: 'sticky', top: '40vh', height: 0 }}>
              <Reveal>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                  <span style={{ width: 32, height: 1, background: '#1f1f1f' }} />
                  <span style={{ fontSize: 11, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '.3em' }}>Explorations</span>
                </div>
                <h2 style={{ fontSize: 'clamp(2rem,5vw,3.4rem)', margin: '0 0 16px', fontWeight: 400, letterSpacing: '-.02em' }}>
                  Visual <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>playground</span>
                </h2>
                <p style={{ color: '#8a8a8a', fontSize: 15, maxWidth: 340, margin: '0 0 26px' }}>Experiments, off-cuts, and the ideas that never made it to a brief.</p>
              </Reveal>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px,5vw,56px)', paddingTop: 20 }}>
              {explorationItems.map((it) => (
                <Reveal key={it.id} style={{ aspectRatio: '1', borderRadius: 24, overflow: 'hidden', border: '1px solid #1f1f1f', transform: it.rotate, marginLeft: it.marginLeft, position: 'relative' }}>
                  {it.img ? (
                    <img src={it.img} alt={it.label || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a4a4a', fontSize: 13, background: '#141414' }}>
                      Add a project to fill this
                    </div>
                  )}
                  {it.label && (
                    <div style={{ position: 'absolute', left: 14, bottom: 12, fontSize: 11, color: '#f5f5f5', background: 'rgba(10,10,10,.55)', padding: '4px 10px', borderRadius: 999, pointerEvents: 'none' }}>
                      {it.label}
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#0a0a0a', padding: '80px 0', borderTop: '1px solid #131313' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, textAlign: 'center' }}>
          <Reveal>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2.6rem,6vw,4.2rem)', lineHeight: 1 }}>1</div>
            <div style={{ fontSize: 12, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '.2em', marginTop: 8 }}>Year Coding</div>
          </Reveal>
          <Reveal>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2.6rem,6vw,4.2rem)', lineHeight: 1 }}>1</div>
            <div style={{ fontSize: 12, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '.2em', marginTop: 8 }}>Project Shipped</div>
          </Reveal>
          <Reveal>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2.6rem,6vw,4.2rem)', lineHeight: 1 }}>17</div>
            <div style={{ fontSize: 12, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '.2em', marginTop: 8 }}>Years Old</div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT / FOOTER */}
      <footer id="contact" style={{ position: 'relative', background: '#0a0a0a', padding: '96px 0 40px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scaleY(-1)', opacity: 0.5, filter: 'saturate(1.05)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,.7)' }} />

        <div style={{ position: 'relative', zIndex: 5, overflow: 'hidden', marginBottom: 72 }}>
          <div style={{ display: 'flex', width: 'max-content', animation: 'pf-marquee 40s linear infinite' }}>
            {[0, 1].map((i) => (
              <span key={i} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(2.2rem,7vw,5rem)', color: 'rgba(245,245,245,.14)', whiteSpace: 'nowrap' }}>
                Building the future &#8226; Building the future &#8226; Building the future &#8226; Building the future &#8226;{' '}
              </span>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '0 24px', maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '.3em', marginBottom: 22 }}>Let&#8217;s work together</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(2.6rem,8vw,5.5rem)', lineHeight: 1, margin: '0 0 34px' }}>Say hello.</h2>
          <a href="mailto:carlinhosgui76@icloud.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 999, fontSize: 15, padding: '16px 34px', background: '#f5f5f5', color: '#0a0a0a', fontWeight: 500, transition: 'all .3s ease' }}>
            carlinhosgui76@icloud.com <span>&#8599;</span>
          </a>
        </div>

        <div style={{ position: 'relative', zIndex: 5, maxWidth: 1200, margin: '88px auto 0', padding: '24px 24px 0', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#8a8a8a' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', animation: 'pf-pulse-dot 2s ease-in-out infinite', display: 'inline-block' }} />
            Available for projects
          </div>
          <div style={{ fontSize: 12, color: '#8a8a8a' }}>&#169; 2026 Carlos Guimaraes</div>
        </div>
      </footer>
    </div>
  )
}
