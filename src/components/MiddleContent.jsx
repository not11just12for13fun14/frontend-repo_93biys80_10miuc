import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'
import LaserEngraveOverlay from './LaserEngraveOverlay'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function MiddleContent({ view, onLaser, onCategorySelect }) {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [portfolio, setPortfolio] = useState([])

  useEffect(() => {
    onLaser()
    if (view === 'categories') {
      fetch(`${API}/categories`).then(r => r.json()).then(d => setCategories(d.items || [])).catch(() => setCategories([]))
    }
    if (view === 'products') {
      fetch(`${API}/products`).then(r => r.json()).then(d => setProducts(d.items || [])).catch(() => setProducts([]))
    }
    if (view === 'portfolio') {
      fetch(`${API}/portfolio`).then(r => r.json()).then(d => setPortfolio(d.items || [])).catch(() => setPortfolio([]))
    }
  }, [view])

  return (
    <section className="relative flex-1 h-full">
      <div className="absolute inset-0">
        {view === 'home' && (
          <div className="w-full h-full">
            <Spline scene="https://prod.spline.design/FduaNp3csZktbOi3/scene.splinecode" style={{ width: '100%', height: '100%' }} />
          </div>
        )}
        {view === 'categories' && (
          <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c, idx) => (
              <motion.button key={idx} onClick={() => onCategorySelect(c.slug)}
                className="group border border-white/10 rounded-xl p-4 text-left hover:bg-white/5 transition"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-white/70 text-xs">Category</div>
                <div className="text-white text-xl tracking-wide">{c.title || c.slug}</div>
                {c.description && <div className="text-white/60 text-sm mt-2">{c.description}</div>}
              </motion.button>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full text-white/60">No categories yet. Add some via backend.</div>
            )}
          </div>
        )}
        {view === 'products' && (
          <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p, idx) => (
              <motion.div key={idx} className="border border-white/10 rounded-xl p-4 hover:bg-white/5 transition"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-40 object-cover rounded-lg mb-3" />}
                <div className="text-white text-lg">{p.title}</div>
                <div className="text-white/60 text-sm line-clamp-2">{p.description}</div>
                <div className="text-cyan-300 mt-2">${p.price?.toFixed ? p.price.toFixed(2) : p.price}</div>
              </motion.div>
            ))}
            {products.length === 0 && (
              <div className="col-span-full text-white/60">No products yet. Insert via database.</div>
            )}
          </div>
        )}
        {view === 'portfolio' && (
          <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.map((it, idx) => (
              <motion.div key={idx} className="border border-white/10 rounded-xl overflow-hidden hover:bg-white/5 transition"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {it.image_url && <img src={it.image_url} alt={it.title} className="w-full h-48 object-cover" />}
                <div className="p-4">
                  <div className="text-white text-lg">{it.title}</div>
                  {it.client && <div className="text-white/60 text-xs">{it.client}</div>}
                  {it.description && <div className="text-white/60 text-sm mt-1">{it.description}</div>}
                </div>
              </motion.div>
            ))}
            {portfolio.length === 0 && (
              <div className="col-span-full text-white/60">No portfolio entries yet.</div>
            )}
          </div>
        )}
      </div>
      <LaserEngraveOverlay trigger={view} />
    </section>
  )
}
