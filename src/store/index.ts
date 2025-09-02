import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  participants: number
  maxParticipants: number
  category: string
}

interface AppState {
  user: User | null
  events: Event[]
  favorites: string[]
  joinedEvents: string[]
  
  // Actions
  setUser: (user: User | null) => void
  addEvent: (event: Event) => void
  removeEvent: (eventId: string) => void
  toggleFavorite: (eventId: string) => void
  joinEvent: (eventId: string) => void
  leaveEvent: (eventId: string) => void
  clearStore: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      events: [],
      favorites: [],
      joinedEvents: [],
      
      setUser: (user) => set({ user }),
      
      addEvent: (event) => set((state) => ({
        events: [...state.events, event]
      })),
      
      removeEvent: (eventId) => set((state) => ({
        events: state.events.filter(event => event.id !== eventId)
      })),
      
      toggleFavorite: (eventId) => set((state) => ({
        favorites: state.favorites.includes(eventId)
          ? state.favorites.filter(id => id !== eventId)
          : [...state.favorites, eventId]
      })),
      
      joinEvent: (eventId) => set((state) => ({
        joinedEvents: state.joinedEvents.includes(eventId)
          ? state.joinedEvents
          : [...state.joinedEvents, eventId]
      })),
      
      leaveEvent: (eventId) => set((state) => ({
        joinedEvents: state.joinedEvents.filter(id => id !== eventId)
      })),
      
      clearStore: () => set({
        user: null,
        events: [],
        favorites: [],
        joinedEvents: [],
      }),
    }),
    {
      name: 'ya-v-dele-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        joinedEvents: state.joinedEvents,
      }),
    }
  )
)
