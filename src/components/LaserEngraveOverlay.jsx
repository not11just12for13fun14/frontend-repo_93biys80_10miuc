import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LaserEngraveOverlay({ trigger }) {
  useEffect(() => {}, [trigger])

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={trigger}
        className="pointer-events-none absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="absolute top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          initial={{ y: -2, opacity: 0 }}
          animate={{ y: ['0%', '100%'], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
          initial={{ x: -2, opacity: 0 }}
          animate={{ x: ['0%', '100%'], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.05 }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
