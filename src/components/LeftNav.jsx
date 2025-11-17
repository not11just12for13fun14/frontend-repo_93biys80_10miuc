import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, Home, Layers, Image, ShoppingBag, User, LogIn } from 'lucide-react'

export default function LeftNav({ current, onSelect, user, onAuthClick }) {
  useEffect(() => {}, [current])

  const Item = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => onSelect(id)}
      className={`group w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        current === id ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm tracking-wide">{label}</span>
    </button>
  )

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-full border-r border-white/10 p-4 gap-2">
      <div className="flex items-center justify-between mb-2 text-white/80">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest">Navigate</span>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <Item id="home" icon={Home} label="Home" />
        <Item id="categories" icon={Layers} label="Categories" />
        <Item id="products" icon={ShoppingBag} label="Products" />
        <Item id="portfolio" icon={Image} label="Portfolio" />
      </motion.div>
      <div className="mt-auto pt-4 border-t border-white/10">
        <button
          onClick={onAuthClick}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-white/5"
        >
          <User className="w-5 h-5" />
          <span className="text-sm">{user ? user.name : 'Account'}</span>
        </button>
      </div>
    </aside>
  )
}
