import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { tripApi, Trip } from '../services/api'
import { useTrips } from '../hooks/useTrips'
import {
  Plus,
  MapPin,
  Calendar,
  Users,
  ChevronRight,
  Plane,
  Loader2,
  Sparkles,
  Globe,
  Trash2,
} from 'lucide-react'
import { format } from 'date-fns'

export default function DashboardPage() {
  const { user } = useAuth()
  const { trips, isLoading, deleteTrip, fetchTrips } = useTrips()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (tripId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return
    }

    setDeletingId(tripId)
    try {
      await deleteTrip(tripId)
      // Trips will be automatically refreshed by useTrips hook
    } catch (error) {
      console.error('Failed to delete trip:', error)
      alert('Failed to delete trip. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-ocean-100 text-ocean-700'
      case 'booked':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-earth-100 text-earth-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-earth-800">
            {getGreeting()}, {user?.fullName?.split(' ')[0]}!
          </h1>
          <p className="text-earth-500 mt-1">Ready to plan your next adventure?</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            to="/plan"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Plan New Trip
          </Link>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8"
      >
        {[
          { icon: Globe, label: 'Total Trips', value: trips.length.toString(), color: 'primary' },
          { icon: Calendar, label: 'This Month', value: trips.filter(t => {
            const now = new Date()
            const tripDate = t.startDate ? new Date(t.startDate) : null
            return tripDate && tripDate.getMonth() === now.getMonth() && tripDate.getFullYear() === now.getFullYear()
          }).length.toString(), color: 'earth' },
        ].map((stat) => (
          <div key={stat.label} className="card">
            <div className={`w-10 h-10 bg-${stat.color}-100 rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
            </div>
            <p className="text-2xl font-bold text-earth-800">{stat.value}</p>
            <p className="text-sm text-earth-500">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Trips Grid */}
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-earth-800 mb-4">Your Trips</h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : trips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-16"
          >
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-10 h-10 text-primary-500" />
            </div>
            <h3 className="font-display text-xl font-semibold text-earth-800 mb-2">
              No trips yet
            </h3>
            <p className="text-earth-500 mb-6 max-w-sm mx-auto">
              Start planning your first adventure. Tell us where you want to go and we'll handle the rest!
            </p>
            <Link to="/plan" className="btn-primary inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Plan Your First Trip
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, tripIndex) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: tripIndex * 0.1 }}
              >
                <div className="card block hover:shadow-xl transition-shadow group relative">
                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDelete(trip.id, e)}
                    disabled={deletingId === trip.id}
                    className="absolute top-3 left-3 z-10 p-2 bg-white/90 hover:bg-red-50 rounded-full 
                             shadow-md transition-colors disabled:opacity-50"
                    title="Delete trip"
                  >
                    <Trash2 className={`w-4 h-4 ${deletingId === trip.id ? 'text-gray-400' : 'text-red-500'}`} />
                  </button>

                  <Link
                    to={`/itinerary/${trip.id}`}
                    className="block"
                  >
                    {/* Trip Image Placeholder */}
                    <div className="h-32 bg-gradient-to-br from-primary-400 to-ocean-500 rounded-xl mb-4
                                  flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/10" />
                      <Plane className="w-12 h-12 text-white/80" />
                      <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium
                                      ${getStatusColor(trip.status)}`}>
                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-semibold text-earth-800 mb-2 
                                 group-hover:text-primary-600 transition-colors">
                      {trip.title}
                    </h3>
                    <p className="text-sm text-earth-500 mb-4 line-clamp-2">{trip.description || trip.originalRequest || 'No description'}</p>

                    <div className="flex flex-wrap gap-3 text-sm text-earth-600">
                      {Array.isArray(trip.destinations) && trip.destinations.length > 0 && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-primary-500" />
                          {typeof trip.destinations[0] === 'string' ? trip.destinations[0] : trip.destinations[0]?.name || trip.destinations[0]}
                        </div>
                      )}
                      {trip.startDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-ocean-500" />
                          {format(new Date(trip.startDate), 'MMM d')}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-earth-500" />
                        {trip.travelersCount || 1}
                      </div>
                    </div>

                    <div className="flex items-center justify-end mt-4 text-primary-600 
                                  opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}

            {/* Add Trip Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: trips.length * 0.1 }}
            >
              <Link
                to="/plan"
                className="card h-full min-h-[280px] flex flex-col items-center justify-center text-center
                         border-2 border-dashed border-earth-200 hover:border-primary-400 
                         hover:bg-primary-50/30 transition-all group"
              >
                <div className="w-16 h-16 bg-earth-100 rounded-full flex items-center justify-center mb-4
                              group-hover:bg-primary-100 transition-colors">
                  <Plus className="w-8 h-8 text-earth-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <h3 className="font-display text-lg font-semibold text-earth-700 mb-2">
                  Plan a New Trip
                </h3>
                <p className="text-sm text-earth-500">
                  Let AI help you create the perfect itinerary
                </p>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

