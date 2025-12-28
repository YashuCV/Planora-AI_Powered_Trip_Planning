import { format, parseISO, differenceInDays } from 'date-fns'

export function formatDate(date: string | Date, formatStr: string = 'MMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = parseISO(startDate)
  const end = parseISO(endDate)
  
  const startMonth = format(start, 'MMM')
  const endMonth = format(end, 'MMM')
  
  if (startMonth === endMonth) {
    return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`
  }
  
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) {
    return `${mins}m`
  }
  
  if (mins === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${mins}m`
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatTripDuration(startDate: string, endDate: string): string {
  const days = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1
  return `${days} day${days !== 1 ? 's' : ''}`
}

export function formatTravelersCount(count: number): string {
  if (count === 1) return '1 traveler'
  return `${count} travelers`
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}


