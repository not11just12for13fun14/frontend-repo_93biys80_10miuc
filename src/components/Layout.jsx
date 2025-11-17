import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, User, Folder, Grid3X3, LogIn, Send, Phone, Mail, ChevronRight } from 'lucide-react'
import Spline from '@splinetool/react-spline'

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function LaserSweep({ triggerKey }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={triggerKey}
        initial={{ x: '-120%', opacity: 0.0 }}
        animate={{ x: '120%', opacity: [0.15, 0.25, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="pointer-events-none fixed inset-y-0 left-0 w-[30vw] bg-gradient-to-r from-cyan-400/20 via-white/10 to-transparent blur-2xl"
      />
    </AnimatePresence>
  )
}

export default function Layout() {
  const [view, setView] = useState('products')
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [portfolio, setPortfolio] = useState([])
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [sweepKey, setSweepKey] = useState(0)

  useEffect(() => {
    fetch(`${backend}/categories`).then(r => r.json()).then(setCategories)
    fetch(`${backend}/products`).then(r => r.json()).then(setProducts)
    fetch(`${backend}/portfolio`).then(r => r.json()).then(setPortfolio)
  }, [])

  useEffect(() => {
    setSweepKey(prev => prev + 1)
  }, [view, activeCategory, cart.length])

  const filteredProducts = useMemo(() => {
    return activeCategory ? products.filter(p => p.category === activeCategory) : products
  }, [products, activeCategory])

  const total = useMemo(() => {
    return cart.reduce((sum, it) => {
      const p = products.find(pr => pr.id === it.product_id)
      return sum + (p ? p.price * it.qty : 0)
    }, 0)
  }, [cart, products])

  const addToCart = (product) => {
    setCart((c) => {
      const existing = c.find(i => i.product_id === product.id)
      if (existing) return c.map(i => i.product_id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...c, { product_id: product.id, qty: 1 }]
    })
  }

  const removeFromCart = (id) => setCart(c => c.filter(i => i.product_id !== id))

  const login = async () => {
    if (!email) return
    const res = await fetch(`${backend}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    setUser(data)
    setEmail('')
  }

  const checkout = async () => {
    if (!user) { setView('account'); return }
    if (cart.length === 0) return
    const res = await fetch(`${backend}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: user.email, items: cart, notes: '', contact_phone: '' })
    })
    const data = await res.json()
    if (data && data.id) {
      setCart([])
      alert('Order placed. We will contact you shortly!')
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-zinc-100">
      <LaserSweep triggerKey={sweepKey} />
      <div className="grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)_340px] min-h-screen">
        {/* Left: Navigation */}
        <aside className="border-r border-white/10 px-5 py-6 md:py-10 space-y-8 sticky top-0 h-screen bg-black/20 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-sm bg-white/10" />
            <div>
              <p className="text-sm uppercase tracking-[.25em] text-white/60">Laser Studio</p>
              <p className="text-xs text-white/40">Engraving Boutique</p>
            </div>
          </div>

          <nav className="space-y-2 text-sm">
            <button onClick={() => setView('products')} className={`group w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 ${view==='products'?'bg-white/5':''}`}>
              <Grid3X3 className="size-4 text-white/70" />
              <span className="text-white/80">Products</span>
              <ChevronRight className="ml-auto size-4 opacity-0 group-hover:opacity-100" />
            </button>
            <button onClick={() => setView('portfolio')} className={`group w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 ${view==='portfolio'?'bg-white/5':''}`}>
              <Folder className="size-4 text-white/70" />
              <span className="text-white/80">Portfolio</span>
              <ChevronRight className="ml-auto size-4 opacity-0 group-hover:opacity-100" />
            </button>
            <button onClick={() => setView('account')} className={`group w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 ${view==='account'?'bg-white/5':''}`}>
              <User className="size-4 text-white/70" />
              <span className="text-white/80">Account</span>
              <ChevronRight className="ml-auto size-4 opacity-0 group-hover:opacity-100" />
            </button>
          </nav>

          <div className="pt-6 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3">Categories</p>
            <div className="space-y-1">
              <button onClick={() => setActiveCategory('')} className={`text-left w-full px-3 py-1.5 rounded hover:bg-white/5 ${activeCategory===''?'bg-white/5':''}`}>All</button>
              {categories.map(c => (
                <button key={c.id} onClick={() => setActiveCategory(c.slug)} className={`text-left w-full px-3 py-1.5 rounded hover:bg-white/5 ${activeCategory===c.slug?'bg-white/5':''}`}>{c.name}</button>
              ))}
            </div>
          </div>

          <div className="hidden md:block pt-8">
            <p className="text-xs text-white/40">Need something custom? Send us your idea.</p>
            <a href="#contact" onClick={() => setView('contact')} className="mt-3 inline-flex items-center gap-2 text-cyan-300">
              <Send className="size-4" /> Start a brief
            </a>
          </div>
        </aside>

        {/* Middle: Content */}
        <main className="relative">
          {/* Hero with Spline */}
          <section className="absolute inset-0 -z-10">
            <div className="h-72 md:h-96 w-full">
              <Spline scene="https://prod.spline.design/FduaNp3csZktbOi3/scene.splinecode" />
            </div>
            <div className="from-black/40 to-transparent bg-gradient-to-b absolute inset-0" />
          </section>

          <div className="px-6 md:px-10 pt-8 md:pt-10 pb-24">
            <h1 className="text-2xl md:text-4xl font-light tracking-wide text-white/90">Precision Laser Engraving</h1>
            <p className="text-white/50 mt-2 max-w-2xl">Minimal, luxurious finishes on wood, metal and acrylic. Bespoke branding, gifts and prototypes with micron-level detail.</p>

            {view === 'products' && (
              <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(p => (
                  <motion.div key={p.id} whileHover={{ y: -2 }} className="group rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src={p.image_url} alt={p.title} className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white/90 font-medium">{p.title}</h3>
                      <p className="text-white/50 text-sm line-clamp-2 mt-1">{p.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-cyan-300">${p.price.toFixed(2)}</span>
                        <button onClick={() => addToCart(p)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-cyan-300/30 text-cyan-200 hover:bg-cyan-300/10">
                          <ShoppingCart className="size-4" /> Add
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {view === 'portfolio' && (
              <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map(w => (
                  <motion.div key={w.id} whileHover={{ y: -2 }} className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src={w.image_url} alt={w.title} className="object-cover w-full h-full opacity-90" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white/90 font-medium">{w.title}</h3>
                      <p className="text-white/50 text-sm">{w.description}</p>
                      {w.client_name && <p className="text-[11px] uppercase tracking-widest text-white/40 mt-2">{w.client_name}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {view === 'account' && (
              <div className="mt-10 max-w-md">
                {user ? (
                  <div className="space-y-2">
                    <p className="text-white/80">Signed in as</p>
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-white/10" />
                      <div>
                        <p className="text-white/90">{user.name || user.email}</p>
                        <p className="text-white/50 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-white/50">Email</label>
                      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@studio.com" className="mt-1 w-full bg-white/[0.06] border border-white/10 rounded px-3 py-2 outline-none focus:border-cyan-300/40" />
                    </div>
                    <button onClick={login} className="inline-flex items-center gap-2 px-4 py-2 rounded border border-white/10 hover:border-cyan-300/40">
                      <LogIn className="size-4" /> Continue
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Right: Contextual panel */}
        <aside className="border-l border-white/10 px-5 py-6 md:py-10 space-y-6 sticky top-0 h-screen bg-black/20 backdrop-blur">
          {view === 'products' && (
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[.25em] text-white/60">Cart</p>
                <span className="text-white/50 text-sm">{cart.reduce((a,b)=>a+b.qty,0)} items</span>
              </div>
              <div className="mt-4 space-y-3 max-h-[50vh] overflow-auto pr-2">
                {cart.length===0 && <p className="text-white/40 text-sm">Your cart is empty.</p>}
                {cart.map(it => {
                  const p = products.find(pr => pr.id === it.product_id)
                  if (!p) return null
                  return (
                    <div key={it.product_id} className="flex items-center gap-3">
                      <img src={p.image_url} className="size-12 rounded object-cover" />
                      <div className="flex-1">
                        <p className="text-white/80 text-sm">{p.title}</p>
                        <p className="text-white/40 text-xs">Qty {it.qty}</p>
                      </div>
                      <button onClick={()=>removeFromCart(it.product_id)} className="text-white/40 hover:text-white/70">Remove</button>
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between text-white/70">
                  <span>Total</span>
                  <span className="text-cyan-300">${total.toFixed(2)}</span>
                </div>
                <button onClick={checkout} className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-cyan-400/10 text-cyan-200 border border-cyan-300/30 hover:bg-cyan-300/15">
                  <ShoppingCart className="size-4" /> Checkout
                </button>
              </div>
            </div>
          )}

          {view === 'portfolio' && (
            <div>
              <p className="text-sm uppercase tracking-[.25em] text-white/60">Contact</p>
              <div className="mt-4 space-y-2 text-white/70">
                <p className="inline-flex items-center gap-2"><Phone className="size-4" /> +1 (555) 012-8899</p>
                <p className="inline-flex items-center gap-2"><Mail className="size-4" /> studio@laser.cx</p>
              </div>
              <button onClick={()=>setView('account')} className="mt-5 inline-flex items-center gap-2 text-cyan-300">
                <User className="size-4" /> Sign in to request a quote
              </button>
            </div>
          )}

          {view === 'account' && (
            <div>
              <p className="text-sm uppercase tracking-[.25em] text-white/60">Your Account</p>
              <div className="mt-4 text-white/70 space-y-2">
                {user ? (
                  <>
                    <p>Welcome back, {user.name || user.email}.</p>
                    <button onClick={()=>setUser(null)} className="text-white/50 hover:text-white/80 text-sm">Sign out</button>
                  </>
                ) : (
                  <p className="text-white/50 text-sm">Sign in to save designs and track orders.</p>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
