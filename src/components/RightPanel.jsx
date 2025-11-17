import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function RightPanel({ view, selectedCategory, user, onAuthSubmit }) {
  const [cart, setCart] = useState([])
  const [contact, setContact] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)

  useEffect(() => {
    setStatus(null)
  }, [view])

  const submitContact = async () => {
    try {
      setStatus('Sending...')
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      })
      const data = await res.json()
      if (res.ok) setStatus('We got your message. Thank you!')
      else setStatus(data.detail || 'Failed to send')
    } catch (e) {
      setStatus('Network error')
    }
  }

  const Checkout = () => (
    <div className="space-y-3">
      <div className="text-white/80 text-sm">Checkout</div>
      <div className="border border-white/10 rounded-lg p-3 text-white/70">
        Cart is empty. Add items from the center panel.
      </div>
      <button className="w-full py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition">Proceed</button>
    </div>
  )

  const Contact = () => (
    <div className="space-y-3">
      <div className="text-white/80 text-sm">Contact us</div>
      <input className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white placeholder-white/40"
        placeholder="Your name" value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} />
      <input className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white placeholder-white/40"
        placeholder="Email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
      <textarea className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white placeholder-white/40" rows={4}
        placeholder="Tell us about your project" value={contact.message} onChange={e => setContact({ ...contact, message: e.target.value })} />
      <button onClick={submitContact} className="w-full py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition">Send</button>
      {status && <div className="text-white/70 text-sm">{status}</div>}
    </div>
  )

  const Auth = () => {
    const [mode, setMode] = useState('login')
    const [form, setForm] = useState({ name: '', email: '', password: '' })

    const submit = async () => {
      const url = mode === 'signup' ? `${API}/auth/signup` : `${API}/auth/login`
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (res.ok) {
        onAuthSubmit(mode, data)
      } else {
        alert(data.detail || 'Authentication failed')
      }
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-white/80 text-sm">
          <span>{mode === 'signup' ? 'Create account' : 'Sign in'}</span>
          <button className="text-cyan-300" onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>
            {mode === 'signup' ? 'Have an account?' : 'Create account'}
          </button>
        </div>
        {mode === 'signup' && (
          <input className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white placeholder-white/40"
            placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        )}
        <input className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white placeholder-white/40"
          placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white placeholder-white/40" type="password"
          placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button onClick={submit} className="w-full py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition">
          {mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </div>
    )
  }

  return (
    <aside className="hidden md:flex flex-col w-80 shrink-0 h-full border-l border-white/10 p-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {view === 'products' ? <Checkout /> : <Contact />}
        {!user && <Auth />}
      </motion.div>
    </aside>
  )
}
