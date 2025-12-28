import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { itineraryApi, tripApi, Trip, Itinerary, ItineraryItem } from '../services/api'
import { format, parseISO, addDays } from 'date-fns'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Plane,
  Hotel,
  Utensils,
  Camera,
  Bus,
  Coffee,
  ChevronDown,
  ChevronUp,
  Loader2,
  DollarSign,
  ExternalLink,
  Sparkles,
} from 'lucide-react'

const typeIcons: Record<string, typeof Plane> = {
  flight: Plane,
  hotel: Hotel,
  activity: Camera,
  meal: Utensils,
  transportation: Bus,
  'free-time': Coffee,
}

const typeColors: Record<string, string> = {
  flight: 'bg-ocean-100 text-ocean-700 border-ocean-200',
  hotel: 'bg-primary-100 text-primary-700 border-primary-200',
  activity: 'bg-green-100 text-green-700 border-green-200',
  meal: 'bg-amber-100 text-amber-700 border-amber-200',
  transportation: 'bg-purple-100 text-purple-700 border-purple-200',
  'free-time': 'bg-earth-100 text-earth-700 border-earth-200',
}

export default function ItineraryPage() {
  const { id } = useParams<{ id: string }>()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedDays, setExpandedDays] = useState<number[]>([1])

  useEffect(() => {
    let retryCount = 0
    const maxRetries = 20 // Try for up to 60 seconds (20 * 3s)
    let retryTimeout: NodeJS.Timeout | null = null

    const fetchData = async () => {
      try {
        // Always fetch trip first
        const tripData = await tripApi.getTrip(id!)
        setTrip(tripData)

        // Try to fetch itinerary
        try {
          const itineraryData = await itineraryApi.getItinerary(id!)
          setItinerary(itineraryData)
          setIsLoading(false)
          // Clear any pending retries
          if (retryTimeout) {
            clearTimeout(retryTimeout)
            retryTimeout = null
          }
        } catch (itineraryError: any) {
          // Itinerary not found - might still be generating
          const is404 = itineraryError?.response?.status === 404 || 
                       itineraryError?.message?.includes('404') ||
                       itineraryError?.message?.includes('not found')
          
          if (is404 && retryCount < maxRetries) {
            // Keep loading and retry
            setIsLoading(true)
            retryCount++
            retryTimeout = setTimeout(() => {
              fetchData()
            }, 3000) // Retry every 3 seconds
          } else {
            // Max retries reached or different error
            setIsLoading(false)
            setItinerary(null)
          }
        }
      } catch (error: any) {
        console.error('Error fetching trip:', error)
        const is404 = error?.response?.status === 404 || 
                     error?.message?.includes('404') ||
                     error?.message?.includes('not found')
        
        if (is404) {
          setIsLoading(false)
          setTrip(null)
        } else {
          // Other error - show error state
          setIsLoading(false)
          setTrip(null)
        }
      }
    }
    
    fetchData()

    // Cleanup on unmount
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
    }
  }, [id])

  const generateDemoItinerary = (): ItineraryItem[] => {
    const items: ItineraryItem[] = [
      // Day 1
      { id: '1', dayNumber: 1, time: '08:00', type: 'flight', title: 'Depart from SFO', description: 'Japan Airlines JL001 - San Francisco to Tokyo Narita', location: 'San Francisco International Airport', duration: 660, price: 850, bookingStatus: 'pending' },
      { id: '2', dayNumber: 1, time: '19:00', type: 'transportation', title: 'Airport Transfer', description: 'Narita Express to Shinjuku Station', location: 'Narita Airport', duration: 90, price: 30 },
      { id: '3', dayNumber: 1, time: '21:00', type: 'hotel', title: 'Check-in at Park Hyatt Tokyo', description: 'Deluxe Room with city views - Famous from Lost in Translation', location: 'Shinjuku, Tokyo', price: 350, bookingStatus: 'pending' },
      // Day 2
      { id: '4', dayNumber: 2, time: '09:00', type: 'meal', title: 'Breakfast at Tsukiji Outer Market', description: 'Fresh sushi and seafood breakfast', location: 'Tsukiji Market', duration: 90, price: 40 },
      { id: '5', dayNumber: 2, time: '11:00', type: 'activity', title: 'teamLab Planets', description: 'Immersive digital art museum experience', location: 'Toyosu, Tokyo', duration: 180, price: 35, bookingStatus: 'pending' },
      { id: '6', dayNumber: 2, time: '15:00', type: 'activity', title: 'Akihabara Electric Town', description: 'Explore electronics, anime, and gaming culture', location: 'Akihabara', duration: 180 },
      { id: '7', dayNumber: 2, time: '19:00', type: 'meal', title: 'Dinner at Robot Restaurant', description: 'Famous neon-lit robot show dinner experience', location: 'Shinjuku', duration: 120, price: 80, bookingStatus: 'pending' },
      // Day 3
      { id: '8', dayNumber: 3, time: '08:00', type: 'activity', title: 'Senso-ji Temple', description: 'Tokyo\'s oldest temple and Nakamise shopping street', location: 'Asakusa', duration: 150 },
      { id: '9', dayNumber: 3, time: '12:00', type: 'meal', title: 'Ramen Lunch', description: 'Authentic Tokyo-style ramen at Ichiran', location: 'Shibuya', duration: 60, price: 15 },
      { id: '10', dayNumber: 3, time: '14:00', type: 'activity', title: 'Shibuya Crossing & Harajuku', description: 'Famous crossing, Takeshita Street fashion', location: 'Shibuya/Harajuku', duration: 240 },
      { id: '11', dayNumber: 3, time: '19:00', type: 'meal', title: 'Omakase Dinner', description: 'Chef\'s choice sushi at Sukiyabashi Jiro', location: 'Ginza', duration: 120, price: 300 },
      // Day 4
      { id: '12', dayNumber: 4, time: '07:00', type: 'transportation', title: 'Day Trip to Mt. Fuji', description: 'Shinkansen to Kawaguchiko', location: 'Tokyo Station', duration: 120, price: 60 },
      { id: '13', dayNumber: 4, time: '10:00', type: 'activity', title: 'Mt. Fuji 5th Station', description: 'Scenic views and hiking trails', location: 'Mt. Fuji', duration: 240 },
      { id: '14', dayNumber: 4, time: '15:00', type: 'free-time', title: 'Onsen Experience', description: 'Traditional hot spring bath', location: 'Hakone', duration: 120, price: 50 },
      { id: '15', dayNumber: 4, time: '20:00', type: 'hotel', title: 'Return to Hotel', description: 'Rest and prepare for final day', location: 'Shinjuku, Tokyo' },
      // Day 5
      { id: '16', dayNumber: 5, time: '09:00', type: 'activity', title: 'Meiji Shrine', description: 'Peaceful shrine in forested area', location: 'Shibuya', duration: 90 },
      { id: '17', dayNumber: 5, time: '11:00', type: 'activity', title: 'Last-minute Shopping', description: 'Souvenirs at Tokyu Hands and Don Quijote', location: 'Shibuya/Shinjuku', duration: 180 },
      { id: '18', dayNumber: 5, time: '15:00', type: 'transportation', title: 'Airport Transfer', description: 'Narita Express to airport', location: 'Shinjuku Station', duration: 90, price: 30 },
      { id: '19', dayNumber: 5, time: '18:00', type: 'flight', title: 'Depart from NRT', description: 'Japan Airlines JL002 - Tokyo Narita to San Francisco', location: 'Narita International Airport', duration: 600, price: 850, bookingStatus: 'pending' },
    ]
    return items
  }

  const groupByDay = (items: ItineraryItem[]) => {
    const grouped: Record<number, ItineraryItem[]> = {}
    items.forEach((item) => {
      if (!grouped[item.dayNumber]) {
        grouped[item.dayNumber] = []
      }
      grouped[item.dayNumber].push(item)
    })
    return grouped
  }

  const toggleDay = (day: number) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <div className="text-center">
          <p className="text-earth-700 font-medium">Generating your itinerary...</p>
          <p className="text-sm text-earth-500 mt-1">This may take a few moments</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-earth-600">Trip not found</p>
        <Link to="/dashboard" className="text-primary-600 hover:underline mt-2 inline-block">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  if (!itinerary) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-earth-600 mb-4">Itinerary is still being generated</p>
        <p className="text-sm text-earth-500 mb-4">Please wait a moment and refresh the page</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Refresh Page
        </button>
        <Link to="/dashboard" className="block text-primary-600 hover:underline mt-4">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const groupedItems = groupByDay(itinerary.items)
  const days = Object.keys(groupedItems).map(Number).sort((a, b) => a - b)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-earth-500 hover:text-earth-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-earth-800">
                {trip.title}
              </h1>
              <p className="text-earth-500 mt-1">{trip.description}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-earth-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  {trip.destinations[0]?.name}, {trip.destinations[0]?.country}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-ocean-500" />
                  {trip.startDate && format(parseISO(trip.startDate), 'MMM d')} -{' '}
                  {trip.endDate && format(parseISO(trip.endDate), 'MMM d, yyyy')}
                </div>
                {itinerary.totalCost && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    Est. ${itinerary.totalCost.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </motion.div>

      {/* AI Suggestions Banner */}
      {itinerary.aiSuggestions && Object.keys(itinerary.aiSuggestions).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 to-ocean-500 rounded-2xl p-4 mb-6 text-white"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">AI Tip</h3>
              <p className="text-sm text-white/90">
                Consider booking the Robot Restaurant at least a week in advance - it's very popular!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Itinerary Timeline */}
      <div className="space-y-4">
        {days.map((day, dayIndex) => {
          const dayItems = groupedItems[day]
          const isExpanded = expandedDays.includes(day)
          const dayDate = trip.startDate ? addDays(parseISO(trip.startDate), day - 1) : null

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.05 }}
              className="card overflow-hidden"
            >
              {/* Day Header */}
              <button
                onClick={() => toggleDay(day)}
                className="w-full flex items-center justify-between p-2 -m-2 hover:bg-earth-50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl
                               flex items-center justify-center text-white font-bold">
                    {day}
                  </div>
                  <div className="text-left">
                    <h3 className="font-display text-lg font-semibold text-earth-800">
                      Day {day}
                    </h3>
                    {dayDate && (
                      <p className="text-sm text-earth-500">
                        {format(dayDate, 'EEEE, MMMM d')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-earth-500">{dayItems.length} activities</span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-earth-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-earth-400" />
                  )}
                </div>
              </button>

              {/* Day Items */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-earth-100"
                  >
                    <div className="space-y-3">
                      {dayItems.map((item, itemIndex) => {
                        const Icon = typeIcons[item.type] || Camera
                        const colorClass = typeColors[item.type] || typeColors.activity

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemIndex * 0.05 }}
                            className={`flex gap-4 p-4 rounded-xl border ${colorClass} bg-opacity-50`}
                          >
                            <div className="flex-shrink-0">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-medium text-earth-800">{item.title}</h4>
                                  <p className="text-sm text-earth-500 mt-0.5">{item.description}</p>
                                </div>
                                {item.bookingStatus && (
                                  <span
                                    className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium
                                              ${
                                                item.bookingStatus === 'confirmed'
                                                  ? 'bg-green-100 text-green-700'
                                                  : item.bookingStatus === 'booked'
                                                  ? 'bg-ocean-100 text-ocean-700'
                                                  : 'bg-amber-100 text-amber-700'
                                              }`}
                                  >
                                    {item.bookingStatus}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-earth-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {item.time}
                                  {item.duration && ` (${Math.floor(item.duration / 60)}h ${item.duration % 60}m)`}
                                </div>
                                {item.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {item.location}
                                  </div>
                                )}
                                {item.price && (
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    ${item.price}
                                  </div>
                                )}
                              </div>
                              {item.bookingStatus === 'pending' && (
                                <button
                                  onClick={() => handleBookItem(item)}
                                  className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium
                                           flex items-center gap-1"
                                >
                                  Book Now
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

    </div>
  )
}

