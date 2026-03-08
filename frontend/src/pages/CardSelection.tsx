import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/store/AppContext'
import type { TarotCard, SelectedCard } from '@/types'
import tarotCardsData from '@/data/tarot_cards.json'

// 부채꼴 카드 배치 계산 (Flutter 로직 그대로)
// Flutter: x = radius * sin(rad), y = 80 + radius*(1-cos(rad))
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

  const allCards = useMemo(() => (tarotCardsData as { cards: TarotCard[] }).cards, [])
  const requiredCount = category?.cardCount ?? 3

  useEffect(() => {
    if (!persona || !category) { navigate('/'); return }
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
        <div style={{ position: 'relative', width: '100%', height: 300 }}>
          {displayCards.map((card, index) => {
            const { angle, x, y } = getCardTransform(index, displayCards.length)
            const isSelected = selectedIndices.has(index)
            const isHovered = hoveredIndex === index
            const isLifted = isSelected || isHovered

            // ★ 핵심 수정: rotation은 외부 div(CSS)에서 처리
            //   scale/opacity/translateY는 motion.div(Framer Motion)에서 처리
            //   → CSS transform과 Framer Motion transform 충돌 방지
            return (
              <div
                key={card.id}
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${x}px - ${CARD_WIDTH / 2}px)`,
                  top: `${y + 80}px`,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  // rotation은 여기서만 CSS로 처리
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: 'bottom center',
                  zIndex: isSelected || isHovered ? 50 + index : index,
                }}
              >
                <motion.div
                  // Flutter: easeOutBack 커브 재현 → spring with overshoot
                  initial={{ scale: 0, opacity: 0, y: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    // Flutter의 hover: translate(0, -15)
                    y: isLifted ? -15 : 0,
                  }}
                  transition={{
                    scale: {
                      delay: index * 0.04,         // Flutter: delay = index * 0.04
                      type: 'spring',
                      stiffness: 300,              // Flutter easeOutBack과 유사한 overshoot
                      damping: 15,
                      mass: 0.8,
                    },
                    opacity: {
                      delay: index * 0.04,
                      duration: 0.25,
                    },
                    y: {
                      // hover/select 시 빠른 반응
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                    },
                  }}
                  style={{ width: '100%', height: '100%', cursor: 'pointer' }}
                  onClick={() => handleCardClick(index)}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                >
                  {/* 카드 본체 */}
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 8,
                      border: `${isSelected ? 3 : isHovered ? 2 : 1.5}px solid ${
                        isSelected
                          ? (persona?.color ?? 'var(--accent-gold)')
                          : isHovered
                          ? 'rgba(255,255,255,0.6)'
                          : 'rgba(255,255,255,0.2)'
                      }`,
                      background: isSelected
                        ? `linear-gradient(135deg, ${persona?.color ?? '#6d235c'}, #2a0a20)`
                        : 'linear-gradient(135deg, #1a1040, #0d0d2a)',
                      boxShadow: isSelected
                        ? `0 0 18px ${persona?.color ?? '#6d235c'}99, 0 6px 16px rgba(0,0,0,0.6)`
                        : isHovered
                        ? '0 10px 24px rgba(0,0,0,0.6)'
                        : '0 4px 8px rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      // ★ transition은 border/background/shadow 등 비-transform 속성만
                      transition: 'border 0.15s, background 0.15s, box-shadow 0.15s',
                    }}
                  >
                    {isSelected ? '✓' : '🌙'}
                  </div>
                </motion.div>
              </div>
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
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
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
