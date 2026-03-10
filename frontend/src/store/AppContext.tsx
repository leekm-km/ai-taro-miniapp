import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import type {
  Persona,
  FortuneCategory,
  SelectedCard,
  ConversationMessage,
  Language,
} from '@/types'

interface AppState {
  language: Language
  persona: Persona | null
  category: FortuneCategory | null
  question: string
  selectedCards: SelectedCard[]
  reading: string
  conversationHistory: ConversationMessage[]
  usedImages: string[]
  followUpQuestion: string
  followUpCards: SelectedCard[]
  followUpReading: string
  followUpMode: boolean
}

interface AppContextValue extends AppState {
  setLanguage: (lang: Language) => void
  setPersona: (persona: Persona) => void
  setCategory: (category: FortuneCategory) => void
  setQuestion: (question: string) => void
  setSelectedCards: (cards: SelectedCard[]) => void
  setReading: (reading: string) => void
  addConversation: (msg: ConversationMessage) => void
  addUsedImage: (path: string) => void
  setFollowUpQuestion: (q: string) => void
  setFollowUpCards: (cards: SelectedCard[]) => void
  setFollowUpReading: (r: string) => void
  setFollowUpMode: (mode: boolean) => void
  reset: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

const initialState: AppState = {
  language: 'ko',
  persona: null,
  category: null,
  question: '',
  selectedCards: [],
  reading: '',
  conversationHistory: [],
  usedImages: [],
  followUpQuestion: '',
  followUpCards: [],
  followUpReading: '',
  followUpMode: false,
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState)

  const setLanguage = (lang: Language) =>
    setState((s) => ({ ...s, language: lang }))
  const setPersona = (persona: Persona) =>
    setState((s) => ({ ...s, persona, usedImages: [] }))
  const setCategory = (category: FortuneCategory) =>
    setState((s) => ({ ...s, category }))
  const setQuestion = (question: string) =>
    setState((s) => ({ ...s, question }))
  const setSelectedCards = (selectedCards: SelectedCard[]) =>
    setState((s) => ({ ...s, selectedCards }))
  const setReading = (reading: string) =>
    setState((s) => ({ ...s, reading }))
  const addConversation = (msg: ConversationMessage) =>
    setState((s) => ({
      ...s,
      conversationHistory: [...s.conversationHistory, msg],
    }))
  const addUsedImage = (path: string) =>
    setState((s) => ({ ...s, usedImages: [...s.usedImages, path] }))
  const setFollowUpQuestion = (followUpQuestion: string) =>
    setState((s) => ({ ...s, followUpQuestion }))
  const setFollowUpCards = (followUpCards: SelectedCard[]) =>
    setState((s) => ({ ...s, followUpCards }))
  const setFollowUpReading = (followUpReading: string) =>
    setState((s) => ({ ...s, followUpReading }))
  const setFollowUpMode = (followUpMode: boolean) =>
    setState((s) => ({ ...s, followUpMode }))
  const reset = () => setState(initialState)

  return (
    <AppContext.Provider
      value={{
        ...state,
        setLanguage,
        setPersona,
        setCategory,
        setQuestion,
        setSelectedCards,
        setReading,
        addConversation,
        addUsedImage,
        setFollowUpQuestion,
        setFollowUpCards,
        setFollowUpReading,
        setFollowUpMode,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
