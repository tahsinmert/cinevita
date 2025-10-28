"use client"
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Film, Bookmark, Eye, Sparkles, Menu, X } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const params = useSearchParams()
  const qParam = params.get('q') || ''
  const [q, setQ] = useState(qParam)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const addSearchTerm = useAppStore((s) => s.addSearchTerm)
  const searchHistory = useAppStore((s) => s.searchHistory)

  useEffect(() => { setQ(qParam) }, [qParam])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const query = q.trim()
    if (!query) return
    addSearchTerm(query)
    router.push(`/?q=${encodeURIComponent(query)}`)
  }

  const isScrolled = scrollY > 20

  return (
    <motion.header 
      className="sticky top-0 z-50 overflow-hidden touch-target"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Animated Background (disabled for full transparency) */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none hidden"
        animate={{
          background: [
            "linear-gradient(90deg, rgba(147, 51, 234, 0.2) 0%, rgba(219, 39, 119, 0.2) 50%, rgba(37, 99, 235, 0.2) 100%)",
            "linear-gradient(90deg, rgba(37, 99, 235, 0.2) 0%, rgba(147, 51, 234, 0.2) 50%, rgba(219, 39, 119, 0.2) 100%)",
            "linear-gradient(90deg, rgba(219, 39, 119, 0.2) 0%, rgba(37, 99, 235, 0.2) 50%, rgba(147, 51, 234, 0.2) 100%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Floating Particles (disabled for full transparency) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Header Content */}
      <motion.div 
        className={`relative z-10 bg-transparent shadow-none transition-all duration-500 ${isScrolled ? 'mx-5 my-2' : ''}`}
        animate={{
          backdropFilter: 'blur(0px)',
          borderRadius: isScrolled ? '50px' : '0px',
          scale: isScrolled ? 0.95 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
          duration: 0.6
        }}
      >
        <motion.div 
          className={`container mx-auto px-4 ${isScrolled ? 'py-3' : 'py-4'}`}
        >
          <motion.div 
            className="flex items-center justify-between"
            animate={{
              gap: isScrolled ? '8px' : '16px',
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              duration: 0.6
            }}
          >
            {/* Logo with Animation */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: isScrolled ? 0.9 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                duration: 0.6
              }}
            >
              <Link href="/" className="flex items-center gap-3 group">
                <motion.div
                  className="relative"
                  animate={{ 
                    rotate: 360,
                    scale: isScrolled ? 0.8 : 1,
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { type: "spring", stiffness: 200, damping: 25, duration: 0.6 }
                  }}
                >
                  <Film className="w-8 h-8 text-purple-600" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4 text-pink-500" />
                  </motion.div>
                </motion.div>
                <motion.span 
                  className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
                  whileHover={{ 
                    backgroundImage: "linear-gradient(45deg, #8b5cf6, #ec4899, #3b82f6, #8b5cf6)",
                    backgroundSize: "200% 200%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    fontSize: isScrolled ? '20px' : '24px',
                  }}
                  transition={{ 
                    backgroundPosition: { duration: 3, repeat: Infinity },
                    fontSize: { type: "spring", stiffness: 200, damping: 25, duration: 0.6 }
                  }}
                >
                  CineVita
                </motion.span>
              </Link>
            </motion.div>

            {/* Search Bar with Floating Animation */}
            <motion.div 
              className={`relative ${isScrolled ? 'flex-1 max-w-2xl mx-4' : 'flex-1 max-w-2xl mx-8'}`}
              animate={{
                scale: isSearchFocused ? 1.02 : (isScrolled ? 0.9 : 1),
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                duration: 0.6
              }}
            >
              <form onSubmit={onSubmit} className="relative z-10">
                <motion.div
                  className="relative z-10"
                  animate={isSearchFocused ? { y: -2 } : { y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    value={q} 
                    onChange={(e) => setQ(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Search movies, directors, genres…" 
                    className="pl-12 pr-4 py-3 rounded-full border-2 border-transparent bg-white/80 backdrop-blur-sm focus:border-purple-500 focus:bg-white transition-all duration-300 shadow-lg"
                  />
                  
                  {/* Search Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl pointer-events-none z-0"
                    animate={isSearchFocused ? { opacity: 1, scale: 1.1 } : { opacity: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Search Suggestions */}
                <AnimatePresence>
                  {q && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="absolute inset-x-0 top-full mt-2 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-3 space-y-1 z-50"
                    >
                      {searchHistory.filter((s) => s.toLowerCase().includes(q.toLowerCase())).slice(0,5).map((s, index) => (
                        <motion.button 
                          key={s} 
                          type="button" 
                          className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-200 flex items-center gap-3"
                          onClick={() => router.push(`/?q=${encodeURIComponent(s)}`)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5, scale: 1.02 }}
                        >
                          <Search className="w-4 h-4 text-purple-500" />
                          {s}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>

            {/* Navigation Buttons */}
            <>
              {/* Default horizontal group (visible when not scrolled) */}
              <AnimatePresence>
                {!isScrolled && (
                  <motion.div 
                    key="nav-horizontal"
                    className="hidden md:flex gap-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25, duration: 0.4 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href="/watched">
                        <Button 
                          variant="ghost" 
                          className="relative overflow-hidden rounded-full px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-200/50 hover:border-emerald-300/50 transition-all duration-300"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Watched
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "0%" }}
                            transition={{ duration: 0.3 }}
                          />
                        </Button>
                      </Link>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href="/watchlist">
                        <Button 
                          variant="ghost" 
                          className="relative overflow-hidden rounded-full px-6 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-200/50 hover:border-amber-300/50 transition-all duration-300"
                        >
                          <Bookmark className="w-4 h-4 mr-2" />
                          Watchlist
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "0%" }}
                            transition={{ duration: 0.3 }}
                          />
                        </Button>
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scrolled vertical stack at far right with unique animation */}
              <AnimatePresence>
                {isScrolled && (
                  <motion.div
                    key="nav-vertical"
                    className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-2 z-20"
                    initial={{ opacity: 0, x: 80, rotate: -180, scale: 0.6 }}
                    animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 80, rotate: 180, scale: 0.6 }}
                    transition={{ type: "spring", stiffness: 160, damping: 18 }}
                  >
                    {/* Comet trail effect */}
                    <motion.span 
                      className="absolute -right-6 top-0 h-full w-24 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.5, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      style={{
                        background: 'radial-gradient(closest-side, rgba(147,51,234,0.25), transparent 70%)'
                      }}
                    />

                    <motion.div
                      whileHover={{ rotate: -2, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0, y: -20, rotate: -8 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{ delay: 0.05, type: "spring", stiffness: 220, damping: 20 }}
                    >
                      <Link href="/watched">
                        <Button 
                          variant="ghost" 
                          className="relative overflow-hidden rounded-full px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-200/50 hover:border-emerald-300/50 transition-all duration-300"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Watched
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20"
                            initial={{ x: "-120%" }}
                            animate={{ x: ["-120%", "0%", "120%"] }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                            style={{ mixBlendMode: 'soft-light' }}
                          />
                        </Button>
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ rotate: 2, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0, y: 20, rotate: 8 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{ delay: 0.12, type: "spring", stiffness: 220, damping: 20 }}
                    >
                      <Link href="/watchlist">
                        <Button 
                          variant="ghost" 
                          className="relative overflow-hidden rounded-full px-6 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-200/50 hover:border-amber-300/50 transition-all duration-300"
                        >
                          <Bookmark className="w-4 h-4 mr-2" />
                          Watchlist
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20"
                            initial={{ x: "120%" }}
                            animate={{ x: ["120%", "0%", "-120%"] }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                            style={{ mixBlendMode: 'soft-light' }}
                          />
                        </Button>
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>

            {/* Mobile Menu Button */}
            <motion.div 
              className="md:hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: isScrolled ? 0.9 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                duration: 0.6
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-full w-12 h-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden mt-4 pt-4 border-t border-white/20"
            >
                <div className="flex flex-col gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link href="/watched" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start rounded-full px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20"
                      >
                        <Eye className="w-4 h-4 mr-3" />
                        Watched
                      </Button>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link href="/watchlist" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start rounded-full px-6 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20"
                      >
                        <Bookmark className="w-4 h-4 mr-3" />
                        Watchlist
                      </Button>
                    </Link>
                  </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  )
}


