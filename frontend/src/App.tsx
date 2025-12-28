import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TripPlanner from './pages/TripPlanner'
import ItineraryPage from './pages/ItineraryPage'
import DashboardPage from './pages/DashboardPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/plan"
        element={
          <ProtectedRoute>
            <Layout>
              <TripPlanner />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/itinerary/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ItineraryPage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App


