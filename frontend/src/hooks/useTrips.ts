import { useState, useEffect, useCallback } from 'react'
import { tripApi, Trip, TripPreferences } from '../services/api'

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrips = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await tripApi.getTrips()
      setTrips(data)
    } catch (err) {
      setError('Failed to fetch trips')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  const createTrip = async (request: string, preferences?: TripPreferences) => {
    try {
      const response = await tripApi.createTripRequest(request, preferences)
      // Refresh trips list
      await fetchTrips()
      return response
    } catch (err) {
      setError('Failed to create trip')
      throw err
    }
  }

  const deleteTrip = async (id: string) => {
    try {
      await tripApi.deleteTrip(id)
      setTrips((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError('Failed to delete trip')
      throw err
    }
  }

  return {
    trips,
    isLoading,
    error,
    fetchTrips,
    createTrip,
    deleteTrip,
  }
}

export function useTrip(id: string | undefined) {
  const [trip, setTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      return
    }

    const fetchTrip = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await tripApi.getTrip(id)
        setTrip(data)
      } catch (err) {
        setError('Failed to fetch trip')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrip()
  }, [id])

  const updateTrip = async (data: Partial<Trip>) => {
    if (!id) return
    try {
      const updated = await tripApi.updateTrip(id, data)
      setTrip(updated)
      return updated
    } catch (err) {
      setError('Failed to update trip')
      throw err
    }
  }

  return {
    trip,
    isLoading,
    error,
    updateTrip,
  }
}


