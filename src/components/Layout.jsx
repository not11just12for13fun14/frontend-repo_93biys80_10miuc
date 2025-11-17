import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, User, Folder, Grid3X3, LogIn, Send, Phone, Mail, Users, Home, Images, UserCircle } from 'lucide-react'
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
  const [activePortfolioCategory, setActivePortfolioCategory] = useState('')
  const [sweepKey, setSweepKey] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    fetch(`${backend}/categories`).then(r => r.json()).then(setCategories).catch(()=>{})
    fetch(`${backend}/products`).then(r => r.json()).then(setProducts).catch(()=>{})
    fetch(`${backend}/portfolio`).then(r => r.json()).then(setPortfolio).catch(()=>{})
  }, [])

  useEffect(() => {
    setSweepKey(prev => prev + 1)
  }, [view, activeCategory, activePortfolioCategory, cart.length])

  // Demo fallbacks so layout looks complete even without backend data
  const demoProducts = [
    { id: 'demo-1', title: 'Engraved Wood Plaque', description: 'American walnut, satin finish, deep laser pass for crisp typography.', price: 89, category: 'wood', image_url: 'https://images.unsplash.com/photo-1568051243858-6a2e5e3f80a3?q=80&w=1200&auto=format&fit=crop' },
    { id: 'demo-2', title: 'Brushed Steel Card', description: 'Ultra-thin stainless card, micro-etched logo with pearlescent shimmer.', price: 49, category: 'metal', image_url: 'https://images.unsplash.com/photo-1536412597336-ade7f1b53f77?q=80&w=1200&auto=format&fit=crop' },
    { id: 'demo-3', title: 'Acrylic Desk Sign', description: 'Smoked acrylic with frost-engraved lettering and subtle underglow.', price: 129, category: 'acrylic', image_url: 'https://images.unsplash.com/photo-1523419409543-a9de4f3a3ab3?q=80&w=1200&auto=format&fit=crop' },
    { id: 'demo-4', title: 'Leather Wallet Monogram', description: 'Vegetable-tanned leather with burnished monogram.', price: 59, category: 'leather', image_url: 'https://images.unsplash.com/photo-1516383607781-913a19294fd1?q=80&w=1200&auto=format&fit=crop' },
  ]

  const demoPortfolio = [
    { id: 'pf-1', title: 'Boutique Hotel Keys', description: 'Black anodized tags with laser white mark.', category: 'hospitality', client_name: 'Nocturne Hotel', image_url: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=1200&auto=format&fit=crop' },
    { id: 'pf-2', title: 'Whiskey Brand Coasters', description: 'Charred oak coasters, brass inlay engraved seats.', category: 'branding', client_name: 'Eclipse Distillers', image_url: 'https://images.unsplash.com/photo-1601034913836-a6d09e22b725?q=80&w=1200&auto=format&fit=crop' },
    { id: 'pf-3', title: 'Tech Conference Badges', description: 'Matte acrylic with QR and anti-glare coating.', category: 'events', client_name: 'Vector Summit', image_url: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop' },
  ]

  const displayProductsAll = (products && products.length ? products : demoProducts)
  const productCategories = useMemo(() => {
    const fromBackend = categories.map(c => ({ key: c.slug || c.id || c.name?.toLowerCase?.(), label: c.name }))
    const demo = [
      { key: 'all', label: 'All' },
      { key: 'wood', label: 'Wood' },
      { key: 'metal', label: 'Metal' },
      { key: 'acrylic', label: 'Acrylic' },
      { key: 'leather', label: 'Leather' },
    ]
    // Merge unique keys while keeping labels
    const map = new Map()
    demo.forEach(d => map.set(d.key, d.label))
    fromBackend.forEach(b => { if (b.key) map.set(b.key, b.label || String(b.key)) })
    return Array.from(map.entries()).map(([key,label])=>({key,label}))
  }, [categories])

  const filteredProducts = useMemo(() => {
    if (!activeCategory || activeCategory === 'all') return displayProductsAll
    return displayProductsAll.filter(p => (p.category === activeCategory) || (p.category === categories.find(c=>c.slug===activeCategory)?.slug))
  }, [displayProductsAll, activeCategory, categories])

  const displayPortfolioAll = (portfolio && portfolio.length ? portfolio : demoPortfolio)
  const portfolioCategories = useMemo(() => {
    const found = new Set(displayPortfolioAll.map(p => p.category).filter(Boolean))
    const base = ['all', ...Array.from(found), 'branding', 'hospitality', 'events']
    return Array.from(new Set(base)).map(k => ({ key: k, label: k.charAt(0).toUpperCase()+k.slice(1) }))
  }, [displayPortfolioAll])

  const filteredPortfolio = useMemo(() => {
    if (!activePortfolioCategory || activePortfolioCategory === 'all') return displayPortfolioAll
    return displayPortfolioAll.filter(p => p.category === activePortfolioCategory)
  }, [displayPortfolioAll, activePortfolioCategory])

  const total = useMemo(() => {
    return cart.reduce((sum, it) => {
      const p = displayProductsAll.find(pr => pr.id === it.product_id)
      return sum + (p ? (p.price || 0) * it.qty : 0)
    }, 0)
  }, [cart, displayProductsAll])

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

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-black/40 backdrop-blur">
        <div className="grid grid-cols-4">
          <button onClick={()=>setView('products')} className={`flex flex-col items-center justify-center py-3 ${view==='products'?'text-cyan-300':'text-white/70'}`}>
            <Home className="size-5" />
            <span className="text-[11px]">Products</span>
          </button>
          <button onClick={()=>setView('portfolio')} className={`flex flex-col items-center justify-center py-3 ${view==='portfolio'?'text-cyan-300':'text-white/70'}`}>
            <Images className="size-5" />
            <span className="text-[11px]">Portfolio</span>
          </button>
          <button onClick={()=>setView('clients')} className={`flex flex-col items-center justify-center py-3 ${view==='clients'?'text-cyan-300':'text-white/70'}`}>
            <Users className="size-5" />
            <span className="text-[11px]">Clients</span>
          </button>
          <button onClick={()=>setView('account')} className={`flex flex-col items-center justify-center py-3 ${view==='account'?'text-cyan-300':'text-white/70'}`}>
            <UserCircle className="size-5" />
            <span className="text-[11px]">Account</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)_360px] min-h-screen pb-16 md:pb-0">
        {/* Left: Navigation as full-height block tiles (hidden on mobile) */}
        <aside className="hidden md:flex md:flex-col border-r border-white/10 px-4 md:px-5 py-6 md:py-8 space-y-6 sticky top-0 h-screen bg-black/20 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-sm bg-white/10" />
            <div>
              <p className="text-sm uppercase tracking-[.25em] text-white/60">Laser Studio</p>
              <p className="text-xs text-white/40">Engraving Boutique</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-h-0 flex-1">
            <div className="grid grid-rows-3 gap-3 flex-1">
              <button onClick={() => setView('products')} className={`group w-full rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition flex items-center justify-between px-4 ${view==='products'?'ring-1 ring-cyan-300/30':''}`}>
                <div className="flex items-center gap-3 py-6">
                  <Grid3X3 className="size-4 text-white/70" />
                  <div className="text-left">
                    <div className="text-white/80">Products</div>
                    <div className="text-xs text-white/40">Browse, add to cart</div>
                  </div>
                </div>
              </button>
              <button onClick={() => setView('portfolio')} className={`group w-full rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition flex items-center justify-between px-4 ${view==='portfolio'?'ring-1 ring-cyan-300/30':''}`}>
                <div className="flex items-center gap-3 py-6">
                  <Folder className="size-4 text-white/70" />
                  <div className="text-left">
                    <div className="text-white/80">Portfolio</div>
                    <div className="text-xs text-white/40">Selected works</div>
                  </div>
                </div>
              </button>
              <button onClick={() => setView('clients')} className={`group w-full rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition flex items-center justify-between px-4 ${view==='clients'?'ring-1 ring-cyan-300/30':''}`}>
                <div className="flex items-center gap-3 py-6">
                  <Users className="size-4 text-white/70" />
                  <div className="text-left">
                    <div className="text-white/80">Clients</div>
                    <div className="text-xs text-white/40">Logos & testimonials</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Categories</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setActiveCategory('all')} className={`text-left w-full px-3 py-3 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] ${(!activeCategory || activeCategory==='all')?'ring-1 ring-cyan-300/30':''}`}>All</button>
              {productCategories.filter(c=>c.key!=='all').slice(0,5).map(c => (
                <button key={c.key} onClick={() => setActiveCategory(c.key)} className={`text-left w-full px-3 py-3 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] ${activeCategory===c.key?'ring-1 ring-cyan-300/30':''}`}>{c.label}</button>
              ))}
            </div>
          </div>

          <div className="hidden md:block pt-2">
            <button onClick={() => setView('account')} className="mt-1 inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-cyan-300">
              <Send className="size-4" /> Start a brief
            </button>
          </div>
        </aside>

        {/* Middle: Content */}
        <main className="relative">
          {/* Hero with Spline */}
          <section className="absolute inset-0 -z-10">
            <div className="h-64 md:h-96 w-full">
              <Spline scene="https://prod.spline.design/FduaNp3csZktbOi3/scene.splinecode" />
            </div>
            <div className="from-black/50 to-transparent bg-gradient-to-b absolute inset-0" />
          </section>

          <div className="px-5 md:px-10 pt-6 md:pt-10 pb-28 md:pb-24">
            <h1 className="text-2xl md:text-4xl font-light tracking-wide text-white/90">Precision Laser Engraving</h1>
            <p className="text-white/50 mt-2 max-w-2xl">Minimal, luxurious finishes on wood, metal and acrylic. Bespoke branding, gifts and prototypes with micron-level detail.</p>

            {/* Category chips for products / portfolio with animated transitions */}
            {view === 'products' && (
              <motion.div layout className="mt-6 flex flex-wrap gap-2">
                {productCategories.map(c => (
                  <motion.button
                    key={c.key}
                    layout
                    onClick={() => setActiveCategory(c.key)}
                    className={`px-3 py-1.5 rounded-full border text-xs transition ${(!activeCategory && c.key==='all') || activeCategory===c.key ? 'border-cyan-300/40 text-cyan-200 bg-cyan-300/10' : 'border-white/15 text-white/70 bg-white/[0.02]'}`}
                  >
                    {c.label}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {view === 'portfolio' && (
              <motion.div layout className="mt-6 flex flex-wrap gap-2">
                {portfolioCategories.map(c => (
                  <motion.button
                    key={c.key}
                    layout
                    onClick={() => setActivePortfolioCategory(c.key)}
                    className={`px-3 py-1.5 rounded-full border text-xs transition ${(activePortfolioCategory===c.key) || (!activePortfolioCategory && c.key==='all') ? 'border-cyan-300/40 text-cyan-200 bg-cyan-300/10' : 'border-white/15 text-white/70 bg-white/[0.02]'}`}
                  >
                    {c.label}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Products: image-only tiles with hover animation and full-block detail on click */}
            <AnimatePresence mode="popLayout">
              {view === 'products' && (
                <motion.div key="products" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} transition={{duration:0.25}} className="mt-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map(p => (
                    <motion.button
                      key={p.id}
                      whileHover={{ y: -2 }}
                      onClick={() => setSelectedProduct(p)}
                      className="group relative rounded-lg overflow-hidden border border-white/10 bg-white/[0.02] aspect-[4/5] text-left"
                    >
                      <img src={p.image_url} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <motion.div initial={{opacity:0, y:8}} whileHover={{opacity:1, y:0}} className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="text-white/90 text-sm">{p.title}</div>
                      </motion.div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Portfolio grid with animated transition */}
            <AnimatePresence mode="popLayout">
              {view === 'portfolio' && (
                <motion.div key="portfolio" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} transition={{duration:0.25}} className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPortfolio.map(w => (
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
                </motion.div>
              )}
            </AnimatePresence>

            {view === 'clients' && (
              <div className="mt-10 space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {["Nocturne","Eclipse","Vector","Ascent","Zenith","Nebula","Halo","Mono"].map((name,i)=> (
                    <div key={i} className="rounded-md border border-white/10 bg-white/[0.02] px-4 py-8 flex items-center justify-center text-white/60 text-sm tracking-widest uppercase">
                      {name}
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-white/10" />
                        <div>
                          <p className="text-white/80">Client {i}</p>
                          <p className="text-white/40 text-xs">Brand Project</p>
                        </div>
                      </div>
                      <p className="text-white/60 text-sm mt-3">“Exquisite finish and attention to detail. The laser white mark on matte black is unreal.”</p>
                    </div>
                  ))}
                </div>
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
                    <button onClick={login} className="inline-flex items-center gap-2 px-4 py-3 rounded-md border border-white/10 hover:border-cyan-300/40 bg-white/[0.03]">
                      <LogIn className="size-4" /> Continue
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Product Detail Modal */}
          <AnimatePresence>
            {selectedProduct && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-40 flex items-end md:items-center justify-center bg-black/60">
                <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} exit={{y:20, opacity:0}} transition={{type:'spring', damping:22, stiffness:260}} className="w-full md:w-[800px] max-w-[95vw] md:rounded-xl md:overflow-hidden bg-[#0b0f14] border border-white/10">
                  <div className="grid md:grid-cols-2">
                    <div className="relative h-72 md:h-full">
                      <img src={selectedProduct.image_url} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="p-5 md:p-6">
                      <h3 className="text-white/90 text-xl">{selectedProduct.title}</h3>
                      <p className="text-white/50 mt-2 text-sm">{selectedProduct.description}</p>
                      <div className="flex items-center justify-between mt-5">
                        <span className="text-cyan-300">${(selectedProduct.price || 0).toFixed(2)}</span>
                        <div className="flex gap-2">
                          <button onClick={()=>{addToCart(selectedProduct);}} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-cyan-300/30 text-cyan-200 hover:bg-cyan-300/10">
                            <ShoppingCart className="size-4" /> Add to Cart
                          </button>
                          <button onClick={()=>setSelectedProduct(null)} className="px-4 py-2 rounded-md border border-white/10 hover:bg-white/5">Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Right: Contextual panel with blocky cards */}
        <aside className="hidden md:block border-l border-white/10 px-4 md:px-5 py-6 md:py-8 space-y-6 sticky top-0 h-screen bg-black/20 backdrop-blur">
          {view === 'products' && (
            <div className="flex flex-col gap-4 h-full">
              <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[.25em] text-white/60">Cart</p>
                  <span className="text-white/50 text-sm">{cart.reduce((a,b)=>a+b.qty,0)} items</span>
                </div>
                <div className="mt-4 space-y-3 max-h-[42vh] overflow-auto pr-1">
                  {cart.length===0 && <p className="text-white/40 text-sm">Your cart is empty.</p>}
                  {cart.map(it => {
                    const p = displayProductsAll.find(pr => pr.id === it.product_id)
                    if (!p) return null
                    return (
                      <div key={it.product_id} className="flex items-center gap-3 rounded border border-white/10 bg-white/[0.02] p-2">
                        <img src={p.image_url} className="size-12 rounded object-cover" />
                        <div className="flex-1">
                          <p className="text-white/80 text-sm">{p.title}</p>
                          <p className="text-white/40 text-xs">Qty {it.qty}</p>
                        </div>
                        <button onClick={()=>removeFromCart(it.product_id)} className="text-white/50 hover:text-white/80 text-xs">Remove</button>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-auto rounded-md border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between text-white/70">
                  <span>Total</span>
                  <span className="text-cyan-300">${total.toFixed(2)}</span>
                </div>
                <button onClick={checkout} className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-cyan-400/10 text-cyan-200 border border-cyan-300/30 hover:bg-cyan-300/15">
                  <ShoppingCart className="size-4" /> Checkout
                </button>
              </div>
            </div>
          )}

          {view === 'portfolio' && (
            <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm uppercase tracking-[.25em] text-white/60">Contact</p>
              <div className="mt-4 space-y-2 text-white/70">
                <p className="inline-flex items-center gap-2"><Phone className="size-4" /> +1 (555) 012-8899</p>
                <p className="inline-flex items-center gap-2"><Mail className="size-4" /> studio@laser.cx</p>
              </div>
              <button onClick={()=>setView('account')} className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-cyan-300">
                <User className="size-4" /> Sign in to request a quote
              </button>
            </div>
          )}

          {view === 'clients' && (
            <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm uppercase tracking-[.25em] text-white/60">Work With Us</p>
              <p className="text-white/60 text-sm mt-2">We craft premium engravings for brands and studios worldwide.</p>
              <button onClick={()=>setView('account')} className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06]">
                <Send className="size-4" /> Start a brief
              </button>
            </div>
          )}

          {view === 'account' && (
            <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
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
