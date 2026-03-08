import type { SelectedCard, ConversationMessage } from '@/types'
import { toApiPayload } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export async function fetchTarotReading(params: {
  character: string
  language: string
  category: string
  question: string
  selectedCards: SelectedCard[]
}): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/tarot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      character: params.character,
      language: params.language,
      category: params.category,
      question: params.question,
      selected_cards: params.selectedCards.map(toApiPayload),
    }),
  })
  if (!res.ok) throw new Error(`API 오류: ${res.status}`)
  const data = await res.json()
  return data.reading as string
}

export async function fetchFollowUpReading(params: {
  character: string
  language: string
  category: string
  question: string
  selectedCards: SelectedCard[]
  conversationHistory: ConversationMessage[]
}): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/tarot/followup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      character: params.character,
      language: params.language,
      category: params.category,
      question: params.question,
      selected_cards: params.selectedCards.map(toApiPayload),
      conversation_history: params.conversationHistory,
    }),
  })
  if (!res.ok) throw new Error(`API 오류: ${res.status}`)
  const data = await res.json()
  return data.reading as string
}
