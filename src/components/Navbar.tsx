
import React, { useState } from 'react'
import {
  Home,
  Music,
  Radio,
  Menu,
  Calendar,
  X,
  Ticket,
  Trophy
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface NavbarProps {
  activeTab: string
  // Props mantidas por compatibilidade
  theme?: 'light' | 'dark'
  onToggleTheme?: () => void
  glass?: boolean
  // Cor de destaque do item ativo
  programColor?: string
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'music', label: 'Music', icon: Music, path: '/music' },
  { id: 'sports', label: 'Sports', icon: Trophy, path: '/sports' },
  { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/schedule' },
  { id: 'devotional', label: 'Devotional', icon: Radio, path: '/devotional' }
]

const Navbar: React.FC<NavbarProps> = ({ activeTab, programColor }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const accent =
    programColor && programColor !== 'transparent'
      ? programColor
      : '#ff6600'

  return (
    <>
      <header className="sticky top-0 z-50 text-white bg-black/25 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center h-full space-x-8">
            <div
              className="flex items-center cursor-pointer h-full"
              onClick={() => navigate('/')}
              role="button"
              tabIndex={0}
              aria-label="Go to Praise FM USA home"
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  navigate('/')
                }
              }}
            >
              <img
                src="https://res.cloudinary.com/dtecypmsh/image/upload/v1769820657/logo_hochsa.webp"
                alt="Praise FM USA Logo"
                className="h-7 w-auto object-contain brightness-0 invert"
              />
            </div>

            <nav
              className="hidden md:flex items-center space-x-6 h-full"
              aria-label="Main navigation"
            >
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      borderColor: isActive ? accent : 'transparent'
                    }}
                    className={`flex items-center space-x-2 text-[14px] font-medium transition-all h-full border-b-2 px-1 uppercase tracking-tighter ${
                      isActive
                        ? 'text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-white/60'
                      }`}
                      strokeWidth={1.5}
                    />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden text-white"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/*
        O menu mobile fica fora do header para preservar
        o posicionamento correto do overlay.
      */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 top-16 z-40 md:hidden p-6 overflow-y-auto bg-black/70 backdrop-blur-xl"
        >
          <nav
            className="flex flex-col space-y-4"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path)
                    setIsMobileMenuOpen(false)
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  style={
                    isActive
                      ? { borderLeft: `3px solid ${accent}` }
                      : undefined
                  }
                  className={`flex items-center space-x-4 p-4 rounded-xl text-lg font-medium uppercase tracking-tighter transition-colors hover:bg-white/10 ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-white/80'
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}

export default Navbar
