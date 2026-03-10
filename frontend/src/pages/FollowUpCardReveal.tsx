import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '@/store/AppContext'
import { getCardImagePath } from '@/data/cardImages'

export default function FollowUpCardReveal() {
  const navigate = useNavigate()
  const { persona, followUpCards } = useApp()
  const [flipped, setFlipped] = useState<boolean[]>([])
  const [revealedCount, setRevealedCount] = useState(0)
  const [allDone, setAllDone] = useState(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const startedRef = useRef(false)

  useEffect(() => {
    if (!persona || followUpCards.length === 0) { navigate('/result'); return }
    setFlipped(new Array(followUpCards.length).fill(false))
  }, [persona, followUpCards, navigate])

  useEffect(() => {
    if (flipped.length === 0) return
    if (startedRef.current) return
    startedRef.current = true

    let elapsed = 500
    for (let i = 0; i < followUpCards.length; i++) {
      const flipDelay = elapsed
      const countDelay = elapsed + 800
      const cardIndex = i
      const t1 = setTimeout(() => {
        setFlipped((prev) => { const next = [...prev]; next[cardIndex] = true; return next })
      }, flipDelay)
      const t2 = setTimeout(() => { setRevealedCount(cardIndex + 1) }, countDelay)
      timersRef.current.push(t1, t2)
      elapsed = countDelay + 300
    }
    const doneTimer = setTimeout(() => { setAllDone(true) }, elapsed)
    timersRef.current.push(doneTimer)
    return () => { timersRef.current.forEach(clearTimeout); timersRef.current = [] }
  }, [flipped.length, followUpCards.length])

  return (
    <div className="page" style={{ gap: 20, justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="page-title">추가 카드 공개</div>
        <p className="page-subtitle">추가 질문을 위한 카드들입니다</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 420 }}>
        {followUpCards.map((selected, i) => {
          const isFlipped = flipped[i] ?? false
          const isRevealed = i < revealedCount || isFlipped
          const cardImagePath = getCardImagePath(selected.card.id)

          return (
            <motion.div
              key={`${selected.card.id}-${i}`}
              initial={{ opacity: 0.25 }}
              animate={{ opacity: isRevealed ? 1 : 0.25 }}
              transition={{ duration: 0.3 }}
              style={{ perspective: 1200 }}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                style={{ position: 'relative', width: '100%', height: 140, transformStyle: 'preserve-3d' }}
              >
                {/* 카드 뒷면 */}
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                    background: 'linear-gradient(135deg, #1a1040, #0d0d2a)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                  }}
                >
                  <div style={{ opacity: 0.3, fontSize: 60, letterSpacing: 8 }}>✦ ✦ ✦</div>
                </div>
                {/* 카드 앞면 */}
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: `linear-gradient(135deg, ${persona?.color ?? '#6d235c'}22, #0d0d1a)`,
                    border: `1px solid ${persona?.color ?? '#6d235c'}66`,
                    borderRadius: 14,
                    display: 'flex', alignItems: 'center', gap: 14, padding: 12, overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: 72, height: 112, flexShrink: 0, borderRadius: 8, overflow: 'hidden',
                      background: `linear-gradient(135deg, ${persona?.color ?? '#6d235c'}, #0d0d1a)`,
                      ...(selected.isReversed ? { transform: 'rotate(180deg)' } : {}),
                    }}
                  >
                    {cardImagePath ? (
                      <img src={cardImagePath} alt={selected.card.korean_name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🔮</div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
                      {i + 1}. {selected.card.korean_name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      {selected.card.name}
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        background: selected.isReversed ? '#7a1a1a' : '#1a4a2a',
                        color: selected.isReversed ? '#ff9090' : '#90ffb0',
                        borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600, marginBottom: 8,
                      }}
                    >
                      {selected.isReversed ? '역방향 ↓' : '정방향 ↑'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {selected.card.keywords}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {allDone && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="btn-primary"
          onClick={() => navigate('/follow-up-loading')}
          style={{ marginTop: 8 }}
        >
          추가 질문 리딩 받기 🔮
        </motion.button>
      )}
    </div>
  )
}
