"use client"
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [show, setShow] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="scroll-top"
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0.6, rotate: -90, x: 40, y: 40 }}
          animate={{ opacity: 1, scale: 1, rotate: 0, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, rotate: 90, x: 40, y: 40 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {/* Orbital aura */}
          <motion.div
            className="absolute inset-0 -m-3 rounded-full pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{
              background:
                'conic-gradient(from 0deg at 50% 50%, rgba(147,51,234,0.18), rgba(236,72,153,0.18), rgba(59,130,246,0.18), rgba(147,51,234,0.18))'
            }}
          />

          {/* Comet ring */}
          <motion.span
            className="absolute -inset-2 rounded-full blur-xl pointer-events-none"
            animate={{
              opacity: hovered ? [0.2, 0.5, 0.2] : 0.25,
              scale: hovered ? [1, 1.08, 1] : 1,
            }}
            transition={{ duration: 1.2, repeat: hovered ? Infinity : 0 }}
            style={{
              background: 'radial-gradient(closest-side, rgba(59,130,246,0.18), transparent 70%)'
            }}
          />

          <motion.button
            type="button"
            onClick={scrollTop}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative h-12 w-12 rounded-full bg-white/80 backdrop-blur border border-white/60 shadow-xl flex items-center justify-center"
            whileHover={{ scale: 1.06, rotate: -6 }}
            whileTap={{ scale: 0.94 }}
          >
            {/* Spiral spark on hover */}
            <AnimatePresence>
              {hovered && (
                <motion.span
                  key="spark"
                  className="absolute inset-0 rounded-full pointer-events-none"
                  initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1.1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.2, rotate: 45 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    background:
                      'radial-gradient(closest-side, rgba(16,185,129,0.22), transparent 70%)'
                  }}
                />)
              }
            </AnimatePresence>

            <motion.div
              animate={{ y: hovered ? -2 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <ArrowUp className="h-5 w-5 text-neutral-800" />
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


