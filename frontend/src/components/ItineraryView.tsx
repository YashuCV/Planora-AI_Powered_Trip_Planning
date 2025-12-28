import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO, addDays } from 'date-fns'
import {
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
  DollarSign,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Itinerary, ItineraryItem } from '../services/api'

interface ItineraryViewProps {
  itinerary: Itinerary
  startDate?: string
  onBookItem?: (item: ItineraryItem) => void
}

const typeIcons: Record<string, typeof Plane> = {
  flight: Plane,
  hotel: Hotel,
  activity: Camera,
  meal: Utensils,
  transportation: Bus,
  'free-time': Coffee,
}

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  flight: { bg: 'bg-ocean-100', text: 'text-ocean-700', border: 'border-ocean-200' },
  hotel: { bg: 'bg-primary-100', text: 'text-primary-700', border: 'border-primary-200' },
  activity: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  meal: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  transportation: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  'free-time': { bg: 'bg-earth-100', text: 'text-earth-700', border: 'border-earth-200' },
}

export default function ItineraryView({ itinerary, startDate, onBookItem }: ItineraryViewProps) {
  const [expandedDays, setExpandedDays] = useState<number[]>([1, 2])

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

  const groupedItems = groupByDay(itinerary.items)
  const days = Object.keys(groupedItems).map(Number).sort((a, b) => a - b)

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Confirmed
          </span>
        )
      case 'booked':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-ocean-100 text-ocean-700">
            Booked
          </span>
        )
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <AlertCircle className="w-3 h-3" />
            Pending
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {days.map((day, dayIndex) => {
        const dayItems = groupedItems[day]
        const isExpanded = expandedDays.includes(day)
        const dayDate = startDate ? addDays(parseISO(startDate), day - 1) : null

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
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/25">
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
              <div className="flex items-center gap-3">
                <span className="text-sm text-earth-500">{dayItems.length} items</span>
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
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-earth-200" />

                    <div className="space-y-4">
                      {dayItems.map((item, itemIndex) => {
                        const Icon = typeIcons[item.type] || Camera
                        const colors = typeColors[item.type] || typeColors.activity

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemIndex * 0.05 }}
                            className="relative flex gap-4 ml-2"
                          >
                            {/* Timeline dot */}
                            <div className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg}`}>
                              <Icon className={`w-4 h-4 ${colors.text}`} />
                            </div>

                            {/* Content */}
                            <div className={`flex-1 p-4 rounded-xl border ${colors.border} ${colors.bg} bg-opacity-30`}>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <h4 className="font-medium text-earth-800">{item.title}</h4>
                                  <p className="text-sm text-earth-500">{item.description}</p>
                                </div>
                                {getStatusBadge(item.bookingStatus)}
                              </div>

                              <div className="flex flex-wrap items-center gap-4 text-xs text-earth-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {item.time}
                                  {item.duration && (
                                    <span className="ml-1">
                                      ({Math.floor(item.duration / 60)}h{item.duration % 60 > 0 && ` ${item.duration % 60}m`})
                                    </span>
                                  )}
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

                              {/* Booking Actions */}
                              <div className="mt-3 flex flex-wrap gap-2">
                                {item.type === 'flight' && (
                                  <button
                                    onClick={() => onBookItem && onBookItem(item)}
                                    className="px-3 py-1.5 text-xs font-medium bg-ocean-500 hover:bg-ocean-600 text-white rounded-lg flex items-center gap-1.5 transition-colors"
                                  >
                                    <Plane className="w-3 h-3" />
                                    Book Flights
                                  </button>
                                )}
                                {item.type === 'hotel' && (
                                  <button
                                    onClick={() => onBookItem && onBookItem(item)}
                                    className="px-3 py-1.5 text-xs font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg flex items-center gap-1.5 transition-colors"
                                  >
                                    <Hotel className="w-3 h-3" />
                                    View Hotels
                                  </button>
                                )}
                                {item.type !== 'flight' && item.type !== 'hotel' && item.bookingRequired && item.bookingStatus === 'pending' && onBookItem && (
                                  <button
                                    onClick={() => onBookItem(item)}
                                    className="px-3 py-1.5 text-xs font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg flex items-center gap-1.5 transition-colors"
                                  >
                                    Book Now
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}

      {/* Summary Footer */}
      {itinerary.totalCost && (
        <div className="card bg-gradient-to-r from-primary-500 to-ocean-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Estimated Total Cost</p>
              <p className="text-2xl font-bold">${itinerary.totalCost.toLocaleString()}</p>
            </div>
            <Calendar className="w-10 h-10 text-white/50" />
          </div>
        </div>
      )}
    </div>
  )
}


