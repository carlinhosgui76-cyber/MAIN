'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

// ───────────────────────── data ─────────────────────────

type Cat = { id: string; label: string; c: string }

const CATS: Cat[] = [
  { id: 'food', label: 'Food & Drink', c: '#E0975A' },
  { id: 'transport', label: 'Transport', c: '#7FA3C4' },
  { id: 'home', label: 'Home', c: '#A48BC0' },
  { id: 'fun', label: 'Fun', c: '#D97BA0' },
  { id: 'health', label: 'Health', c: '#6FB8B0' },
  { id: 'shopping', label: 'Shopping', c: '#C9B37E' },
  { id: 'other', label: 'Other', c: '#8E93A3' },
]
const INC_CATS: Cat[] = [
  { id: 'salary', label: 'Salary', c: '#8FBF9A' },
  { id: 'side', label: 'Side hustle', c: '#9BC6A6' },
  { id: 'gift', label: 'Gift', c: '#B9D6BE' },
]
const ALL_CATS = CATS.concat(INC_CATS)
const DAY = 86400000
const ACCENT = '#E9B44C'

type Tx = { id: string; type: 'inc' | 'exp'; cat: string; amt: number; note: string; ts: number; sample?: boolean }
type Budget = { id: string; cat: string; limit: number }

const SAMPLE_SEED: { d: number; t: 'inc' | 'exp'; cat: string; amt: number; note: string }[] = [
  { d: 0, t: 'exp', cat: 'food', amt: 6.4, note: 'Blue Bottle' },
  { d: 0, t: 'exp', cat: 'transport', amt: 18.2, note: 'Uber' },
  { d: 1, t: 'exp', cat: 'food', amt: 84.13, note: "Trader Joe's" },
  { d: 1, t: 'exp', cat: 'fun', amt: 32, note: 'Cinema night' },
  { d: 2, t: 'exp', cat: 'health', amt: 24.6, note: 'Pharmacy' },
  { d: 3, t: 'exp', cat: 'shopping', amt: 129, note: 'Zara' },
  { d: 3, t: 'exp', cat: 'food', amt: 17.8, note: 'Lunch' },
  { d: 4, t: 'exp', cat: 'transport', amt: 52.3, note: 'Gas' },
  { d: 5, t: 'exp', cat: 'fun', amt: 10.99, note: 'Spotify' },
  { d: 6, t: 'inc', cat: 'side', amt: 380, note: 'Logo project' },
  { d: 7, t: 'exp', cat: 'food', amt: 64.25, note: 'Dinner with Ana' },
  { d: 8, t: 'exp', cat: 'health', amt: 45, note: 'Gym' },
  { d: 9, t: 'exp', cat: 'shopping', amt: 76.4, note: 'Amazon' },
  { d: 10, t: 'exp', cat: 'food', amt: 5.9, note: 'Coffee' },
  { d: 11, t: 'exp', cat: 'transport', amt: 12.5, note: 'Train' },
  { d: 12, t: 'exp', cat: 'fun', amt: 89, note: 'Concert' },
  { d: 13, t: 'exp', cat: 'food', amt: 61.75, note: 'Groceries' },
  { d: 14, t: 'exp', cat: 'home', amt: 96.2, note: 'Electric bill' },
  { d: 15, t: 'exp', cat: 'food', amt: 28.4, note: 'Brunch' },
  { d: 16, t: 'exp', cat: 'shopping', amt: 21.99, note: 'Paperbacks' },
  { d: 17, t: 'exp', cat: 'home', amt: 1450, note: 'Rent' },
  { d: 18, t: 'inc', cat: 'salary', amt: 4200, note: 'Monthly salary' },
]
const SAMPLE_BUDGETS: Budget[] = [
  { id: 'sb1', cat: 'food', limit: 450 },
  { id: 'sb2', cat: 'fun', limit: 200 },
  { id: 'sb3', cat: 'shopping', limit: 250 },
  { id: 'sb4', cat: 'transport', limit: 120 },
]

function hexRgb(h: string): [number, number, number] {
  h = (h || '#A8ADB8').replace('#', '')
  if (h.length === 3) h = h.split('').map((x) => x + x).join('')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}
function mix(hex: string, target: 'w' | 'k', amt: number) {
  const a = hexRgb(hex)
  const b: [number, number, number] = target === 'w' ? [255, 255, 255] : [12, 10, 6]
  const m = a.map((v, i) => Math.round(v + (b[i] - v) * amt))
  return '#' + m.map((v) => v.toString(16).padStart(2, '0')).join('')
}
function rgba(hex: string, a: number) {
  const [r, g, b] = hexRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}
function fmt(n: number) {
  return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function fmtT(n: number) {
  const s = fmt(n)
  return s.endsWith('.00') ? s.slice(0, -3) : s
}
function catOf(id: string): Cat {
  return ALL_CATS.find((c) => c.id === id) || CATS[6]
}

const BONE = '#F2EFE6'
const MUT = 'rgba(242,239,230,.55)'
const CORAL = '#E0685A'
const SAGE = '#8FBF9A'

// ───────────────────────── iOS device chrome ─────────────────────────

function IOSDevice({ children, width = 402, height = 874 }: { children: React.ReactNode; width?: number; height?: number }) {
  const [time, setTime] = useState('9:41')
  useEffect(() => {
    const upd = () => setTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).replace(/\s?(AM|PM)/i, ''))
    upd()
    const id = setInterval(upd, 15000)
    return () => clearInterval(id)
  }, [])
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 48,
        overflow: 'hidden',
        position: 'relative',
        background: '#000',
        boxShadow: '0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.5)',
        fontFamily: "'Schibsted Grotesk', system-ui, sans-serif",
      }}
    >
      <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 154, padding: '21px 24px 0' }}>
        <span style={{ fontSize: 17, fontWeight: 590, color: '#fff', fontFamily: '-apple-system, system-ui' }}>{time}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <svg width="19" height="12" viewBox="0 0 19 12">
            <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill="#fff" />
            <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill="#fff" />
            <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill="#fff" />
            <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill="#fff" />
          </svg>
          <svg width="27" height="13" viewBox="0 0 27 13">
            <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#fff" strokeOpacity="0.35" fill="none" />
            <rect x="2" y="2" width="20" height="9" rx="2" fill="#fff" />
            <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill="#fff" fillOpacity="0.4" />
          </svg>
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60, height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 8, pointerEvents: 'none' }}>
        <div style={{ width: 139, height: 5, borderRadius: 100, background: 'rgba(255,255,255,0.7)' }} />
      </div>
    </div>
  )
}

// ───────────────────────── page ─────────────────────────

type Tab = 'home' | 'ins' | 'bud'
type Sheet = null | 'add' | 'bud' | 'start'

export default function SaveyPage() {
  const [loaded, setLoaded] = useState(false)
  const [tx, setTx] = useState<Tx[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [startBalance, setStartBalance] = useState(0)
  const [sampleOverride, setSampleOverride] = useState<boolean | null>(null)
  const [tab, setTab] = useState<Tab>('home')
  const [sheet, setSheet] = useState<Sheet>(null)
  const [range, setRange] = useState<'w' | 'm'>('w')
  const [selBar, setSelBar] = useState(-1)
  const [delArm, setDelArm] = useState<string | null>(null)
  const [draft, setDraft] = useState({ type: 'exp' as 'exp' | 'inc', cat: 'food', amtStr: '', note: '' })
  const [draftB, setDraftB] = useState({ cat: '', amtStr: '' })
  const [draftS, setDraftS] = useState({ amtStr: '' })
  const [toastMsg, setToastMsg] = useState('')
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()
  const burstTimer = useRef<ReturnType<typeof setTimeout>>()
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; bx: number; by: number; color: string; size: number; round: boolean }[]>([])
  const saveBtnRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('savey.v1')
      if (raw) {
        const p = JSON.parse(raw)
        if (p && Array.isArray(p.tx)) {
          setTx(p.tx)
          setBudgets(p.budgets || [])
          setStartBalance(p.startBalance || 0)
        }
      }
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem('savey.v1', JSON.stringify({ v: 1, tx, budgets, startBalance }))
    } catch {}
  }, [loaded, tx, budgets, startBalance])

  const sampleTx: Tx[] = useMemo(() => {
    const now = Date.now()
    return SAMPLE_SEED.map((s, i) => ({ id: 'smp' + i, type: s.t, cat: s.cat, amt: s.amt, note: s.note, ts: now - s.d * DAY, sample: true }))
  }, [])

  const sampleOn = sampleOverride !== null ? sampleOverride : true
  const usingSample = tx.length === 0 && sampleOn
  const effTx = useMemo(() => (usingSample ? sampleTx : tx).slice().sort((a, b) => b.ts - a.ts), [usingSample, sampleTx, tx])
  const effBudgets = usingSample ? SAMPLE_BUDGETS : budgets

  const now = new Date()
  const monthTx = effTx.filter((t) => {
    const d = new Date(t.ts)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const balance = startBalance + effTx.reduce((s, t) => s + (t.type === 'inc' ? t.amt : -t.amt), 0)
  const inM = monthTx.filter((t) => t.type === 'inc').reduce((s, t) => s + t.amt, 0)
  const outM = monthTx.filter((t) => t.type === 'exp').reduce((s, t) => s + t.amt, 0)
  const net = inM - outM

  function showToast(msg: string) {
    clearTimeout(toastTimer.current)
    setToastMsg(msg)
    toastTimer.current = setTimeout(() => setToastMsg(''), 2600)
  }

  function relDate(ts: number) {
    const d = new Date(ts)
    const t0 = new Date()
    t0.setHours(0, 0, 0, 0)
    const dd = Math.floor((t0.getTime() - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / DAY)
    if (dd <= 0) return 'Today'
    if (dd === 1) return 'Yesterday'
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  function burst(x: number, y: number) {
    const items = []
    for (let i = 0; i < 16; i++) {
      const ang = Math.random() * Math.PI * 2
      const dist = 40 + Math.random() * 90
      items.push({
        id: Math.random(),
        x,
        y,
        bx: Math.cos(ang) * dist,
        by: Math.sin(ang) * dist - 30,
        color: i % 3 === 0 ? BONE : ACCENT,
        size: 4 + Math.random() * 5,
        round: Math.random() > 0.5,
      })
    }
    setBursts((b) => [...b, ...items])
    clearTimeout(burstTimer.current)
    burstTimer.current = setTimeout(() => setBursts([]), 900)
  }

  function openSheet(kind: 'add' | 'bud' | 'start', presetType?: 'inc' | 'exp') {
    if (kind === 'add') setDraft({ type: presetType || 'exp', cat: presetType === 'inc' ? 'salary' : 'food', amtStr: '', note: '' })
    else if (kind === 'bud') setDraftB({ cat: (CATS.find((c) => !effBudgets.some((b) => b.cat === c.id)) || CATS[0]).id, amtStr: '' })
    else setDraftS({ amtStr: startBalance > 0 ? String(startBalance) : '' })
    setSheet(kind)
  }
  function closeSheet() {
    setSheet(null)
  }

  function keyTap(which: 'add' | 'bud' | 'start', k: string) {
    const setter = which === 'add' ? setDraft : which === 'bud' ? setDraftB : setDraftS
    const cur = which === 'add' ? draft.amtStr : which === 'bud' ? draftB.amtStr : draftS.amtStr
    let s = cur
    if (k === 'del') s = s.slice(0, -1)
    else if (k === '.') {
      if (!s.includes('.')) s = (s || '0') + '.'
    } else {
      if (s.includes('.') && s.split('.')[1].length >= 2) return
      if (s === '0') s = k
      else if (s.length < 8) s += k
    }
    // @ts-expect-error union setter
    setter((d: any) => ({ ...d, amtStr: s }))
  }

  function saveTx() {
    const amt = parseFloat(draft.amtStr)
    if (!amt || amt <= 0) return
    const wasSample = usingSample
    const newTx: Tx = { id: 't' + Date.now(), type: draft.type, cat: draft.cat, amt: Math.round(amt * 100) / 100, note: draft.note.trim(), ts: Date.now() }
    if (saveBtnRef.current && appRef.current) {
      const b = saveBtnRef.current.getBoundingClientRect()
      const a = appRef.current.getBoundingClientRect()
      burst(b.left - a.left + b.width / 2, b.top - a.top + b.height / 2)
    }
    setTx((t) => [newTx, ...t])
    setSampleOverride(false)
    if (wasSample) showToast('Sample hidden — this ledger is yours now')
    setTimeout(() => closeSheet(), 120)
    if (tab !== 'home') setTimeout(() => setTab('home'), 200)
  }

  function saveStart() {
    const amt = parseFloat(draftS.amtStr)
    if (isNaN(amt) || amt < 0) {
      closeSheet()
      return
    }
    const wasSample = usingSample
    setStartBalance(Math.round(amt * 100) / 100)
    setSampleOverride(false)
    showToast(wasSample ? 'Sample hidden — this ledger is yours now' : 'Starting balance updated')
    closeSheet()
  }

  function saveBudget() {
    const amt = parseFloat(draftB.amtStr)
    if (!amt || amt <= 0 || !draftB.cat) return
    const wasSample = usingSample
    const b: Budget = { id: 'b' + Date.now(), cat: draftB.cat, limit: Math.round(amt) }
    setBudgets((bs) => [...bs.filter((x) => x.cat !== draftB.cat), b])
    setSampleOverride(false)
    if (wasSample) showToast('Sample hidden — this ledger is yours now')
    closeSheet()
  }

  function tryDemo() {
    setSampleOverride(true)
  }

  function deleteTx(id: string) {
    setTx((t) => t.filter((x) => x.id !== id))
    setDelArm(null)
  }

  // ── recent list ──
  const recent = effTx.slice(0, 8).map((t) => {
    const c = catOf(t.cat)
    return {
      t,
      c,
      initial: c.label[0],
      title: t.note || c.label,
      sub: c.label + ' · ' + relDate(t.ts),
      amtStr: (t.type === 'inc' ? '+' : '−') + fmtT(t.amt),
      amtC: t.type === 'inc' ? SAGE : BONE,
      armed: delArm === t.id && !t.sample,
    }
  })

  // ── insights ──
  const nDays = range === 'w' ? 7 : 30
  const dayTotals = useMemo(() => {
    const out: { d: Date; sum: number }[] = []
    for (let i = nDays - 1; i >= 0; i--) {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - i)
      const end = d.getTime() + DAY
      const sum = effTx.filter((t) => t.type === 'exp' && t.ts >= d.getTime() && t.ts < end).reduce((s, t) => s + t.amt, 0)
      out.push({ d, sum })
    }
    return out
  }, [nDays, effTx])
  const maxDay = Math.max(1, ...dayTotals.map((x) => x.sum))
  const accHi = mix(ACCENT, 'w', 0.35)
  const bars = dayTotals.map((x, i) => ({
    hPct: Math.max(3, Math.round((x.sum / maxDay) * 100)) + '%',
    bg: i === selBar ? accHi : x.sum > 0 ? (i === dayTotals.length - 1 ? ACCENT : rgba(ACCENT, 0.38)) : 'rgba(242,239,230,.08)',
    lb: nDays === 7 ? x.d.toLocaleDateString('en-US', { weekday: 'narrow' }) : x.d.getDate() % 5 === 0 || i === 0 || i === nDays - 1 ? String(x.d.getDate()) : '',
    lbC: i === selBar ? BONE : 'rgba(242,239,230,.35)',
  }))
  const selInfo =
    selBar >= 0 && dayTotals[selBar]
      ? dayTotals[selBar].d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' · ' + fmtT(dayTotals[selBar].sum)
      : fmtT(dayTotals.reduce((s, x) => s + x.sum, 0)) + ' total'

  const byCat: Record<string, number> = {}
  monthTx.filter((t) => t.type === 'exp').forEach((t) => (byCat[t.cat] = (byCat[t.cat] || 0) + t.amt))
  const catList = Object.entries(byCat)
    .map(([id, v]) => ({ cat: catOf(id), v }))
    .sort((a, b) => b.v - a.v)
  const CIRC = 2 * Math.PI * 54
  const gap = catList.length > 1 ? 5 : 0
  let accCirc = 0
  const donutSegs: { c: string; dash: string; off: string }[] = []
  for (let i = 0; i < 7; i++) {
    if (i < catList.length && outM > 0) {
      const frac = catList[i].v / outM
      const len = Math.max(0, frac * CIRC - gap)
      donutSegs.push({ c: catList[i].cat.c, dash: `${len} ${CIRC - len}`, off: String(-(accCirc * CIRC)) })
      accCirc += frac
    } else donutSegs.push({ c: 'transparent', dash: `0 ${CIRC}`, off: '0' })
  }
  const legend = catList.slice(0, 5).map((x) => ({ c: x.cat.c, name: x.cat.label, pct: Math.round((x.v / outM) * 100) + '%' }))
  const daysElapsed = now.getDate()

  // ── budgets ──
  const budCards = effBudgets.map((b) => {
    const c = catOf(b.cat)
    const spent = byCat[b.cat] || 0
    const p = spent / b.limit
    const over = p > 1
    const off = 163.4 * (1 - Math.min(1, p))
    return {
      b,
      name: c.label,
      ringC: over ? CORAL : p > 0.85 ? accHi : ACCENT,
      off,
      pct: Math.round(p * 100) + '%',
      pctC: over ? CORAL : BONE,
      spentStr: fmtT(spent),
      limitStr: fmtT(b.limit),
      leftAmt: over ? fmtT(spent - b.limit) : fmtT(b.limit - spent),
      leftWord: over ? 'over' : 'left',
      leftC: over ? CORAL : SAGE,
      canDel: !usingSample,
    }
  })
  const overCount = budCards.filter((b) => b.leftWord === 'over').length
  const budLimitTotal = effBudgets.reduce((s, b) => s + b.limit, 0)
  const budSpentTotal = effBudgets.reduce((s, b) => s + (byCat[b.cat] || 0), 0)
  const budPhrase = effBudgets.length === 0 ? 'a blank slate' : overCount === 0 ? 'everything on track.' : overCount === 1 ? 'one running hot.' : overCount + ' running hot.'
  const budPhraseC = overCount > 0 ? CORAL : effBudgets.length ? SAGE : MUT
  const budTotalPct = Math.min(100, Math.round((budSpentTotal / Math.max(1, budLimitTotal)) * 100)) + '%'

  const amtNum = parseFloat(draft.amtStr) || 0
  const amtBNum = parseFloat(draftB.amtStr) || 0

  function chip(list: Cat[], selId: string, onPick: (id: string) => void) {
    return list.map((c) => {
      const active = c.id === selId
      return (
        <div
          key={c.id}
          onClick={() => onPick(c.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '8px 13px',
            borderRadius: 999,
            border: `1px solid ${active ? rgba(c.c, 0.55) : 'rgba(242,239,230,.1)'}`,
            background: active ? rgba(c.c, 0.16) : 'rgba(242,239,230,.03)',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.c }} />
          <span style={{ fontSize: 12.5, fontWeight: 600, color: active ? BONE : MUT, whiteSpace: 'nowrap' }}>{c.label}</span>
        </div>
      )
    })
  }

  function keypad(which: 'add' | 'bud' | 'start') {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del']
    return keys.map((k) => (
      <div
        key={k}
        onClick={() => keyTap(which, k)}
        style={{
          height: 48,
          borderRadius: 14,
          background: 'rgba(242,239,230,.045)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 19,
          fontWeight: 600,
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {k === 'del' ? '⌫' : k}
      </div>
    ))
  }

  const tabColor = (t: Tab) => (tab === t ? ACCENT : 'rgba(242,239,230,.45)')
  const tabBg = (t: Tab) => (tab === t ? 'rgba(242,239,230,.07)' : 'transparent')

  const balanceStr = (balance < 0 ? '−' : '') + fmt(balance)
  const netMonthStr = (net >= 0 ? '+' : '−') + fmtT(net)
  const netColor = net >= 0 ? SAGE : CORAL

  const screenBase: CSSProperties = {
    position: 'absolute',
    inset: 0,
    overflowY: 'auto',
    boxSizing: 'border-box',
    animation: 'svFadeUp .4s cubic-bezier(.16,1,.3,1) both',
  }

  return (
    <div
      data-screen-label="Savey"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 20px',
        background: 'radial-gradient(1100px 700px at 50% -12%, #1B1C24 0%, #0C0C10 58%)',
        fontFamily: "'Schibsted Grotesk', system-ui, sans-serif",
      }}
    >
      <IOSDevice>
        <div ref={appRef} id="app" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0C0D11', color: BONE }}>
          {/* ============ HOME ============ */}
          {tab === 'home' && (
            <div style={{ ...screenBase, padding: '70px 0 128px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '6px 24px 0' }}>
                <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: 22, color: BONE }}>Savey</div>
                <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(242,239,230,.45)' }}>
                  {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
              </div>

              <div style={{ position: 'relative', height: 326, marginTop: -6 }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 42% 38%, ${rgba(ACCENT, 0.15)} 0%, rgba(0,0,0,0) 62%)`,
                    filter: 'blur(18px)',
                  }}
                />
                <div style={{ position: 'absolute', left: '50%', top: '50%', margin: '-160px 0 0 -160px', width: 320, height: 320, animation: 'svOrbFloat 7s ease-in-out infinite' }}>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 44,
                      background: `radial-gradient(circle at 36% 32%, ${mix(ACCENT, 'w', 0.72)} 0%, ${ACCENT} 38%, #211505 82%)`,
                      animation: 'svBlobMorph 9s ease-in-out infinite, svScaleIn .9s cubic-bezier(.16,1,.3,1) both',
                      filter: 'saturate(1.05)',
                    }}
                  />
                </div>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <div onClick={() => openSheet('start')} style={{ pointerEvents: 'auto', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 16px', borderRadius: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(242,239,230,.55)', textShadow: '0 1px 12px rgba(12,13,17,.8)' }}>
                      Total balance
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.75, flexShrink: 0 }}>
                        <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: '-.03em', fontVariantNumeric: 'tabular-nums', marginTop: 2, textShadow: '0 2px 22px rgba(12,13,17,.85)' }}>{balanceStr}</div>
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: 'rgba(12,13,17,.55)', border: '1px solid rgba(242,239,230,.1)', backdropFilter: 'blur(6px)', pointerEvents: 'auto' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: netColor }}>{netMonthStr}</span>
                    <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: 12.5, color: 'rgba(242,239,230,.55)' }}>so far this month</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, padding: '2px 22px 0' }}>
                <div onClick={() => openSheet('add', 'inc')} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: '#16171D', border: '1px solid rgba(242,239,230,.06)', borderRadius: 18, padding: '13px 14px', cursor: 'pointer' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 10, background: 'rgba(143,191,154,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M9 7h8v8" stroke="#8FBF9A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,230,.45)' }}>In</div>
                    <div style={{ fontSize: 15.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmtT(inM)}</div>
                  </div>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="rgba(143,191,154,.6)" strokeWidth="2.1" strokeLinecap="round" /></svg>
                </div>
                <div onClick={() => openSheet('add', 'exp')} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: '#16171D', border: '1px solid rgba(242,239,230,.06)', borderRadius: 18, padding: '13px 14px', cursor: 'pointer' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 10, background: 'rgba(224,104,90,.13)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 7l10 10M17 9v8H9" stroke="#E0685A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,230,.45)' }}>Out</div>
                    <div style={{ fontSize: 15.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmtT(outM)}</div>
                  </div>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="rgba(224,104,90,.6)" strokeWidth="2.1" strokeLinecap="round" /></svg>
                </div>
              </div>

              {effBudgets.length > 0 && (
                <div onClick={() => setTab('bud')} style={{ margin: '12px 22px 0', display: 'flex', alignItems: 'center', gap: 10, background: '#16171D', border: '1px solid rgba(242,239,230,.06)', borderRadius: 18, padding: '13px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {budCards.slice(0, 4).map((b, i) => (
                      <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: b.leftWord === 'over' ? CORAL : SAGE }} />
                    ))}
                  </div>
                  <div style={{ flex: 1, fontSize: 13.5, color: 'rgba(242,239,230,.75)' }}>
                    Budgets — <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', color: budPhraseC }}>{budPhrase.replace('.', '')}</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="rgba(242,239,230,.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              )}

              {effTx.length > 0 ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '26px 24px 10px' }}>
                    <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(242,239,230,.45)' }}>Recent</div>
                    {usingSample && <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: 12.5, color: 'rgba(242,239,230,.4)' }}>sample data</div>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', padding: '0 12px' }}>
                    {recent.map((r) => (
                      <div
                        key={r.t.id}
                        onClick={() => {
                          if (r.t.sample) {
                            showToast('Sample entry — tap + to add your own')
                            return
                          }
                          setDelArm(delArm === r.t.id ? null : r.t.id)
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 16, cursor: 'pointer' }}
                      >
                        <div style={{ width: 38, height: 38, borderRadius: 13, background: rgba(r.c.c, 0.14), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: 17, color: r.c.c }}>{r.initial}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div>
                          <div style={{ fontSize: 12, color: 'rgba(242,239,230,.45)', marginTop: 1 }}>{r.sub}</div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: r.amtC }}>{r.amtStr}</div>
                        {r.armed && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteTx(r.t.id)
                            }}
                            style={{ width: 34, height: 34, borderRadius: 12, background: 'rgba(224,104,90,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 7h14M10 7V5h4v2M8 7l1 12h6l1-12" stroke="#E0685A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ padding: '34px 40px 0', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: 24, color: 'rgba(242,239,230,.85)' }}>A quiet start.</div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.5, color: 'rgba(242,239,230,.45)', marginTop: 8 }}>
                    Record your first expense and watch
                    <br />
                    the orb come alive.
                  </div>
                  <div onClick={() => openSheet('add')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 18, padding: '12px 22px', borderRadius: 999, background: ACCENT, color: '#181204', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    Add a transaction
                  </div>
                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 13, color: 'rgba(242,239,230,.45)' }}>
                    <span onClick={() => openSheet('start')} style={{ textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>set a starting balance</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span onClick={tryDemo} style={{ textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>try sample data</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============ INSIGHTS ============ */}
          {tab === 'ins' && (
            <div style={{ ...screenBase, padding: '74px 0 128px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 24px' }}>
                <div style={{ fontSize: 27, fontWeight: 800, letterSpacing: '-.02em' }}>Insights</div>
                <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: 17, color: ACCENT }}>{now.toLocaleDateString('en-US', { month: 'long' })}</div>
              </div>

              {effTx.length > 0 ? (
                <>
                  <div style={{ margin: '16px 22px 0', position: 'relative', display: 'flex', background: '#16171D', border: '1px solid rgba(242,239,230,.06)', borderRadius: 999, padding: 3 }}>
                    <div style={{ position: 'absolute', top: 3, left: range === 'm' ? '50%' : 3, width: 'calc(50% - 3px)', bottom: 3, borderRadius: 999, background: 'rgba(242,239,230,.1)', transition: 'left .35s cubic-bezier(.4,0,.2,1)' }} />
                    <div onClick={() => { setRange('w'); setSelBar(-1) }} style={{ flex: 1, position: 'relative', textAlign: 'center', padding: '8px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: range === 'w' ? BONE : MUT }}>Week</div>
                    <div onClick={() => { setRange('m'); setSelBar(-1) }} style={{ flex: 1, position: 'relative', textAlign: 'center', padding: '8px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: range === 'm' ? BONE : MUT }}>Month</div>
                  </div>

                  <div style={{ margin: '14px 22px 0', background: '#16171D', border: '1px solid rgba(242,239,230,.06)', borderRadius: 20, padding: '16px 16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(242,239,230,.45)' }}>Spending</div>
                      <div style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: selBar >= 0 ? accHi : MUT }}>{selInfo}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: nDays === 7 ? 10 : 3, height: 132, marginTop: 14 }}>
                      {bars.map((b, i) => (
                        <div key={i} onClick={() => setSelBar(selBar === i ? -1 : i)} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', cursor: 'pointer' }}>
                          <div style={{ height: b.hPct, minHeight: 3, borderRadius: 5, background: b.bg, transformOrigin: 'bottom', animation: 'svGrowY .5s cubic-bezier(.16,1,.3,1) both', transition: 'background .2s' }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: nDays === 7 ? 10 : 3, marginTop: 8 }}>
                      {bars.map((b, i) => (
                        <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9.5, letterSpacing: '.04em', color: b.lbC, overflow: 'hidden', whiteSpace: 'nowrap' }}>{b.lb}</div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, margin: '12px 22px 0' }}>
                    <div style={{ flex: 1, background: '#16171D', border: '1px solid rgba(242,239,230,.06)', borderRadius: 16, padding: '12px 6px', textAlign: 'center' }}>
                      <div style={{ fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,230,.4)' }}>Spent</div>
                      <div style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 3 }}>{fmtT(outM)}</div>
                    </div>
                    <div style={{ flex: 1, background: '#16171D', border: '1px solid rgba(242,239,230,.06)', borderRadius: 16, padding: '12px 6px', textAlign: 'center' }}>
                      <div style={{ fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,230,.4)' }}>Avg / day</div>
                      <div style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 3 }}>{fmtT(outM / Math.max(1, daysElapsed))}</div>
                    </div>
                    <div style={{ flex: 1, background: '#16171D', border: '1px solid rgba(242,239,230,.06)', borderRadius: 16, padding: '12px 6px', textAlign: 'center' }}>
                      <div style={{ fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,230,.4)' }}>Top</div>
                      <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: 15, color: ACCENT, marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{catList[0] ? catList[0].cat.label : '—'}</div>
                    </div>
                  </div>

                  <div style={{ margin: '12px 22px 0', background: '#16171D', border: '1px solid rgba(242,239,230,.06)', borderRadius: 20, padding: '18px 16px' }}>
                    <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(242,239,230,.45)' }}>Where it went</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 14 }}>
                      <div style={{ position: 'relative', width: 132, height: 132, flexShrink: 0 }}>
                        <svg width="132" height="132" viewBox="0 0 132 132" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="66" cy="66" r="54" fill="none" stroke="rgba(242,239,230,.06)" strokeWidth="12" />
                          {donutSegs.map((s, i) => (
                            <circle key={i} cx="66" cy="66" r="54" fill="none" stroke={s.c} strokeWidth="12" strokeLinecap="round" strokeDasharray={s.dash} strokeDashoffset={s.off} style={{ transition: 'stroke-dasharray .5s ease' }} />
                          ))}
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ fontSize: 15, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{fmtT(outM)}</div>
                          <div style={{ fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(242,239,230,.4)', marginTop: 1 }}>this month</div>
                        </div>
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0 }}>
                        {legend.map((l, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 3, background: l.c, flexShrink: 0 }} />
                            <div style={{ flex: 1, fontSize: 12.5, color: 'rgba(242,239,230,.75)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                            <div style={{ fontSize: 12.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{l.pct}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ padding: '80px 40px 0', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: 24, color: 'rgba(242,239,230,.85)' }}>Numbers need stories first.</div>
                  <div style={{ fontSize: 13.5, color: 'rgba(242,239,230,.45)', marginTop: 8, lineHeight: 1.5 }}>
                    Add a few transactions and your
                    <br />
                    charts will draw themselves.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============ BUDGETS ============ */}
          {tab === 'bud' && (
            <div style={{ ...screenBase, padding: '74px 0 128px' }}>
              <div style={{ padding: '0 24px' }}>
                <div style={{ fontSize: 27, fontWeight: 800, letterSpacing: '-.02em' }}>Budgets</div>
                <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: 16, color: budPhraseC, marginTop: 2 }}>{budPhrase}</div>
              </div>

              {effBudgets.length > 0 ? (
                <>
                  <div style={{ margin: '16px 22px 0', background: '#16171D', border: '1px solid rgba(242,239,230,.06)', borderRadius: 20, padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(242,239,230,.45)' }}>{now.toLocaleDateString('en-US', { month: 'long' })} total</div>
                      <div style={{ fontSize: 13.5, fontVariantNumeric: 'tabular-nums', color: 'rgba(242,239,230,.75)' }}>
                        <span style={{ fontWeight: 800, color: BONE }}>{fmtT(budSpentTotal)}</span> of {fmtT(budLimitTotal)}
                      </div>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: 'rgba(242,239,230,.07)', marginTop: 12, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: budTotalPct, borderRadius: 99, background: `linear-gradient(90deg, ${ACCENT}, ${accHi})`, transition: 'width .5s ease' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '14px 22px 0' }}>
                    {budCards.map((bc) => (
                      <div key={bc.b.id} style={{ position: 'relative', background: '#16171D', border: '1px solid rgba(242,239,230,.06)', borderRadius: 20, padding: '16px 14px 14px' }}>
                        {bc.canDel && (
                          <div
                            onClick={() => setBudgets((bs) => bs.filter((x) => x.id !== bc.b.id))}
                            style={{ position: 'absolute', top: 10, right: 10, width: 24, height: 24, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="rgba(242,239,230,.4)" strokeWidth="2.4" strokeLinecap="round" /></svg>
                          </div>
                        )}
                        <div style={{ position: 'relative', width: 64, height: 64 }}>
                          <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(242,239,230,.08)" strokeWidth="7" />
                            <circle cx="32" cy="32" r="26" fill="none" stroke={bc.ringC} strokeWidth="7" strokeLinecap="round" strokeDasharray="163.4" strokeDashoffset={bc.off} style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.16,1,.3,1)' }} />
                          </svg>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: bc.pctC }}>{bc.pct}</div>
                        </div>
                        <div style={{ fontSize: 14.5, fontWeight: 700, marginTop: 12 }}>{bc.name}</div>
                        <div style={{ fontSize: 12, color: 'rgba(242,239,230,.45)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{bc.spentStr} of {bc.limitStr}</div>
                        <div style={{ fontSize: 12.5, marginTop: 7, fontVariantNumeric: 'tabular-nums', color: bc.leftC }}>
                          <span style={{ fontWeight: 700 }}>{bc.leftAmt}</span> <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic' }}>{bc.leftWord}</span>
                        </div>
                      </div>
                    ))}
                    <div onClick={() => openSheet('bud')} style={{ border: '1.5px dashed rgba(242,239,230,.18)', borderRadius: 20, minHeight: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: rgba(ACCENT, 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" /></svg>
                      </div>
                      <div style={{ fontSize: 12.5, color: 'rgba(242,239,230,.55)' }}>New budget</div>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ padding: '70px 40px 0', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: 24, color: 'rgba(242,239,230,.85)' }}>Nothing budgeted yet.</div>
                  <div style={{ fontSize: 13.5, color: 'rgba(242,239,230,.45)', marginTop: 8, lineHeight: 1.5 }}>
                    Give a category a monthly ceiling
                    <br />
                    and Savey keeps score.
                  </div>
                  <div onClick={() => openSheet('bud')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 18, padding: '12px 22px', borderRadius: 999, background: ACCENT, color: '#181204', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    Create a budget
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============ OVERLAYS ============ */}
          <div onClick={closeSheet} style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,8,.6)', opacity: sheet ? 1 : 0, pointerEvents: sheet ? 'auto' : 'none', zIndex: 50, transition: 'opacity .25s ease' }} />

          {/* Add transaction sheet */}
          <div
            style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 60,
              background: '#15161C', border: '1px solid rgba(242,239,230,.08)', borderBottom: 'none',
              borderRadius: '28px 28px 0 0', padding: '10px 20px 30px', boxSizing: 'border-box',
              transform: `translateY(${sheet === 'add' ? '0' : '106%'})`, transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 99, background: 'rgba(242,239,230,.15)', margin: '2px auto 12px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: 20 }}>{draft.type === 'exp' ? 'New expense' : 'New income'}</div>
              <div style={{ position: 'relative', display: 'flex', background: '#0F1014', borderRadius: 999, padding: 3, border: '1px solid rgba(242,239,230,.07)' }}>
                <div onClick={() => setDraft((d) => ({ ...d, type: 'exp', cat: 'food' }))} style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', background: draft.type === 'exp' ? 'rgba(224,104,90,.18)' : 'transparent', color: draft.type === 'exp' ? '#F0A79C' : MUT }}>Expense</div>
                <div onClick={() => setDraft((d) => ({ ...d, type: 'inc', cat: 'salary' }))} style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', background: draft.type === 'inc' ? 'rgba(143,191,154,.18)' : 'transparent', color: draft.type === 'inc' ? SAGE : MUT }}>Income</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '18px 0 6px' }}>
              <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-.03em', fontVariantNumeric: 'tabular-nums', color: draft.amtStr ? BONE : 'rgba(242,239,230,.3)' }}>${draft.amtStr || '0'}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '6px 2px 10px' }}>
              {chip(draft.type === 'exp' ? CATS : INC_CATS, draft.cat, (id) => setDraft((d) => ({ ...d, cat: id })))}
            </div>
            <input
              type="text"
              placeholder="Add a note (optional)"
              value={draft.note}
              onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
              style={{ width: '100%', boxSizing: 'border-box', background: '#0F1014', border: '1px solid rgba(242,239,230,.08)', borderRadius: 14, padding: '11px 14px', color: BONE, fontSize: 13.5, fontFamily: "'Schibsted Grotesk', system-ui, sans-serif", outline: 'none' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 12 }}>{keypad('add')}</div>
            <div
              ref={saveBtnRef}
              onClick={saveTx}
              style={{ marginTop: 14, height: 52, borderRadius: 999, background: `linear-gradient(135deg, ${accHi}, ${ACCENT})`, color: '#181204', fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: amtNum > 0 ? 1 : 0.45 }}
            >
              {amtNum > 0 ? 'Save ' + (draft.type === 'exp' ? '−' : '+') + fmt(amtNum) : 'Enter an amount'}
            </div>
          </div>

          {/* New budget sheet */}
          <div
            style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 60,
              background: '#15161C', border: '1px solid rgba(242,239,230,.08)', borderBottom: 'none',
              borderRadius: '28px 28px 0 0', padding: '10px 20px 30px', boxSizing: 'border-box',
              transform: `translateY(${sheet === 'bud' ? '0' : '106%'})`, transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 99, background: 'rgba(242,239,230,.15)', margin: '2px auto 12px' }} />
            <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: 20 }}>New budget</div>
            <div style={{ fontSize: 12.5, color: 'rgba(242,239,230,.45)', marginTop: 3 }}>Monthly ceiling for a category</div>
            <div style={{ textAlign: 'center', padding: '16px 0 4px' }}>
              <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-.03em', fontVariantNumeric: 'tabular-nums', color: draftB.amtStr ? BONE : 'rgba(242,239,230,.3)' }}>${draftB.amtStr || '0'}</span>
              <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: 15, color: 'rgba(242,239,230,.4)' }}> / month</span>
            </div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '6px 2px 10px' }}>
              {chip(CATS.filter((c) => usingSample || !budgets.some((b) => b.cat === c.id)), draftB.cat, (id) => setDraftB((d) => ({ ...d, cat: id })))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 8 }}>{keypad('bud')}</div>
            <div
              onClick={saveBudget}
              style={{ marginTop: 14, height: 52, borderRadius: 999, background: `linear-gradient(135deg, ${accHi}, ${ACCENT})`, color: '#181204', fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: amtBNum > 0 && draftB.cat ? 1 : 0.45 }}
            >
              Set budget
            </div>
          </div>

          {/* Starting balance sheet */}
          <div
            style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 60,
              background: '#15161C', border: '1px solid rgba(242,239,230,.08)', borderBottom: 'none',
              borderRadius: '28px 28px 0 0', padding: '10px 20px 30px', boxSizing: 'border-box',
              transform: `translateY(${sheet === 'start' ? '0' : '106%'})`, transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 99, background: 'rgba(242,239,230,.15)', margin: '2px auto 12px' }} />
            <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: 20 }}>Starting balance</div>
            <div style={{ fontSize: 12.5, color: 'rgba(242,239,230,.45)', marginTop: 3 }}>What you had before tracking here</div>
            <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
              <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-.03em', fontVariantNumeric: 'tabular-nums', color: draftS.amtStr ? BONE : 'rgba(242,239,230,.3)' }}>${draftS.amtStr || '0'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 12 }}>{keypad('start')}</div>
            <div onClick={saveStart} style={{ marginTop: 14, height: 52, borderRadius: 999, background: `linear-gradient(135deg, ${accHi}, ${ACCENT})`, color: '#181204', fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              Set balance
            </div>
          </div>

          {/* Toast */}
          <div
            style={{
              position: 'absolute', top: 64, left: '50%', transform: `translateX(-50%) translateY(${toastMsg ? '0' : '-16px'})`, zIndex: 80,
              opacity: toastMsg ? 1 : 0, pointerEvents: 'none',
              background: 'rgba(22,23,29,.92)', border: '1px solid rgba(242,239,230,.12)', backdropFilter: 'blur(10px)',
              borderRadius: 999, padding: '9px 16px', fontSize: 12.5, color: 'rgba(242,239,230,.85)', whiteSpace: 'nowrap',
              boxShadow: '0 8px 30px rgba(0,0,0,.4)', transition: 'opacity .3s ease, transform .3s ease',
            }}
          >
            {toastMsg || ' '}
          </div>

          {/* fx burst */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 90 }}>
            {bursts.map((p) => (
              <div
                key={p.id}
                style={{
                  position: 'absolute', left: p.x, top: p.y, width: p.size, height: p.size,
                  borderRadius: p.round ? '50%' : 2, background: p.color,
                  // @ts-expect-error custom props
                  '--bx': `${p.bx}px`, '--by': `${p.by}px`,
                  animation: 'svBurst .8s ease-out forwards',
                }}
              />
            ))}
          </div>

          {/* ============ TAB BAR ============ */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 22, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(20,21,27,.72)', border: '1px solid rgba(242,239,230,.09)', borderRadius: 999, padding: 5, backdropFilter: 'blur(18px) saturate(160%)', boxShadow: '0 12px 34px rgba(0,0,0,.45)' }}>
              <div onClick={() => setTab('home')} style={{ width: 66, height: 52, borderRadius: 999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, cursor: 'pointer', color: tabColor('home'), background: tabBg('home') }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none"><path d="M4 11.2 12 4.8l8 6.4V20a1 1 0 0 1-1 1h-4.6v-5.6H9.6V21H5a1 1 0 0 1-1-1z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" /></svg>
                <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.04em' }}>Home</span>
              </div>
              <div onClick={() => setTab('ins')} style={{ width: 66, height: 52, borderRadius: 999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, cursor: 'pointer', color: tabColor('ins'), background: tabBg('ins') }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none"><path d="M5 20v-7M12 20V5.5M19 20v-10" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>
                <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.04em' }}>Insights</span>
              </div>
              <div onClick={() => setTab('bud')} style={{ width: 66, height: 52, borderRadius: 999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, cursor: 'pointer', color: tabColor('bud'), background: tabBg('bud') }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.9" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.9" /></svg>
                <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.04em' }}>Budgets</span>
              </div>
            </div>
            <div
              onClick={() => openSheet('add')}
              style={{
                width: 58, height: 58, borderRadius: '50%', background: `linear-gradient(135deg, ${accHi}, ${ACCENT})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                boxShadow: `0 10px 30px ${rgba(ACCENT, 0.35)}, 0 3px 10px rgba(0,0,0,.4)`,
                transform: sheet ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform .4s ease',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#181204" strokeWidth="2.4" strokeLinecap="round" /></svg>
            </div>
          </div>
        </div>
      </IOSDevice>
    </div>
  )
}
