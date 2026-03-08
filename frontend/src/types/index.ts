export interface TarotCard {
  id: string
  arcana_type: string
  number?: number
  name: string
  korean_name: string
  suit?: string
  rank?: string
  keywords: string
  visual_elements: string
  upright_meaning: string
  reversed_meaning: string
}

export interface SelectedCard {
  card: TarotCard
  isReversed: boolean
}

export function toApiPayload(selected: SelectedCard) {
  return {
    id: selected.card.id,
    name: selected.card.name,
    korean_name: selected.card.korean_name,
    orientation: selected.isReversed ? 'reversed' : 'upright',
    meaning: selected.isReversed
      ? selected.card.reversed_meaning
      : selected.card.upright_meaning,
    keywords: selected.card.keywords,
    visual_elements: selected.card.visual_elements,
  }
}

export interface Persona {
  id: string
  nameKo: string
  nameEn: string
  color: string        // hex color string
  description: string
  greetings: Record<string, string>
  imagePaths: string[]
}

export interface FortuneCategory {
  id: string
  labels: Record<string, string>
  icon: string
  cardCount: number
}

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

export type Language = 'ko' | 'en' | 'zh' | 'th'
