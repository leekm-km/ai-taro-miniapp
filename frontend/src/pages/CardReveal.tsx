import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '@/store/AppContext'
import { getCardImagePath } from '@/data/cardImages'

export default function CardReveal() {
  const navigate = useNavigate()
  const { language, persona, selectedCards } = useApp()
  const [flipped, setFlipped] = useState<boolean[]>([])
  const [revealedCount, setRevealedCount] = useState(0)
  const [allDone, setAllDone] = useState(false)
  // ★ StrictMode 이중 실행 방지: 모든 타이머를 ref로 관리
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const startedRef = useRef(false)

  useEffect(() => {
    if (!persona || selectedCards.length === 0) { navigate('/'); return }
    setFlipped(new Array(selectedCards.length).fill(false))
  }, [persona, selectedCards, navigate])

  useEffect(() => {
    if (flipped.length === 0) return
    if (startedRef.current) return  // StrictMode 이중 실행 방지
    startedRef.current = true

    // Flutter 원본 시퀀스 재현:
    // 500ms 대기 → 첫 카드 뒤집기(800ms) → 300ms 대기 → 다음 카드 ...
    let elapsed = 500  // 첫 카드 시작 전 대기

    for (let i = 0; i < selectedCards.length; i++) {
      const flipDelay = elapsed
      const countDelay = elapsed + 800  // flip duration = 800ms
      const cardIndex = i

      const t1 = setTimeout(() => {
        setFlipped((prev) => {
          const next = [...prev]
          next[cardIndex] = true
          return next
        })
      }, flipDelay)

      const t2 = setTimeout(() => {
        setRevealedCount(cardIndex + 1)
      }, countDelay)

      timersRef.current.push(t1, t2)
      elapsed = countDelay + 300  // 다음 카드 시작까지 300ms 간격
    }

    // 마지막 카드 완료 후 600ms → 버튼 표시
    const doneTimer = setTimeout(() => {
      setAllDone(true)
    }, elapsed)
    timersRef.current.push(doneTimer)

    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [flipped.length, selectedCards.length])

  return (
    <div className="page" style={{ gap: 20, justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="page-title">카드 공개</div>
        <p className="page-subtitle">당신이 선택한 카드들입니다</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 420 }}>
        {selectedCards.map((selected, i) => {
          const isFlipped = flipped[i] ?? false
          const isRevealed = i < revealedCount || isFlipped
          const cardImagePath = getCardImagePath(selected.card.id)

          return (
            // ★ perspective는 부모에, motion.div는 3D 컨테이너로
            <motion.div
              key={selected.card.id}
              initial={{ opacity: 0.25 }}
              animate={{ opacity: isRevealed ? 1 : 0.25 }}
              transition={{ duration: 0.3 }}
              style={{ perspective: 1200 }}
            >
              {/* 3D 플립 컨테이너 */}
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1],  // Flutter의 linear controller와 유사한 cubic-bezier
                }}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 140,
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
                    background: 'linear-gradient(135deg, #1a1040, #0d0d2a)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ opacity: 0.3, fontSize: 60, letterSpacing: 8 }}>✦ ✦ ✦</div>
                </div>

                {/* 카드 앞면 */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: `linear-gradient(135deg, ${persona?.color ?? '#6d235c'}22, #0d0d1a)`,
                    border: `1px solid ${persona?.color ?? '#6d235c'}66`,
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: 12,
                    overflow: 'hidden',
                  }}
                >
                  {/* 카드 이미지 */}
                  <div
                    style={{
                      width: 72,
                      height: 112,
                      flexShrink: 0,
                      borderRadius: 8,
                      overflow: 'hidden',
                      background: `linear-gradient(135deg, ${persona?.color ?? '#6d235c'}, #0d0d1a)`,
                      ...(selected.isReversed ? { transform: 'rotate(180deg)' } : {}),
                    }}
                  >
                    {cardImagePath ? (
                      <img
                        src={cardImagePath}
                        alt={selected.card.korean_name}
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
                          fontSize: 28,
                        }}
                      >
                        🔮
                      </div>
                    )}
                  </div>

                  {/* 카드 정보 */}
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
                        borderRadius: 6,
                        padding: '2px 8px',
                        fontSize: 11,
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                    >
                      {selected.isReversed ? '역방향 ↓' : '정방향 ↑'}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
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
          onClick={() => navigate('/ad')}
          style={{ marginTop: 8 }}
        >
          {language === 'ko' && '타로 리딩 받기 🔮'}
          {language === 'en' && 'Get Reading 🔮'}
          {language === 'zh' && '获取塔罗解读 🔮'}
          {language === 'th' && 'รับการอ่านไพ่ 🔮'}
        </motion.button>
      )}
    </div>
  )
}
