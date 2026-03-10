import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/store/AppContext'
import type { TarotCard, SelectedCard } from '@/types'
import tarotCardsData from '@/data/tarot_cards.json'
import { getCardImagePath } from '@/data/cardImages'

// 부채꼴 카드 배치 계산
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
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set())

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
        setFlippedIndices((f) => {
          const nf = new Set(f)
          nf.delete(index)
          return nf
        })
      } else if (next.size < requiredCount) {
        next.add(index)
        setFlippedIndices((f) => new Set([...f, index]))
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
            const isFlipped = flippedIndices.has(index)
            const cardImagePath = getCardImagePath(card.id)

            return (
              <div
                key={card.id}
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${x}px - ${CARD_WIDTH / 2}px)`,
                  top: `${y + 80}px`,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  // 부채꼴 회전은 CSS에서만 처리
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: 'bottom center',
                  zIndex: isSelected ? 100 + index : index,
                }}
              >
                {/* 등장 + 선택 시 들어올리기 애니메이션 */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    y: isSelected ? -20 : 0,
                  }}
                  transition={{
                    scale: {
                      delay: index * 0.04,
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                    },
                    opacity: {
                      delay: index * 0.04,
                      duration: 0.3,
                    },
                    y: {
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                    },
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                    // perspective는 flip 부모에 설정
                    perspective: 500,
                  }}
                  onClick={() => handleCardClick(index)}
                >
                  {/* 3D flip 컨테이너 */}
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* 카드 뒷면 */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        borderRadius: 8,
                        border: '1.5px solid rgba(255,255,255,0.2)',
                        background: 'linear-gradient(135deg, #1a1040, #0d0d2a)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                      }}
                    >
                      🌙
                    </div>

                    {/* 카드 앞면 (이미지) */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        borderRadius: 8,
                        border: `2px solid ${persona?.color ?? 'var(--accent-gold)'}`,
                        background: `linear-gradient(135deg, ${persona?.color ?? '#6d235c'}33, #0d0d1a)`,
                        overflow: 'hidden',
                        boxShadow: `0 0 14px ${persona?.color ?? '#6d235c'}99, 0 6px 14px rgba(0,0,0,0.5)`,
                      }}
                    >
                      {cardImagePath ? (
                        <img
                          src={cardImagePath}
                          alt={card.korean_name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 22,
                          }}
                        >
                          🔮
                        </div>
                      )}
                    </div>
                  </motion.div>
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
