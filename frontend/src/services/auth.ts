import api from './api'

export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password })
    // Backend returns { user, token } directly
    return response.data
  },

  async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      fullName,
    })
    // Backend returns { user, token } directly
    return response.data
  },

  async loginWithGoogle(): Promise<AuthResponse> {
    // In a real implementation, this would handle the OAuth flow
    // For now, we'll simulate it with a popup or redirect
    return new Promise((resolve) => {
      // Simulate Google OAuth
      const mockUser: User = {
        id: 'google-user-123',
        email: 'user@gmail.com',
        fullName: 'Google User',
      }
      resolve({
        user: mockUser,
        token: 'mock-google-jwt-token',
      })
    })
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<User>('/auth/profile', data)
    return response.data
  },
}

