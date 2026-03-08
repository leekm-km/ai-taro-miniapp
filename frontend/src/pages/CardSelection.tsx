import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/store/AppContext'
import type { TarotCard, SelectedCard } from '@/types'
import tarotCards from '@/data/tarot_cards.json'

// 부채꼴 카드 배치 계산 (Flutter 로직 그대로)
function getCardTransform(index: number, total: number) {
  const maxAngle = 45
  const angleStep = total > 1 ? (maxAngle * 2) / (total - 1) : 0
  const angle = -maxAngle + index * angleStep
  const radius = 320
  const rad = (angle * Math.PI) / 180
  const x = radius * Math.sin(rad)
  const y = radius * (1 - Math.cos(rad)) * 0.3
  return { angle, x, y }
}

const CARD_WIDTH = 60
const CARD_HEIGHT = 96

export default function CardSelection() {
  const navigate = useNavigate()
  const { language, persona, category, setSelectedCards } = useApp()
  const [displayCards, setDisplayCards] = useState<TarotCard[]>([])
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set())
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const allCards = useMemo(() => tarotCards as TarotCard[], [])
  const requiredCount = category?.cardCount ?? 3

  useEffect(() => {
    if (!persona || !category) { navigate('/'); return }
    // 78장 중 16장 랜덤 선택
    const shuffled = [...allCards].sort(() => Math.random() - 0.5)
    setDisplayCards(shuffled.slice(0, 16))
  }, [allCards, persona, category, navigate])

  const handleCardClick = (index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else if (next.size < requiredCount) {
        next.add(index)
      }
      return next
    })
  }

  const handleConfirm = () => {
    const selected: SelectedCard[] = Array.from(selectedIndices).map((i) => ({
      card: displayCards[i],
      isReversed: Math.random() < 0.3,
    }))
    setSelectedCards(selected)
    navigate('/card-reveal')
  }

  const selectedCount = selectedIndices.size

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--bg-dark)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* 헤더 */}
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <div className="page-title" style={{ marginBottom: 4 }}>카드를 선택하세요</div>
        <div className="page-subtitle" style={{ marginBottom: 0 }}>
          {selectedCount} / {requiredCount}장 선택됨
        </div>
      </div>

      {/* 부채꼴 카드 영역 */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 40,
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: 280 }}>
          {displayCards.map((card, index) => {
            const { angle, x, y } = getCardTransform(index, displayCards.length)
            const isSelected = selectedIndices.has(index)
            const isHovered = hoveredIndex === index

            return (
              <motion.div
                key={card.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: index * 0.04,
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                }}
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${x}px - ${CARD_WIDTH / 2}px)`,
                  bottom: `${-y + (isHovered || isSelected ? 15 : 0)}px`,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  transform: `rotate(${angle}deg)`,
                  cursor: 'pointer',
                  zIndex: isSelected || isHovered ? 50 + index : index,
                  transition: 'bottom 0.2s ease',
                }}
                onClick={() => handleCardClick(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 8,
                    border: `${isSelected ? 3 : isHovered ? 2 : 1.5}px solid ${
                      isSelected
                        ? persona?.color ?? 'var(--accent-gold)'
                        : isHovered
                        ? 'rgba(255,255,255,0.6)'
                        : 'rgba(255,255,255,0.2)'
                    }`,
                    background: isSelected
                      ? `linear-gradient(135deg, ${persona?.color ?? '#6d235c'}, #2a0a20)`
                      : 'linear-gradient(135deg, #1a1040, #0d0d2a)',
                    boxShadow: isSelected
                      ? `0 0 16px ${persona?.color ?? '#6d235c'}88, 0 4px 12px rgba(0,0,0,0.5)`
                      : isHovered
                      ? '0 8px 20px rgba(0,0,0,0.5)'
                      : '0 4px 8px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    transition: 'all 0.2s',
                  }}
                >
                  {isSelected ? '✓' : '🌙'}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 하단 버튼 */}
      <AnimatePresence>
        {selectedCount === requiredCount && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            style={{ padding: '16px' }}
          >
            <button className="btn-primary" onClick={handleConfirm}>
              {language === 'ko' && '카드 공개하기 ✨'}
              {language === 'en' && 'Reveal Cards ✨'}
              {language === 'zh' && '揭示牌 ✨'}
              {language === 'th' && 'เปิดเผยไพ่ ✨'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
