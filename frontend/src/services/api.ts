import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

// Backend API for authentication and core features
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Note: n8n is no longer used - all functionality moved to backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Check if response contains an error field
    if (response.data && typeof response.data === 'object' && response.data.error) {
      const error = new Error(response.data.message || 'An error occurred')
      ;(error as any).response = {
        ...response,
        status: response.status || 400,
        data: response.data
      }
      return Promise.reject(error)
    }
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Trip-related API calls (using backend with Grok API)
export const tripApi = {
  async createTripRequest(request: string, preferences?: TripPreferences) {
    // Use backend API for trip creation (uses Grok API)
    const response = await api.post('/trips', { request, preferences })
    return response.data
  },

  async getTrips() {
    const response = await api.get('/trips')
    return response.data
  },

  async getTrip(id: string) {
    const response = await api.get(`/trips/${id}`)
    return response.data
  },

  async updateTrip(id: string, data: Partial<Trip>) {
    const response = await api.put(`/trips/${id}`, data)
    return response.data
  },

  async deleteTrip(id: string) {
    const response = await api.delete(`/trips/${id}`)
    return response.data
  },
}

// Itinerary API calls
export const itineraryApi = {
  async getItinerary(tripId: string) {
    const response = await api.get(`/itinerary/${tripId}`)
    return response.data
  },

  async regenerateItinerary(tripId: string, feedback?: string) {
    const response = await api.post(`/itinerary/${tripId}/regenerate`, { feedback })
    return response.data
  },

  async updateItineraryItem(tripId: string, itemId: string, data: Partial<ItineraryItem>) {
    const response = await api.put(`/itinerary/${tripId}/items/${itemId}`, data)
    return response.data
  },
}

// Booking API calls
export const bookingApi = {
  async searchFlights(params: FlightSearchParams) {
    const response = await api.post('/search-flights', params)
    return response.data
  },

  async searchHotels(params: HotelSearchParams) {
    const response = await api.post('/search-hotels', params)
    return response.data
  },

  async searchActivities(params: ActivitySearchParams) {
    const response = await api.post('/search-activities', params)
    return response.data
  },

  async createBooking(bookingData: BookingRequest) {
    const response = await api.post('/book', bookingData)
    return response.data
  },

  async getBookings(tripId: string) {
    const response = await api.get(`/bookings/${tripId}`)
    return response.data
  },

  async cancelBooking(bookingId: string) {
    const response = await api.delete(`/bookings/${bookingId}`)
    return response.data
  },
}

// Calendar API calls
export const calendarApi = {
  async syncToCalendar(tripId: string) {
    const response = await api.post('/calendar-sync', { tripId })
    return response.data
  },

  async getSyncStatus(tripId: string) {
    const response = await api.get(`/calendar-sync/status/${tripId}`)
    return response.data
  },

  async disconnectCalendar() {
    const response = await api.post('/calendar/disconnect')
    return response.data
  },
}

// Places API calls
export const placesApi = {
  async searchPlaces(query: string, location?: { lat: number; lng: number }) {
    const response = await api.post('/search-places', { query, location })
    return response.data
  },

  async getPlaceDetails(placeId: string) {
    const response = await api.get(`/places/${placeId}`)
    return response.data
  },
}

// Types
export interface TripPreferences {
  budget?: { min: number; max: number }
  travelersCount?: number
  interests?: string[]
  accommodationType?: 'budget' | 'mid-range' | 'luxury'
  travelStyle?: 'relaxed' | 'moderate' | 'packed'
}

export interface Trip {
  id: string
  userId: string
  title: string
  description?: string
  originalRequest: string
  status: 'planning' | 'booked' | 'completed' | 'cancelled'
  startDate?: string
  endDate?: string
  destinations: Destination[]
  travelersCount: number
  budgetMin?: number
  budgetMax?: number
  preferences: TripPreferences
  createdAt: string
  updatedAt: string
}

export interface Destination {
  name: string
  country: string
  startDate: string
  endDate: string
}

export interface ItineraryItem {
  id: string
  dayNumber: number
  time: string
  type: 'flight' | 'hotel' | 'activity' | 'meal' | 'transportation' | 'free-time'
  title: string
  description: string
  location?: string
  duration?: number
  price?: number
  bookingStatus?: 'pending' | 'booked' | 'confirmed'
  bookingId?: string
}

export interface Itinerary {
  id: string
  tripId: string
  version: number
  status: 'draft' | 'confirmed' | 'modified'
  items: ItineraryItem[]
  totalCost?: number
  aiSuggestions?: Record<string, string>
}

export interface FlightSearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass?: 'economy' | 'business' | 'first'
}

export interface HotelSearchParams {
  location: string
  checkIn: string
  checkOut: string
  guests: number
  rooms?: number
  starRating?: number[]
}

export interface ActivitySearchParams {
  location: string
  date: string
  category?: string
  priceRange?: { min: number; max: number }
}

export interface BookingRequest {
  tripId: string
  type: 'flight' | 'hotel' | 'activity'
  providerId: string
  details: Record<string, unknown>
}

export default api

