'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Product = {
  id: string
  name: string
  price: number
  category: string
  brand: string
  rating: number
  reviews: number
  image: string
  tint: string
  description: string
}

type Page = 'home' | 'shop' | 'detail' | 'delivery' | 'brands' | 'blog' | 'favorites' | 'search'

const GREEN = '#1a3d1a'
const ORANGE = '#E86A10'
const BG = '#EFFDF0'

function mockImg(kw: string, lock: number) {
  return `https://loremflickr.com/600/600/${kw}?lock=${lock}`
}

function products(): Product[] {
  const tints = ['#DCF5DD', '#FBEADB', '#E3F0E3', '#F6F1E3']
  const t = (i: number) => tints[i % tints.length]
  const IMG = {
    catHouse: mockImg('cat,tree,tower', 11),
    dogBed: mockImg('dog,bed', 12),
    featherWand: mockImg('cat,toy', 13),
    treats: mockImg('dog,treats,snacks', 14),
    bowlSet: mockImg('pet,food,bowl', 15),
    ropeToy: mockImg('dog,rope,toy', 16),
    scratchTower: mockImg('cat,scratching,post', 17),
    harness: mockImg('dog,harness,leash', 18),
    blanket: mockImg('pet,blanket,dog', 19),
    puzzleBowl: mockImg('dog,bowl,food', 20),
  }
  return [
    { id: 'cat-house', name: 'Cozy Cat House', price: 49.99, category: 'Cats', brand: 'DenCraft', rating: 4.8, reviews: 214, image: IMG.catHouse, tint: t(0), description: "A plush felt hideaway with a removable washable cushion. Cats love the dark, enclosed shape; you'll love that it holds its structure and looks good in a living room." },
    { id: 'dog-bed', name: 'Orthopedic Dog Bed', price: 79.0, category: 'Dogs', brand: 'RestfulPaw', rating: 4.7, reviews: 168, image: IMG.dogBed, tint: t(1), description: 'Memory-foam base with a bolstered edge for chin resting. Cover zips off for machine washing. Best for medium and senior dogs.' },
    { id: 'feather-wand', name: 'Interactive Feather Wand', price: 12.5, category: 'Toys', brand: 'PounceLab', rating: 4.6, reviews: 342, image: IMG.featherWand, tint: t(2), description: 'Telescoping wand with three swap-on feather lures. Erratic flutter action that triggers real hunting play.' },
    { id: 'salmon-treats', name: 'Salmon Crunch Treats', price: 8.99, category: 'Food', brand: 'Wildbowl', rating: 4.9, reviews: 521, image: IMG.treats, tint: t(3), description: 'Single-ingredient freeze-dried salmon bites. Grain-free, high-protein, and irresistible to both cats and dogs.' },
    { id: 'bowl-set', name: 'Ceramic Food Bowl Set', price: 24.0, category: 'Feeding', brand: 'DenCraft', rating: 4.5, reviews: 97, image: IMG.bowlSet, tint: t(0), description: 'Two weighted ceramic bowls on a bamboo stand. Elevated height for comfortable eating; dishwasher safe.' },
    { id: 'rope-toy', name: 'Rope Tug Toy', price: 9.5, category: 'Toys', brand: 'PounceLab', rating: 4.4, reviews: 203, image: IMG.ropeToy, tint: t(1), description: 'Triple-braided cotton rope built for serious tuggers. Helps clean teeth while they play.' },
    { id: 'scratch-tower', name: 'Cat Scratching Tower', price: 64.0, category: 'Cats', brand: 'DenCraft', rating: 4.7, reviews: 132, image: IMG.scratchTower, tint: t(2), description: 'Three-tier sisal tower with a perch on top. Sturdy weighted base — no wobble, even for big cats.' },
    { id: 'harness', name: 'Adjustable No-Pull Harness', price: 32.0, category: 'Dogs', brand: 'TrailTail', rating: 4.6, reviews: 289, image: IMG.harness, tint: t(3), description: 'Padded Y-front harness with front and back leash clips. Four adjustment points for a snug, escape-proof fit.' },
    { id: 'blanket', name: 'Calming Pet Blanket', price: 19.99, category: 'Comfort', brand: 'RestfulPaw', rating: 4.8, reviews: 176, image: IMG.blanket, tint: t(0), description: 'Ultra-soft self-warming fleece that reflects body heat. Great for crates, car rides, and anxious pets.' },
    { id: 'puzzle-bowl', name: 'Slow-Feeder Puzzle Bowl', price: 15.0, category: 'Feeding', brand: 'Wildbowl', rating: 4.5, reviews: 154, image: IMG.puzzleBowl, tint: t(1), description: 'Maze-pattern bowl that slows fast eaters by up to 10x. Reduces bloat and makes mealtime a game.' },
  ]
}

const ALL_PRODUCTS = products()

const BRAND_INFO = [
  { name: 'DenCraft', tagline: 'Furniture-grade homes, towers, and bowls your pets (and living room) deserve.' },
  { name: 'RestfulPaw', tagline: 'Sleep science for pets — orthopedic beds and calming comfort layers.' },
  { name: 'PounceLab', tagline: 'Play engineered around real hunting instincts.' },
  { name: 'Wildbowl', tagline: 'Single-ingredient food and treats with nothing to hide.' },
  { name: 'TrailTail', tagline: 'Gear for dogs who go everywhere you go.' },
]

const PB = 'https://polo-pecan-73837341.figma.site/_assets/v11/'
const POSTS = [
  { tag: 'Cats', title: 'Why Cats Love Enclosed Spaces', excerpt: 'The instinct behind the cardboard box obsession — and how to give them a better option.', date: 'Jun 28, 2026', readTime: '4 min read', tint: '#DCF5DD', image: PB + '81bd2e7a66b58f3d8f3ad78fd1ebf01af8dfdee1.png' },
  { tag: 'Dogs', title: 'Slow Feeding: Small Change, Big Health Win', excerpt: "Fast eaters risk bloat and poor digestion. Here's how a puzzle bowl fixes it in a week.", date: 'Jun 19, 2026', readTime: '3 min read', tint: '#FBEADB', image: PB + '96745c4e72ad5c5208e53a885df797fd82cd854a.png?h=1024' },
  { tag: 'Training', title: 'Harness vs. Collar: What Vets Recommend', excerpt: 'When a no-pull harness matters, and how to fit one properly the first time.', date: 'Jun 10, 2026', readTime: '5 min read', tint: '#E3F0E3', image: PB + '8d44b25186ef45a5789c74668fb781cea4e1ff49.png' },
  { tag: 'Care', title: "A Senior Dog's Guide to Better Sleep", excerpt: 'Joint support, warmth, and routine — three things that transform older dogs’ rest.', date: 'May 30, 2026', readTime: '4 min read', tint: '#F6F1E3', image: PB + '3e5158dad63d392ade022e81890edc9f54d750bc.png' },
]

const DELIVERY_CARDS = [
  { title: 'Standard delivery', meta: 'Free over $35 · 2–4 days', body: 'Ships within 24 hours with full tracking. Orders under $35 ship for a flat $4.99.', stroke: GREEN, iconBg: '#DCF5DD', paths: ['M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2', 'M15 18H9', 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14', 'M8 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', 'M18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'] },
  { title: 'Express delivery', meta: 'Next-day · $9.99', body: 'Available in most metro areas. Order before 2 PM local time and it arrives tomorrow.', stroke: ORANGE, iconBg: '#FBEADB', paths: ['M13 2 3 14h9l-1 8 10-12h-9l1-8Z'] },
  { title: 'Live order tracking', meta: 'Real-time updates', body: 'Follow your parcel from our warehouse to your doorstep with email and SMS alerts.', stroke: GREEN, iconBg: '#E3F0E3', paths: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z', 'M12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z'] },
  { title: 'Secure payment', meta: 'Encrypted at checkout', body: 'All major cards, Apple Pay, Google Pay and PayPal — protected with 256-bit encryption.', stroke: ORANGE, iconBg: '#FBEADB', paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z', 'm9 12 2 2 4-4'] },
]

const PAY_METHODS = ['Visa', 'Mastercard', 'American Express', 'Apple Pay', 'Google Pay', 'PayPal']
const CATEGORIES = ['All', 'Cats', 'Dogs', 'Toys', 'Food', 'Feeding', 'Comfort']

function fmt(n: number) {
  return '$' + n.toFixed(2)
}

function Icon({ paths, stroke, size = 22 }: { paths: string[]; stroke: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  )
}

function HoverButton({
  style,
  hoverStyle,
  children,
  onClick,
  ariaLabel,
  type = 'button',
}: {
  style: CSSProperties
  hoverStyle: CSSProperties
  children: ReactNode
  onClick?: (e: React.MouseEvent) => void
  ariaLabel?: string
  type?: 'button' | 'submit'
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...style, ...(hover ? hoverStyle : {}) }}
    >
      {children}
    </button>
  )
}

function HoverDiv({
  style,
  hoverStyle,
  children,
  onClick,
}: {
  style: CSSProperties
  hoverStyle: CSSProperties
  children: ReactNode
  onClick?: (e: React.MouseEvent) => void
}) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...style, ...(hover ? hoverStyle : {}) }}
    >
      {children}
    </div>
  )
}

export default function CozyPawsPage() {
  const [page, setPage] = useState<Page>('home')
  const [productId, setProductId] = useState<string | null>(null)
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [favs, setFavs] = useState<Record<string, boolean>>({})
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutDone, setCheckoutDone] = useState(false)
  const [coName, setCoName] = useState('')
  const [coAddress, setCoAddress] = useState('')
  const [coEmail, setCoEmail] = useState('')
  const [coCard, setCoCard] = useState('')
  const [coError, setCoError] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [toast, setToastMsg] = useState('')
  const [width, setWidth] = useState(1280)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    setWidth(window.innerWidth)
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(toastTimer.current)
    }
  }, [])

  function showToast(msg: string) {
    clearTimeout(toastTimer.current)
    setToastMsg(msg)
    toastTimer.current = setTimeout(() => setToastMsg(''), 2200)
  }

  function go(p: Page) {
    setPage(p)
    setMenuOpen(false)
    if (p !== 'search') setSearchOpen(false)
    window.scrollTo(0, 0)
  }

  function addToCart(id: string, name: string) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }))
    showToast(name + ' added to cart')
  }

  function toggleFav(id: string, name: string) {
    const wasSet = !!favs[id]
    setFavs((f) => {
      const next = { ...f }
      if (next[id]) delete next[id]
      else next[id] = true
      return next
    })
    if (!wasSet) showToast(name + ' added to favorites')
  }

  function setQty(id: string, delta: number) {
    setCart((c) => {
      const next = { ...c }
      const q = (next[id] || 0) + delta
      if (q <= 0) delete next[id]
      else next[id] = q
      return next
    })
  }

  const isMobile = width < 768
  const isDesktop = !isMobile
  const effectivePage: Page = searchOpen && query.trim() ? 'search' : page

  let gridProducts: Product[] = []
  let gridTitle = ''
  let showFilters = false
  let emptyTitle = ''
  let emptyHint = ''
  if (effectivePage === 'shop') {
    gridTitle = 'Shop'
    showFilters = true
    gridProducts = category === 'All' ? ALL_PRODUCTS : ALL_PRODUCTS.filter((p) => p.category === category || p.brand === category)
  } else if (effectivePage === 'favorites') {
    gridTitle = 'Favorites'
    gridProducts = ALL_PRODUCTS.filter((p) => favs[p.id])
    emptyTitle = 'No favorites yet'
    emptyHint = 'Tap the star on any product to save it here.'
  } else if (effectivePage === 'search') {
    gridTitle = 'Search'
    const q = query.trim().toLowerCase()
    gridProducts = ALL_PRODUCTS.filter((p) => (p.name + ' ' + p.category + ' ' + p.brand).toLowerCase().includes(q))
    emptyTitle = 'No matches'
    emptyHint = 'Try a different word — e.g. "cat", "bed", "treats".'
  }
  const isGridPage = effectivePage === 'shop' || effectivePage === 'favorites' || effectivePage === 'search'

  const detailP = ALL_PRODUCTS.find((p) => p.id === productId) || ALL_PRODUCTS[0]

  const cartIds = Object.keys(cart)
  const cartItemsFull = cartIds.map((id) => {
    const p = ALL_PRODUCTS.find((x) => x.id === id)!
    return { ...p, qty: cart[id] }
  })
  const subtotal = cartItemsFull.reduce((sum, ci) => sum + ci.price * ci.qty, 0)
  const shipping = subtotal >= 35 || subtotal === 0 ? 0 : 4.99
  const cartCount = cartIds.reduce((n, id) => n + cart[id], 0)
  const favCount = Object.keys(favs).length

  const brands = BRAND_INFO.map((b) => ({ ...b, count: ALL_PRODUCTS.filter((p) => p.brand === b.name).length }))

  const navColor = (p: Page) => (effectivePage === p ? '#111827' : '#4b5563')

  const home = { label: 'Home', go: () => go('home') }
  type Crumb = { label: string; current?: boolean; go?: () => void }
  const crumbPath: Crumb[] = []
  if (effectivePage === 'shop') {
    crumbPath.push(home, { label: 'Shop', current: true })
    if (category !== 'All') crumbPath.push({ label: category, current: true })
  } else if (effectivePage === 'favorites') {
    crumbPath.push(home, { label: 'Favorites', current: true })
  } else if (effectivePage === 'search') {
    crumbPath.push(home, { label: 'Shop', go: () => { setCategory('All'); go('shop') } }, { label: 'Search results', current: true })
  } else if (effectivePage === 'detail') {
    crumbPath.push(
      home,
      { label: 'Shop', go: () => { setCategory('All'); go('shop') } },
      { label: detailP.category, go: () => { setCategory(detailP.category); go('shop') } },
      { label: detailP.name, current: true }
    )
  } else if (effectivePage === 'delivery') {
    crumbPath.push(home, { label: 'Delivery and payment', current: true })
  } else if (effectivePage === 'brands') {
    crumbPath.push(home, { label: 'Brands', current: true })
  } else if (effectivePage === 'blog') {
    crumbPath.push(home, { label: 'Blog', current: true })
  }

  const coFirstName = coName.trim().split(' ')[0] || 'friend'

  function placeOrder() {
    if (!coName.trim() || !coAddress.trim() || !coEmail.trim() || !coCard.trim()) {
      setCoError(true)
      return
    }
    setCheckoutDone(true)
    setOrderNumber('#CP-' + Math.floor(1000 + Math.random() * 9000))
    setCart({})
  }

  function finishCheckout() {
    setCheckoutOpen(false)
    setCoName('')
    setCoAddress('')
    setCoEmail('')
    setCoCard('')
    setCoError(false)
    go('shop')
  }

  function openHeroProduct() {
    setProductId('cat-house')
    go('detail')
  }

  function openProduct(id: string) {
    setProductId(id)
    go('detail')
  }

  function ProductCard({ p, index }: { p: Product; index: number }) {
    const fav = !!favs[p.id]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', animation: `cpFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${Math.min(index * 0.06, 0.6)}s both` }}>
        <div
          style={{ position: 'relative', aspectRatio: '1', borderRadius: 16, overflow: 'hidden', background: p.tint, cursor: 'pointer' }}
          onClick={() => openProduct(p.id)}
        >
          <img src={p.image} alt={p.name} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <HoverButton
            ariaLabel="Favorite"
            onClick={(e) => { e.stopPropagation(); toggleFav(p.id, p.name) }}
            style={{ position: 'absolute', top: 10, right: 10, width: 36, height: 36, borderRadius: '50%', border: 'none', background: fav ? ORANGE : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
            hoverStyle={{}}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill={fav ? 'white' : 'none'} stroke={fav ? 'white' : GREEN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </HoverButton>
          <HoverButton
            ariaLabel="Add to cart"
            onClick={(e) => { e.stopPropagation(); addToCart(p.id, p.name) }}
            style={{ position: 'absolute', bottom: 10, right: 10, width: 40, height: 40, borderRadius: '50%', background: GREEN, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            hoverStyle={{ background: '#2a5a2a' }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </HoverButton>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginTop: 10, cursor: 'pointer' }} onClick={() => openProduct(p.id)}>
          <span style={{ color: '#374151', fontSize: 14, fontWeight: 500 }}>{p.name}</span>
          <span style={{ color: GREEN, fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap' }}>{fmt(p.price)}</span>
        </div>
        <span style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>
          {p.category} · {p.brand}
        </span>
      </div>
    )
  }

  return (
    <div data-screen-label="CozyPaws Site" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Inter', sans-serif" }}>
      {/* HEADER */}
      <header style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px clamp(16px, 3vw, 48px)', position: 'relative', zIndex: 30 }}>
        <div onClick={() => go('home')} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <svg width={40} height={40} viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx={9} cy={10} r={2.6} fill={GREEN} />
            <circle cx={16} cy={7.5} r={2.6} fill={GREEN} />
            <circle cx={23} cy={10} r={2.6} fill={GREEN} />
            <circle cx={26} cy={17} r={2.4} fill={ORANGE} />
            <path d="M16 13c3.6 0 6.4 2.9 6.4 6.2 0 2.9-2.3 4.6-4.7 4.6-1.1 0-1.4-.5-1.7-.5s-.6.5-1.7.5c-2.4 0-4.7-1.7-4.7-4.6C9.6 15.9 12.4 13 16 13Z" fill={GREEN} />
          </svg>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(26px, 2.6vw, 34px)', color: GREEN, letterSpacing: '-0.01em' }}>CozyPaws</span>
        </div>
        {isDesktop && (
          <nav style={{ display: 'flex', gap: 32, alignItems: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); go('home') }} style={{ fontSize: 14, fontWeight: 500, color: navColor('home'), textDecoration: 'none' }}>Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setCategory('All'); go('shop') }} style={{ fontSize: 14, fontWeight: 500, color: navColor('shop'), textDecoration: 'none' }}>Shop</a>
            <a href="#" onClick={(e) => { e.preventDefault(); go('delivery') }} style={{ fontSize: 14, fontWeight: 500, color: navColor('delivery'), textDecoration: 'none' }}>Delivery and payment</a>
            <a href="#" onClick={(e) => { e.preventDefault(); go('brands') }} style={{ fontSize: 14, fontWeight: 500, color: navColor('brands'), textDecoration: 'none' }}>Brands</a>
            <a href="#" onClick={(e) => { e.preventDefault(); go('blog') }} style={{ fontSize: 14, fontWeight: 500, color: navColor('blog'), textDecoration: 'none' }}>Blog</a>
          </nav>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <HoverButton ariaLabel="Search" onClick={() => setSearchOpen((v) => !v)} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #d1d5db', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} hoverStyle={{ background: 'rgba(0,0,0,0.04)' }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx={11} cy={11} r={8} />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </HoverButton>
          <div style={{ position: 'relative' }}>
            <HoverButton ariaLabel="Favorites" onClick={() => go('favorites')} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} hoverStyle={{ background: '#d45e0d' }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </HoverButton>
            {favCount > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderRadius: '50%', background: GREEN, border: `2px solid ${BG}`, color: 'white', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>{favCount}</span>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <HoverButton ariaLabel="Cart" onClick={() => setCartOpen((v) => !v)} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #d1d5db', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} hoverStyle={{ background: 'rgba(0,0,0,0.04)' }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx={8} cy={21} r={1} />
                <circle cx={19} cy={21} r={1} />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </HoverButton>
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderRadius: '50%', background: ORANGE, border: `2px solid ${BG}`, color: 'white', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>{cartCount}</span>
            )}
          </div>
          {isDesktop && (
            <img src="https://polo-pecan-73837341.figma.site/_assets/v11/e62173d41f91350a59628e8a9a55ae078a886fb9.png?w=128" alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
          )}
          {isMobile && (
            <HoverButton ariaLabel="Menu" onClick={() => setMenuOpen((v) => !v)} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #d1d5db', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} hoverStyle={{}}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1={4} x2={20} y1={6} y2={6} />
                <line x1={4} x2={20} y1={12} y2={12} />
                <line x1={4} x2={20} y1={18} y2={18} />
              </svg>
            </HoverButton>
          )}
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(26,61,26,0.35)' }} onClick={() => setMenuOpen(false)}>
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 260, background: BG, padding: 24, display: 'flex', flexDirection: 'column', gap: 20, animation: 'cpDrawerIn 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); go('home') }} style={{ fontSize: 18, fontWeight: 600, color: GREEN, textDecoration: 'none' }}>Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setCategory('All'); go('shop') }} style={{ fontSize: 18, fontWeight: 600, color: GREEN, textDecoration: 'none' }}>Shop</a>
            <a href="#" onClick={(e) => { e.preventDefault(); go('delivery') }} style={{ fontSize: 18, fontWeight: 600, color: GREEN, textDecoration: 'none' }}>Delivery and payment</a>
            <a href="#" onClick={(e) => { e.preventDefault(); go('brands') }} style={{ fontSize: 18, fontWeight: 600, color: GREEN, textDecoration: 'none' }}>Brands</a>
            <a href="#" onClick={(e) => { e.preventDefault(); go('blog') }} style={{ fontSize: 18, fontWeight: 600, color: GREEN, textDecoration: 'none' }}>Blog</a>
            <a href="#" onClick={(e) => { e.preventDefault(); go('favorites') }} style={{ fontSize: 18, fontWeight: 600, color: ORANGE, textDecoration: 'none' }}>Favorites</a>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div style={{ position: 'relative', zIndex: 25, padding: '0 clamp(16px, 3vw, 48px) 12px', animation: 'cpFadeUp 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
          <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '1px solid #d1d5db', borderRadius: 999, padding: '10px 20px' }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx={11} cy={11} r={8} />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              autoFocus
              style={{ flex: 1, border: 'none', outline: 'none', fontFamily: "'Inter', sans-serif", fontSize: 15, color: GREEN, background: 'transparent' }}
            />
            <button onClick={() => setSearchOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 14, padding: 0 }}>✕</button>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      {crumbPath.length > 0 && (
        <nav aria-label="Breadcrumb" style={{ padding: '4px clamp(16px, 3vw, 48px) 0', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', animation: 'cpFadeIn 0.4s ease-out' }}>
          {crumbPath.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {!c.current ? (
                <a href="#" onClick={(e) => { e.preventDefault(); c.go && c.go() }} style={{ fontSize: 13, fontWeight: 500, color: '#4b5563', textDecoration: 'none' }}>{c.label}</a>
              ) : (
                <span style={{ fontSize: 13, fontWeight: 600, color: GREEN }}>{c.label}</span>
              )}
              {i < crumbPath.length - 1 && (
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* HOME */}
      {effectivePage === 'home' && (
        <section data-screen-label="Home hero" style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 84px)' }}>
          <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: 'clamp(1.5rem, 5vh, 5.4rem) clamp(16px, 3vw, 48px) 0' }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", color: GREEN, fontSize: 'clamp(44px, 7.5vw, 110px)', lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0, fontWeight: 400 }}>
              <span style={{ display: 'block' }}>
                <span style={{ display: 'inline-block', animation: 'cpWordPop 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both', opacity: 0 }}>Everything</span>
              </span>
              <span style={{ display: 'block' }}>
                <span style={{ display: 'inline-block', animation: 'cpWordPop 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.35s both', opacity: 0 }}>Your</span>{' '}
                <span style={{ display: 'inline-block', animation: 'cpWordPop 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both', opacity: 0 }}>&nbsp;Pets</span>{' '}
                <span style={{ display: 'inline-block', animation: 'cpWordPop 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.65s both', opacity: 0 }}>&nbsp;Love</span>
              </span>
            </h1>
          </div>

          {isDesktop && (
            <>
              <div style={{ position: 'absolute', top: 50, left: 48, width: 'clamp(160px, 14vw, 260px)', zIndex: 20, animation: 'cpSlideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both' }}>
                <div style={{ position: 'relative', aspectRatio: '260 / 257', borderRadius: 16, overflow: 'hidden' }}>
                  <img src="https://polo-pecan-73837341.figma.site/_assets/v11/3e5158dad63d392ade022e81890edc9f54d750bc.png" alt="Cozy Cat House" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <HoverButton ariaLabel="View product" onClick={openHeroProduct} style={{ position: 'absolute', bottom: 10, right: 10, width: 'clamp(32px, 3vw, 44px)', height: 'clamp(32px, 3vw, 44px)', borderRadius: '50%', background: GREEN, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} hoverStyle={{ background: '#2a5a2a' }}>
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 7h10v10" />
                      <path d="M7 17 17 7" />
                    </svg>
                  </HoverButton>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 10, gap: 8 }}>
                  <span style={{ color: '#374151', fontSize: 'clamp(12px, 1vw, 15px)', fontWeight: 500 }}>Cozy Cat House</span>
                  <span style={{ color: GREEN, fontSize: 'clamp(13px, 1.1vw, 16px)', fontWeight: 600 }}>$49.99</span>
                </div>
              </div>

              <div style={{ position: 'absolute', top: 50, right: 48, width: 'clamp(120px, 10vw, 177px)', zIndex: 20, animation: 'cpSlideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both' }}>
                <div style={{ position: 'relative', aspectRatio: '177 / 287', borderRadius: 16, overflow: 'hidden' }}>
                  <img src="https://polo-pecan-73837341.figma.site/_assets/v11/76be6ec3a93a703b15e9cc01e764a4e3f9d7d2c0.png" alt="Product reviews video" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '0 12px' }}>
                    <HoverButton ariaLabel="Play video" style={{ width: 'clamp(36px, 3vw, 44px)', height: 'clamp(36px, 3vw, 44px)', borderRadius: '50%', background: GREEN, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} hoverStyle={{ background: '#2a5a2a' }}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="6 3 20 12 6 21 6 3" />
                      </svg>
                    </HoverButton>
                    <span style={{ color: 'white', fontSize: 'clamp(10px, 0.8vw, 12px)', fontWeight: 500, textAlign: 'center', lineHeight: 1.35, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>Watch Product Reviews on TikTok and YouTube</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 0', position: 'relative', animation: 'cpPhotoReveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.75s both' }}>
              <img src="https://polo-pecan-73837341.figma.site/_assets/v11/8d44b25186ef45a5789c74668fb781cea4e1ff49.png" alt="Happy dog" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 'min(70vh, 55vw)', objectFit: 'cover', objectPosition: 'top' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '45%', background: 'linear-gradient(to top, rgba(26,61,26,0.6), rgba(26,61,26,0))', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 'clamp(20px, 4vh, 50px)', display: 'flex', alignItems: 'center', gap: 12, animation: 'cpScaleIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1s both' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="https://polo-pecan-73837341.figma.site/_assets/v11/e62173d41f91350a59628e8a9a55ae078a886fb9.png?w=128" alt="Customer" style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid white', display: 'block' }} />
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: GREEN, border: '2px solid white', marginLeft: -12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </div>
                </div>
                <span style={{ color: 'white', fontSize: 'clamp(20px, 2vw, 28px)', fontWeight: 600, textShadow: '0 1px 6px rgba(0,0,0,0.35)' }}>98K+</span>
              </div>
            </div>
            <div style={{ flex: '1.265 1 0', position: 'relative', zIndex: 2, animation: 'cpPhotoReveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both' }}>
              <img src="https://polo-pecan-73837341.figma.site/_assets/v11/96745c4e72ad5c5208e53a885df797fd82cd854a.png?h=1024" alt="Woman with cat" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 'min(85vh, 70vw)', objectFit: 'cover', objectPosition: 'top' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '45%', background: 'linear-gradient(to top, rgba(26,61,26,0.6), rgba(26,61,26,0))', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 'clamp(20px, 4vh, 50px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%', padding: '0 16px', boxSizing: 'border-box', animation: 'cpFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s both' }}>
                <span style={{ color: 'white', fontSize: 'clamp(16px, 1.8vw, 26px)', fontWeight: 600, textAlign: 'center', lineHeight: 1.25, textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>Best Products for Your Pet</span>
                <HoverButton onClick={() => { setCategory('All'); go('shop') }} style={{ display: 'flex', alignItems: 'center', gap: 8, background: ORANGE, color: 'white', border: 'none', borderRadius: 999, padding: 'clamp(8px,1vh,12px) clamp(16px,2vw,24px)', fontFamily: "'Inter', sans-serif", fontSize: 'clamp(13px, 1vw, 15px)', fontWeight: 600, cursor: 'pointer' }} hoverStyle={{ background: '#d45e0d' }}>
                  Explore Products
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </HoverButton>
              </div>
            </div>
            <div style={{ flex: '1 1 0', position: 'relative', animation: 'cpPhotoReveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both' }}>
              <img src="https://polo-pecan-73837341.figma.site/_assets/v11/81bd2e7a66b58f3d8f3ad78fd1ebf01af8dfdee1.png" alt="Cat" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 'min(70vh, 55vw)', objectFit: 'cover', objectPosition: 'top' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '45%', background: 'linear-gradient(to top, rgba(26,61,26,0.6), rgba(26,61,26,0))', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 'clamp(20px, 4vh, 50px)', display: 'flex', alignItems: 'center', gap: 10, animation: 'cpScaleIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1.2s both' }}>
                <span style={{ color: 'white', fontSize: 'clamp(20px, 2vw, 28px)', fontWeight: 600, textShadow: '0 1px 6px rgba(0,0,0,0.35)' }}>4.6</span>
                <svg width={24} height={24} viewBox="0 0 24 24" fill={ORANGE} stroke={ORANGE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SHOP / SEARCH / FAVORITES GRID */}
      {isGridPage && (
        <section data-screen-label="Shop" style={{ flex: 1, padding: '8px clamp(16px, 3vw, 48px) 64px', animation: 'cpFadeUp 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", color: GREEN, fontSize: 'clamp(32px, 4vw, 52px)', margin: 0, fontWeight: 400 }}>{gridTitle}</h2>
            <span style={{ color: '#4b5563', fontSize: 14 }}>{gridProducts.length}{gridProducts.length === 1 ? ' product' : ' products'}</span>
          </div>
          {showFilters && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
              {CATEGORIES.map((c, i) => {
                const active = category === c
                return (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    style={{
                      border: `1px solid ${active ? GREEN : '#d1d5db'}`,
                      background: active ? GREEN : 'white',
                      color: active ? 'white' : GREEN,
                      borderRadius: 999,
                      padding: '8px 18px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      animation: `cpFadeIn 0.5s ease-out ${i * 0.04}s both`,
                    }}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          )}
          {isGridPage && gridProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#4b5563' }}>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: GREEN, margin: '0 0 8px' }}>{emptyTitle}</p>
              <p style={{ fontSize: 14, margin: 0 }}>{emptyHint}</p>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 44vw), 1fr))', gap: 'clamp(12px, 2vw, 24px)' }}>
            {gridProducts.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* PRODUCT DETAIL */}
      {effectivePage === 'detail' && (
        <section data-screen-label="Product detail" style={{ flex: 1, padding: '8px clamp(16px, 3vw, 48px) 64px', animation: 'cpFadeUp 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
          <button onClick={() => go('shop')} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', color: '#4b5563', fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: 0, marginBottom: 24 }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to shop
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 'clamp(24px, 4vw, 64px)', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 24, overflow: 'hidden', background: detailP.tint, animation: 'cpScaleIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
              {detailP.image ? (
                <img src={detailP.image} alt={detailP.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
                  <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth={1.5} opacity={0.45} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx={11} cy={4} r={2} />
                    <circle cx={18} cy={8} r={2} />
                    <circle cx={20} cy={16} r={2} />
                    <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
                  </svg>
                  <span style={{ fontSize: 12, color: GREEN, opacity: 0.5, fontWeight: 500 }}>Photo coming soon</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'cpFadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}>
              <span style={{ color: '#6b7280', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{detailP.category} · {detailP.brand}</span>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", color: GREEN, fontSize: 'clamp(32px, 4vw, 48px)', margin: 0, fontWeight: 400, lineHeight: 1.05 }}>{detailP.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill={ORANGE} stroke={ORANGE} strokeWidth={2}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span style={{ color: GREEN, fontWeight: 600, fontSize: 15 }}>{detailP.rating}</span>
                <span style={{ color: '#6b7280', fontSize: 14 }}>({detailP.reviews} reviews)</span>
              </div>
              <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.65, margin: 0 }}>{detailP.description}</p>
              <span style={{ color: GREEN, fontSize: 32, fontWeight: 600 }}>{fmt(detailP.price)}</span>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <HoverButton onClick={() => addToCart(detailP.id, detailP.name)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: ORANGE, color: 'white', border: 'none', borderRadius: 999, padding: '14px 32px', fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer' }} hoverStyle={{ background: '#d45e0d' }}>
                  Add to Cart
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx={8} cy={21} r={1} />
                    <circle cx={19} cy={21} r={1} />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                </HoverButton>
                <HoverButton onClick={() => toggleFav(detailP.id, detailP.name)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', color: GREEN, border: `1px solid ${GREEN}`, borderRadius: 999, padding: '14px 28px', fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer' }} hoverStyle={{ background: 'rgba(26,61,26,0.06)' }}>
                  {favs[detailP.id] ? '★ Saved' : '☆ Save to Favorites'}
                </HoverButton>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DELIVERY */}
      {effectivePage === 'delivery' && (
        <section data-screen-label="Delivery" style={{ flex: 1, padding: '8px clamp(16px, 3vw, 48px) 72px' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <div style={{ maxWidth: 640, animation: 'cpFadeUp 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
              <span style={{ display: 'inline-block', color: ORANGE, fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>How it works</span>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", color: GREEN, fontSize: 'clamp(34px, 5vw, 64px)', margin: '0 0 16px', fontWeight: 400, lineHeight: 1.02, letterSpacing: '-0.015em' }}>Delivery &amp; payment, handled with care.</h2>
              <p style={{ color: '#4b5563', fontSize: 16, lineHeight: 1.65, margin: 0 }}>Fast, tracked shipping and secure checkout — so the only thing you think about is your pet&apos;s happy face at the door.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 'clamp(16px, 2vw, 24px)', marginTop: 44 }}>
              {DELIVERY_CARDS.map((d, i) => (
                <HoverDiv
                  key={d.title}
                  style={{ background: 'white', border: '1px solid rgba(26,61,26,0.08)', borderRadius: 24, padding: 28, transition: 'box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease', animation: `cpFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.08}s both` }}
                  hoverStyle={{ boxShadow: '0 12px 32px rgba(26,61,26,0.09)', transform: 'translateY(-4px)', borderColor: 'rgba(26,61,26,0.16)' }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: d.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <Icon paths={d.paths} stroke={d.stroke} />
                  </div>
                  <span style={{ display: 'block', color: GREEN, fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{d.title}</span>
                  <span style={{ display: 'block', color: ORANGE, fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{d.meta}</span>
                  <p style={{ color: '#4b5563', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{d.body}</p>
                </HoverDiv>
              ))}
            </div>

            <div style={{ marginTop: 'clamp(20px, 3vw, 32px)', background: GREEN, borderRadius: 24, padding: 'clamp(28px, 4vw, 44px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 28, animation: 'cpFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.35s both' }}>
              <div style={{ maxWidth: 420 }}>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", color: 'white', fontSize: 'clamp(22px, 2.4vw, 30px)', margin: '0 0 10px', fontWeight: 400 }}>Secure checkout, every way you pay</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>256-bit encrypted payments. We never store your card details.</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {PAY_METHODS.map((m) => (
                  <span key={m} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', color: 'white', fontSize: 13, fontWeight: 500, padding: '10px 16px', borderRadius: 999 }}>{m}</span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'clamp(20px, 3vw, 32px)', border: '1px solid rgba(26,61,26,0.12)', borderRadius: 24, padding: 'clamp(24px, 3vw, 36px)', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 20, animation: 'cpFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.45s both' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: '#FBEADB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <h3 style={{ color: GREEN, fontSize: 18, fontWeight: 600, margin: '0 0 6px' }}>30-day worry-free returns</h3>
                <p style={{ color: '#4b5563', fontSize: 14, lineHeight: 1.6, margin: 0 }}>Return any unused item in its original packaging within 30 days for a full refund. Opened food and treats can&apos;t be returned, but if something&apos;s wrong, we&apos;ll always make it right.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* BRANDS */}
      {effectivePage === 'brands' && (
        <section data-screen-label="Brands" style={{ flex: 1, padding: '8px clamp(16px, 3vw, 48px) 64px', animation: 'cpFadeUp 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", color: GREEN, fontSize: 'clamp(32px, 4vw, 52px)', margin: '0 0 32px', fontWeight: 400 }}>Our Brands</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 44vw), 1fr))', gap: 'clamp(12px, 2vw, 24px)' }}>
            {brands.map((b, i) => (
              <HoverDiv
                key={b.name}
                onClick={() => { setCategory(b.name); go('shop') }}
                style={{ background: 'white', borderRadius: 20, padding: 28, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8, transition: 'box-shadow 0.25s ease, transform 0.25s ease', animation: `cpFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s both` }}
                hoverStyle={{ boxShadow: '0 4px 16px rgba(26,61,26,0.1)', transform: 'translateY(-3px)' }}
              >
                <span style={{ fontFamily: "'DM Serif Display', serif", color: GREEN, fontSize: 24 }}>{b.name}</span>
                <span style={{ color: '#374151', fontSize: 13, lineHeight: 1.5 }}>{b.tagline}</span>
                <span style={{ color: ORANGE, fontSize: 13, fontWeight: 600, marginTop: 4 }}>{b.count} products →</span>
              </HoverDiv>
            ))}
          </div>
        </section>
      )}

      {/* BLOG */}
      {effectivePage === 'blog' && (
        <section data-screen-label="Blog" style={{ flex: 1, padding: '8px clamp(16px, 3vw, 48px) 64px', animation: 'cpFadeUp 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", color: GREEN, fontSize: 'clamp(32px, 4vw, 52px)', margin: '0 0 32px', fontWeight: 400 }}>From the Blog</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 80vw), 1fr))', gap: 'clamp(12px, 2vw, 24px)' }}>
            {POSTS.map((post, i) => (
              <HoverDiv
                key={post.title}
                style={{ background: 'white', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'box-shadow 0.25s ease, transform 0.25s ease', animation: `cpFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s both` }}
                hoverStyle={{ boxShadow: '0 4px 16px rgba(26,61,26,0.1)', transform: 'translateY(-3px)' }}
              >
                <div style={{ aspectRatio: '16/9', background: post.tint, overflow: 'hidden' }}>
                  <img src={post.image} alt={post.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ color: ORANGE, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{post.tag}</span>
                  <h3 style={{ color: GREEN, fontSize: 18, fontWeight: 600, margin: 0, lineHeight: 1.3 }}>{post.title}</h3>
                  <p style={{ color: '#4b5563', fontSize: 13, lineHeight: 1.55, margin: 0 }}>{post.excerpt}</p>
                  <span style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>{post.date} · {post.readTime}</span>
                </div>
              </HoverDiv>
            ))}
          </div>
        </section>
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(26,61,26,0.35)' }} onClick={() => setCartOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 'min(420px, 100vw)', background: BG, display: 'flex', flexDirection: 'column', animation: 'cpDrawerIn 0.3s cubic-bezier(0.16,1,0.3,1)', boxShadow: '-8px 0 32px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(26,61,26,0.12)' }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", color: GREEN, fontSize: 26, margin: 0, fontWeight: 400 }}>Your Cart</h3>
              <button onClick={() => setCartOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: GREEN, fontSize: 18, padding: 6 }}>✕</button>
            </div>
            {cartItemsFull.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, textAlign: 'center' }}>
                <p style={{ color: GREEN, fontSize: 16, fontWeight: 500, margin: 0 }}>Your cart is empty</p>
                <HoverButton onClick={() => { setCartOpen(false); setCategory('All'); go('shop') }} style={{ background: GREEN, color: 'white', border: 'none', borderRadius: 999, padding: '12px 28px', fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }} hoverStyle={{ background: '#2a5a2a' }}>Browse the shop</HoverButton>
              </div>
            ) : (
              <>
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {cartItemsFull.map((ci) => (
                    <div key={ci.id} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{ width: 64, height: 64, borderRadius: 12, background: ci.tint, flexShrink: 0, overflow: 'hidden' }}>
                        <img src={ci.image} alt={ci.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ color: GREEN, fontSize: 14, fontWeight: 600 }}>{ci.name}</span>
                        <span style={{ color: '#4b5563', fontSize: 13 }}>{fmt(ci.price * ci.qty)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => setQty(ci.id, -1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', fontSize: 14, color: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>−</button>
                        <span style={{ color: GREEN, fontSize: 14, fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{ci.qty}</span>
                        <button onClick={() => setQty(ci.id, 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', fontSize: 14, color: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(26,61,26,0.12)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#4b5563' }}>
                    <span>Shipping</span><span>{shipping === 0 ? 'Free' : fmt(shipping)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 600, color: GREEN }}>
                    <span>Total</span><span>{fmt(subtotal + shipping)}</span>
                  </div>
                  <HoverButton onClick={() => { setCheckoutOpen(true); setCheckoutDone(false); setCartOpen(false); setCoError(false) }} style={{ background: ORANGE, color: 'white', border: 'none', borderRadius: 999, padding: 14, fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%' }} hoverStyle={{ background: '#d45e0d' }}>Checkout</HoverButton>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(26,61,26,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: BG, borderRadius: 24, width: 'min(480px, 100%)', maxHeight: '90vh', overflowY: 'auto', padding: 32, animation: 'cpScaleIn 0.3s cubic-bezier(0.16,1,0.3,1)', boxSizing: 'border-box' }}>
            {!checkoutDone ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", color: GREEN, fontSize: 28, margin: 0, fontWeight: 400 }}>Checkout</h3>
                  <button onClick={() => setCheckoutOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: GREEN, fontSize: 18, padding: 6 }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <input value={coName} onChange={(e) => setCoName(e.target.value)} placeholder="Full name" style={{ border: '1px solid #d1d5db', borderRadius: 12, padding: '12px 16px', fontFamily: "'Inter', sans-serif", fontSize: 14, background: 'white', color: GREEN, outlineColor: GREEN }} />
                  <input value={coAddress} onChange={(e) => setCoAddress(e.target.value)} placeholder="Delivery address" style={{ border: '1px solid #d1d5db', borderRadius: 12, padding: '12px 16px', fontFamily: "'Inter', sans-serif", fontSize: 14, background: 'white', color: GREEN, outlineColor: GREEN }} />
                  <input value={coEmail} onChange={(e) => setCoEmail(e.target.value)} placeholder="Email" style={{ border: '1px solid #d1d5db', borderRadius: 12, padding: '12px 16px', fontFamily: "'Inter', sans-serif", fontSize: 14, background: 'white', color: GREEN, outlineColor: GREEN }} />
                  <input value={coCard} onChange={(e) => setCoCard(e.target.value)} placeholder="Card number (mock — any digits)" style={{ border: '1px solid #d1d5db', borderRadius: 12, padding: '12px 16px', fontFamily: "'Inter', sans-serif", fontSize: 14, background: 'white', color: GREEN, outlineColor: GREEN }} />
                  {coError && <span style={{ color: '#d45e0d', fontSize: 13 }}>Please fill in all fields.</span>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 600, color: GREEN, padding: '8px 2px' }}>
                    <span>Total</span><span>{fmt(subtotal + shipping)}</span>
                  </div>
                  <HoverButton onClick={placeOrder} style={{ background: ORANGE, color: 'white', border: 'none', borderRadius: 999, padding: 14, fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer' }} hoverStyle={{ background: '#d45e0d' }}>Place Order</HoverButton>
                  <span style={{ color: '#6b7280', fontSize: 12, textAlign: 'center' }}>Mock checkout — no real payment is processed.</span>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center', padding: '12px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", color: GREEN, fontSize: 30, margin: 0, fontWeight: 400 }}>Order placed!</h3>
                <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.6, margin: 0 }}>Thanks, {coFirstName}. Your order {orderNumber} is confirmed — a receipt is on its way to your inbox.</p>
                <HoverButton onClick={finishCheckout} style={{ background: GREEN, color: 'white', border: 'none', borderRadius: 999, padding: '12px 32px', fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 6 }} hoverStyle={{ background: '#2a5a2a' }}>Keep Shopping</HoverButton>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {!!toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 90, background: GREEN, color: 'white', borderRadius: 999, padding: '12px 24px', fontSize: 14, fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', animation: 'cpFadeUp 0.3s cubic-bezier(0.16,1,0.3,1)' }}>{toast}</div>
      )}
    </div>
  )
}
