import { useState, useEffect, useCallback } from 'react'
import { itineraryApi, calendarApi, Itinerary, ItineraryItem } from '../services/api'

export function useItinerary(tripId: string | undefined) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItinerary = useCallback(async () => {
    if (!tripId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const data = await itineraryApi.getItinerary(tripId)
      setItinerary(data)
    } catch (err) {
      setError('Failed to fetch itinerary')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    fetchItinerary()
  }, [fetchItinerary])

  const regenerateItinerary = async (feedback?: string) => {
    if (!tripId) return
    setIsLoading(true)
    try {
      const data = await itineraryApi.regenerateItinerary(tripId, feedback)
      setItinerary(data)
      return data
    } catch (err) {
      setError('Failed to regenerate itinerary')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateItem = async (itemId: string, data: Partial<ItineraryItem>) => {
    if (!tripId) return
    try {
      const updated = await itineraryApi.updateItineraryItem(tripId, itemId, data)
      setItinerary((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.id === itemId ? { ...item, ...data } : item
          ),
        }
      })
      return updated
    } catch (err) {
      setError('Failed to update item')
      throw err
    }
  }

  return {
    itinerary,
    isLoading,
    error,
    fetchItinerary,
    regenerateItinerary,
    updateItem,
  }
}

export function useCalendarSync(tripId: string | undefined) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const syncToCalendar = async () => {
    if (!tripId) return
    setIsSyncing(true)
    setSyncStatus('idle')
    setError(null)

    try {
      await calendarApi.syncToCalendar(tripId)
      setSyncStatus('success')
      setTimeout(() => setSyncStatus('idle'), 3000)
    } catch (err) {
      setSyncStatus('error')
      setError('Failed to sync to calendar')
      console.error(err)
    } finally {
      setIsSyncing(false)
    }
  }

  const checkSyncStatus = async () => {
    if (!tripId) return null
    try {
      return await calendarApi.getSyncStatus(tripId)
    } catch (err) {
      console.error(err)
      return null
    }
  }

  return {
    isSyncing,
    syncStatus,
    error,
    syncToCalendar,
    checkSyncStatus,
  }
}


