import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plane,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Globe,
  Hotel,
  Ticket,
  Star,
} from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Planning',
      description: 'Describe your dream trip in plain English and let AI craft the perfect itinerary.',
    },
    {
      icon: Plane,
      title: 'Flight Booking',
      description: 'Find and book the best flights with real-time pricing and availability.',
    },
    {
      icon: Hotel,
      title: 'Hotel Reservations',
      description: 'Discover accommodations that match your style and budget.',
    },
    {
      icon: Ticket,
      title: 'Activity Tickets',
      description: 'Book tours, attractions, and experiences at your destinations.',
    },
    {
      icon: Calendar,
      title: 'Calendar Sync',
      description: 'Automatically sync your itinerary to Google Calendar.',
    },
    {
      icon: Globe,
      title: 'Local Insights',
      description: 'Get personalized recommendations from AI with local knowledge.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 via-primary-50 to-ocean-50 overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-ocean-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-earth-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl
                     flex items-center justify-center shadow-xl shadow-primary-500/30"
          >
            <Plane className="w-6 h-6 text-white" />
          </motion.div>
          <span className="font-display text-2xl font-bold text-earth-800">Travel Guide</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-earth-600 hover:text-earth-800 font-medium transition-colors"
          >
            Sign In
          </Link>
          <Link to="/register" className="btn-primary flex items-center gap-2">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 lg:px-12 lg:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full
                          text-sm font-medium text-primary-600 mb-6 border border-primary-200/50">
              <Star className="w-4 h-4 fill-primary-500" />
              AI-Powered Travel Planning
            </div>
            <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-earth-900 leading-tight mb-6">
              Your Dream Trip,{' '}
              <span className="bg-gradient-to-r from-primary-500 via-primary-600 to-ocean-500 bg-clip-text text-transparent">
                Perfectly Planned
              </span>
            </h1>
            <p className="text-xl text-earth-600 mb-8 leading-relaxed max-w-xl">
              Tell us where you want to go, and our AI will create a complete itinerary with flights, 
              hotels, activities, and everything synced to your calendar.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                Start Planning
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
                <MapPin className="w-5 h-5" />
                View Demo
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-earth-900/10
                          border border-white/50 p-6 overflow-hidden">
              {/* Chat Interface Mock */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-ocean-400 to-ocean-500 rounded-full
                                flex items-center justify-center text-white text-sm font-medium">
                    U
                  </div>
                  <div className="bg-earth-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                    <p className="text-earth-700 text-sm">
                      Plan a 5-day trip to Tokyo for 2 people in March. We love food and technology!
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl rounded-tr-sm
                                px-4 py-3 max-w-sm shadow-lg shadow-primary-500/20">
                    <p className="text-white text-sm">
                      I'd love to help plan your Tokyo adventure! Here's what I've found:
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="bg-white/20 rounded-lg p-2 flex items-center gap-2">
                        <Plane className="w-4 h-4 text-white/80" />
                        <span className="text-white/90 text-xs">Round-trip flights from $850</span>
                      </div>
                      <div className="bg-white/20 rounded-lg p-2 flex items-center gap-2">
                        <Hotel className="w-4 h-4 text-white/80" />
                        <span className="text-white/90 text-xs">Shinjuku hotels from $120/night</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full
                                flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3
                         border border-earth-100"
              >
                <Calendar className="w-6 h-6 text-primary-500" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-3
                         border border-earth-100"
              >
                <Globe className="w-6 h-6 text-ocean-500" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-earth-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-earth-600 max-w-2xl mx-auto">
            From inspiration to booking, we handle every detail of your journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card group cursor-pointer"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl
                           flex items-center justify-center mb-4 group-hover:from-primary-500 
                           group-hover:to-primary-600 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-display text-xl font-semibold text-earth-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-earth-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24 lg:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-primary-500 via-primary-600 to-ocean-600 rounded-3xl
                   p-8 lg:p-12 text-center shadow-2xl shadow-primary-500/30"
        >
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of travelers who plan their perfect trips with AI assistance.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl
                     font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                     transition-all duration-200"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-earth-200 py-8 text-center text-earth-500">
        <p>&copy; {new Date().getFullYear()} Travel Guide AI. All rights reserved.</p>
      </footer>
    </div>
  )
}


