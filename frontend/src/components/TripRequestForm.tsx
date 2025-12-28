import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, Sparkles, MapPin, Calendar, Users } from 'lucide-react'

interface TripRequestFormProps {
  onSubmit: (request: string) => Promise<void>
  isLoading?: boolean
}

const quickDestinations = [
  { name: 'Tokyo', emoji: '🗼', country: 'Japan' },
  { name: 'Paris', emoji: '🗼', country: 'France' },
  { name: 'New York', emoji: '🗽', country: 'USA' },
  { name: 'Bali', emoji: '🏝️', country: 'Indonesia' },
  { name: 'Rome', emoji: '🏛️', country: 'Italy' },
  { name: 'Sydney', emoji: '🦘', country: 'Australia' },
]

export default function TripRequestForm({ onSubmit, isLoading = false }: TripRequestFormProps) {
  const [request, setRequest] = useState('')
  const [quickMode, setQuickMode] = useState(false)
  const [quickData, setQuickData] = useState({
    destination: '',
    duration: 5,
    travelers: 2,
    interests: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (quickMode) {
      const formattedRequest = `Plan a ${quickData.duration}-day trip to ${quickData.destination} for ${quickData.travelers} people. ${
        quickData.interests.length > 0 ? `We're interested in ${quickData.interests.join(', ')}.` : ''
      }`
      await onSubmit(formattedRequest)
    } else {
      await onSubmit(request)
    }
  }

  const selectDestination = (dest: typeof quickDestinations[0]) => {
    setQuickData((prev) => ({ ...prev, destination: `${dest.name}, ${dest.country}` }))
  }

  const toggleInterest = (interest: string) => {
    setQuickData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const interests = ['Food & Dining', 'Culture', 'Adventure', 'Relaxation', 'Shopping', 'Nightlife', 'Nature', 'Photography']

  return (
    <div className="card">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setQuickMode(false)}
          className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all
                    ${!quickMode ? 'bg-primary-500 text-white' : 'bg-earth-100 text-earth-600 hover:bg-earth-200'}`}
        >
          <Sparkles className="w-4 h-4 inline mr-2" />
          Natural Language
        </button>
        <button
          type="button"
          onClick={() => setQuickMode(true)}
          className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all
                    ${quickMode ? 'bg-primary-500 text-white' : 'bg-earth-100 text-earth-600 hover:bg-earth-200'}`}
        >
          <MapPin className="w-4 h-4 inline mr-2" />
          Quick Select
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {!quickMode ? (
          /* Natural Language Input */
          <div className="relative">
            <textarea
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="Describe your ideal trip in detail... e.g., 'I want to plan a romantic 5-day trip to Paris for my anniversary in June. We love art, fine dining, and exploring hidden gems. Budget around $4000.'"
              className="w-full min-h-[160px] p-4 pr-14 rounded-xl bg-earth-50/50 border border-earth-200
                       focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20
                       outline-none transition-all resize-none text-earth-700 placeholder:text-earth-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !request.trim()}
              className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600
                       rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30
                       hover:shadow-xl hover:shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed
                       transform hover:-translate-y-0.5 transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        ) : (
          /* Quick Select Mode */
          <div className="space-y-6">
            {/* Destination Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-earth-700 mb-3">
                <MapPin className="w-4 h-4" />
                Where do you want to go?
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {quickDestinations.map((dest) => (
                  <motion.button
                    key={dest.name}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => selectDestination(dest)}
                    className={`p-3 rounded-xl text-center transition-all
                              ${
                                quickData.destination.includes(dest.name)
                                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                  : 'bg-earth-100 text-earth-700 hover:bg-earth-200'
                              }`}
                  >
                    <div className="text-2xl mb-1">{dest.emoji}</div>
                    <div className="text-sm font-medium">{dest.name}</div>
                  </motion.button>
                ))}
              </div>
              <input
                type="text"
                value={quickData.destination}
                onChange={(e) => setQuickData((prev) => ({ ...prev, destination: e.target.value }))}
                placeholder="Or type a destination..."
                className="w-full mt-3 px-4 py-2 rounded-xl bg-white border border-earth-200
                         focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none"
              />
            </div>

            {/* Duration & Travelers */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-earth-700 mb-3">
                  <Calendar className="w-4 h-4" />
                  Duration (days)
                </label>
                <div className="flex gap-2">
                  {[3, 5, 7, 10, 14].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setQuickData((prev) => ({ ...prev, duration: days }))}
                      className={`flex-1 py-2 rounded-xl font-medium transition-all
                                ${
                                  quickData.duration === days
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
                                }`}
                    >
                      {days}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-earth-700 mb-3">
                  <Users className="w-4 h-4" />
                  Travelers
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, '5+'].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() =>
                        setQuickData((prev) => ({ ...prev, travelers: typeof num === 'number' ? num : 5 }))
                      }
                      className={`flex-1 py-2 rounded-xl font-medium transition-all
                                ${
                                  quickData.travelers === (typeof num === 'number' ? num : 5)
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
                                }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="text-sm font-medium text-earth-700 mb-3 block">
                What are you interested in?
              </label>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full font-medium transition-all
                              ${
                                quickData.interests.includes(interest)
                                  ? 'bg-primary-500 text-white'
                                  : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
                              }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !quickData.destination}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Plan My Trip
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}


