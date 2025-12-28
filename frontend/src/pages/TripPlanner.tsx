import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { tripApi, TripPreferences } from '../services/api'
import {
  Sparkles,
  Send,
  Loader2,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Heart,
  Plane,
  Hotel,
  Utensils,
  Camera,
  Mountain,
  Music,
  ShoppingBag,
  Landmark,
} from 'lucide-react'

const interestOptions = [
  { id: 'food', label: 'Food & Dining', icon: Utensils },
  { id: 'culture', label: 'Culture & History', icon: Landmark },
  { id: 'nature', label: 'Nature & Outdoors', icon: Mountain },
  { id: 'nightlife', label: 'Nightlife', icon: Music },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'photography', label: 'Photography', icon: Camera },
]

const suggestedPrompts = [
  "Plan a 5-day trip to Tokyo for 2 people in March. We love food and technology!",
  "Weekend getaway to Paris, focusing on art museums and romantic dinners",
  "Adventure trip to New Zealand for 10 days, interested in hiking and nature",
  "Family vacation to Orlando with 2 kids, theme parks and beach activities",
]

export default function TripPlanner() {
  const navigate = useNavigate()
  const [tripRequest, setTripRequest] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<TripPreferences>({
    travelersCount: 2,
    interests: [],
    accommodationType: 'mid-range',
    travelStyle: 'moderate',
  })
  const [aiResponse, setAiResponse] = useState<{
    message: string
    tripId?: string
    suggestions?: string[]
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tripRequest.trim()) return

    setIsProcessing(true)
    setAiResponse(null)

    try {
      const response = await tripApi.createTripRequest(tripRequest, preferences)
      setAiResponse({
        message: response.message || "Great! I've analyzed your trip request and created an initial itinerary.",
        tripId: response.tripId,
        suggestions: response.suggestions,
      })
      
      // Auto-navigate to itinerary page after a short delay
      if (response.tripId) {
        setTimeout(() => {
          navigate(`/itinerary/${response.tripId}`)
        }, 2000)
      }
    } catch (error: any) {
      console.error('Trip planning error:', error)
      // Show user-friendly error message
      const errorMessage = error?.message || 'Unable to process your trip request at the moment'
      setAiResponse({
        message: `Sorry, I'm unable to process your trip request at the moment. Please try again in a few moments.`,
        tripId: null,
        suggestions: [
          'Check your internet connection',
          'Try again in a few moments',
          'If the problem persists, contact support',
        ],
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleInterest = (interestId: string) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests?.includes(interestId)
        ? prev.interests.filter((i) => i !== interestId)
        : [...(prev.interests || []), interestId],
    }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">AI-Powered Trip Planning</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-earth-800 mb-2">
          Where To Next?
        </h1>
        <p className="text-earth-500 max-w-xl mx-auto">
          Describe your dream trip in detail, and our AI will create a complete itinerary
          with flights, hotels, and activities.
        </p>
      </motion.div>

      {/* Main Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card mb-6"
      >
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={tripRequest}
              onChange={(e) => setTripRequest(e.target.value)}
              placeholder="Describe your ideal trip... e.g., 'Plan a 5-day trip to Tokyo for 2 people in March. We love food and technology!'"
              className="w-full min-h-[150px] p-4 pr-14 rounded-xl bg-earth-50/50 border border-earth-200
                       focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20
                       outline-none transition-all resize-none text-earth-700 placeholder:text-earth-400"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={isProcessing || !tripRequest.trim()}
              className="absolute bottom-4 right-4 w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600
                       rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30
                       hover:shadow-xl hover:shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed
                       transform hover:-translate-y-0.5 transition-all"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>

        {/* Suggested Prompts */}
        {!tripRequest && !aiResponse && (
          <div className="mt-4">
            <p className="text-sm text-earth-500 mb-3">Try one of these:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setTripRequest(prompt)}
                  className="text-sm px-3 py-2 bg-earth-100 hover:bg-primary-100 text-earth-600
                           hover:text-primary-700 rounded-lg transition-colors text-left"
                >
                  {prompt.length > 60 ? prompt.slice(0, 60) + '...' : prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Preferences Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <button
          onClick={() => setShowPreferences(!showPreferences)}
          className="flex items-center gap-2 text-earth-600 hover:text-primary-600 transition-colors"
        >
          <Heart className="w-4 h-4" />
          <span className="text-sm font-medium">
            {showPreferences ? 'Hide preferences' : 'Add trip preferences'}
          </span>
        </button>

        <AnimatePresence>
          {showPreferences && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card mt-4 overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Travelers */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-earth-700 mb-3">
                    <Users className="w-4 h-4" />
                    Number of Travelers
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, '5+'].map((num) => (
                      <button
                        key={num}
                        onClick={() =>
                          setPreferences((p) => ({ ...p, travelersCount: typeof num === 'number' ? num : 5 }))
                        }
                        className={`w-12 h-12 rounded-xl font-medium transition-all
                                  ${
                                    preferences.travelersCount === (typeof num === 'number' ? num : 5)
                                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                      : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
                                  }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-earth-700 mb-3">
                    <DollarSign className="w-4 h-4" />
                    Accommodation Type
                  </label>
                  <div className="flex gap-2">
                    {['budget', 'mid-range', 'luxury'].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setPreferences((p) => ({
                            ...p,
                            accommodationType: type as 'budget' | 'mid-range' | 'luxury',
                          }))
                        }
                        className={`px-4 py-2 rounded-xl font-medium capitalize transition-all
                                  ${
                                    preferences.accommodationType === type
                                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                      : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
                                  }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-earth-700 mb-3">
                    <Heart className="w-4 h-4" />
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => {
                      const isSelected = preferences.interests?.includes(interest.id)
                      return (
                        <button
                          key={interest.id}
                          onClick={() => toggleInterest(interest.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
                                    ${
                                      isSelected
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                        : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
                                    }`}
                        >
                          <interest.icon className="w-4 h-4" />
                          {interest.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Travel Style */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-earth-700 mb-3">
                    <Calendar className="w-4 h-4" />
                    Travel Style
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: 'relaxed', label: 'Relaxed', desc: 'Plenty of free time' },
                      { id: 'moderate', label: 'Moderate', desc: 'Balanced schedule' },
                      { id: 'packed', label: 'Packed', desc: 'See everything!' },
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() =>
                          setPreferences((p) => ({
                            ...p,
                            travelStyle: style.id as 'relaxed' | 'moderate' | 'packed',
                          }))
                        }
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all text-left
                                  ${
                                    preferences.travelStyle === style.id
                                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                      : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
                                  }`}
                      >
                        <div>{style.label}</div>
                        <div className={`text-xs ${preferences.travelStyle === style.id ? 'text-white/70' : 'text-earth-400'}`}>
                          {style.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* AI Response */}
      <AnimatePresence>
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl
                           flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-earth-700 mb-4">{aiResponse.message}</p>

                {aiResponse.suggestions && aiResponse.suggestions.length > 0 && (
                  <div className="bg-primary-50 rounded-xl p-4 mb-4">
                    <h4 className="font-medium text-primary-800 mb-2">AI Suggestions:</h4>
                    <ul className="space-y-2">
                      {aiResponse.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-primary-700">
                          <span className="text-primary-500 mt-1">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/itinerary/${aiResponse.tripId}`)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    View Itinerary
                  </button>
                  <button className="btn-secondary flex items-center gap-2">
                    <Plane className="w-4 h-4" />
                    View Flights
                  </button>
                  <button className="btn-secondary flex items-center gap-2">
                    <Hotel className="w-4 h-4" />
                    View Hotels
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Animation */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="card max-w-sm text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full
                           flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold text-earth-800 mb-2">
                Creating Your Itinerary
              </h3>
              <p className="text-earth-500 text-sm">
                Our AI is analyzing your request and finding the best options...
              </p>
              <div className="flex justify-center gap-1 mt-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                    className="w-2 h-2 bg-primary-500 rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

