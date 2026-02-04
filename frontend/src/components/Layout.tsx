import { ReactNode } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Globe,
  Map,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  Plane,
} from 'lucide-react'
import { useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { path: '/dashboard', icon: Globe, label: 'Dashboard' },
    { path: '/plan', icon: Map, label: 'Plan Trip' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-earth-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-travel-pattern opacity-30 pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div
                className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl
                         flex items-center justify-center shadow-lg shadow-primary-500/25
                         transition-transform duration-300 group-hover:rotate-12"
              >
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-semibold text-earth-800">
                Travel Guide
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
                              ${
                                isActive
                                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                  : 'text-earth-600 hover:bg-white/50 hover:text-earth-800'
                              }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/50 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-ocean-400 to-ocean-500 rounded-full
                              flex items-center justify-center text-white font-medium">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <span className="text-earth-700 font-medium">{user?.fullName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-earth-500 hover:text-primary-600 hover:bg-white/50
                         rounded-xl transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-earth-600 hover:text-earth-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 border-t border-white/20 animate-slide-down">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium
                              ${
                                isActive
                                  ? 'bg-primary-500 text-white'
                                  : 'text-earth-600 hover:bg-earth-100'
                              }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
              <hr className="border-earth-200 my-2" />
              <div className="flex items-center gap-3 px-4 py-3">
                <User className="w-5 h-5 text-earth-500" />
                <span className="text-earth-700">{user?.fullName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50
                         rounded-xl w-full"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="relative z-10">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto py-8 text-center text-earth-500 text-sm">
        <div className="flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Travel Guide AI &copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}


