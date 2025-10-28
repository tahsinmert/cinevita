"use client"
import { motion } from 'framer-motion'

export default function Spinner() {
  return (
    <div className="flex items-center justify-center gap-2 text-neutral-800">
      {[0,1,2].map((i) => (
        <motion.span
          key={i}
          className="block h-2.5 w-2.5 rounded-full bg-neutral-800"
          initial={{ y: 0, opacity: 0.6 }}
          animate={{ y: [-3, 3, -3], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}


