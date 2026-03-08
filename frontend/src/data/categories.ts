import type { FortuneCategory } from '@/types'

export const CATEGORIES: FortuneCategory[] = [
  {
    id: 'general',
    labels: { ko: '종합운', en: 'General', zh: '综合运', th: 'ดวงรวม' },
    icon: '✨',
    cardCount: 5,
  },
  {
    id: 'wealth',
    labels: { ko: '재물운', en: 'Wealth', zh: '财运', th: 'ดวงการเงิน' },
    icon: '💰',
    cardCount: 4,
  },
  {
    id: 'love',
    labels: { ko: '연애운', en: 'Love', zh: '爱情运', th: 'ดวงความรัก' },
    icon: '💕',
    cardCount: 3,
  },
  {
    id: 'marriage',
    labels: { ko: '결혼운', en: 'Marriage', zh: '婚姻运', th: 'ดวงการแต่งงาน' },
    icon: '💍',
    cardCount: 5,
  },
  {
    id: 'career',
    labels: { ko: '직업운', en: 'Career', zh: '事业运', th: 'ดวงการงาน' },
    icon: '💼',
    cardCount: 4,
  },
  {
    id: 'education',
    labels: { ko: '학업운', en: 'Education', zh: '学业运', th: 'ดวงการเรียน' },
    icon: '📚',
    cardCount: 3,
  },
  {
    id: 'health',
    labels: { ko: '건강운', en: 'Health', zh: '健康运', th: 'ดวงสุขภาพ' },
    icon: '🌿',
    cardCount: 4,
  },
  {
    id: 'relationship',
    labels: {
      ko: '인간관계운',
      en: 'Relationships',
      zh: '人际关系运',
      th: 'ดวงความสัมพันธ์',
    },
    icon: '🤝',
    cardCount: 4,
  },
]
