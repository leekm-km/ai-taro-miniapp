import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '@/store/AppContext'

export default function CardReveal() {
  const navigate = useNavigate()
  const { language, persona, selectedCards } = useApp()
  const [revealedCount, setRevealedCount] = useState(0)
  const [flipped, setFlipped] = useState<boolean[]>([])
  const [allDone, setAllDone] = useState(false)

  useEffect(() => {
    if (!persona || selectedCards.length === 0) { navigate('/'); return }
    setFlipped(new Array(selectedCards.length).fill(false))
  }, [persona, selectedCards, navigate])

  useEffect(() => {
    if (flipped.length === 0) return
    if (revealedCount >= selectedCards.length) {
      setTimeout(() => setAllDone(true), 600)
      return
    }
    // 카드 순차 공개: 0.5s 대기 → 뒤집기 → 0.3s → 다음
    const timer = setTimeout(() => {
      setFlipped((prev) => {
        const next = [...prev]
        next[revealedCount] = true
        return next
      })
      setTimeout(() => {
        setRevealedCount((c) => c + 1)
      }, 800)
    }, revealedCount === 0 ? 500 : 300)
    return () => clearTimeout(timer)
  }, [revealedCount, flipped.length, selectedCards.length])

  return (
    <div className="page" style={{ gap: 20, justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="page-title">카드 공개</div>
        <p className="page-subtitle">당신이 선택한 카드들입니다</p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {selectedCards.map((selected, i) => {
          const isFlipped = flipped[i] ?? false
          const isRevealed = i < revealedCount || (i === revealedCount && isFlipped)

          return (
            <div
              key={selected.card.id}
              style={{
                perspective: 1000,
                height: 120,
              }}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
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
                    background: 'linear-gradient(135deg, #1a1040, #0d0d2a)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 40,
                    opacity: isRevealed ? 0.3 : 1,
                  }}
                >
                  🌙
                </div>

                {/* 카드 앞면 */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: `linear-gradient(135deg, ${persona?.color ?? '#6d235c'}22, #0d0d1a)`,
                    border: `1px solid ${persona?.color ?? '#6d235c'}66`,
                    borderRadius: 14,
                    padding: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 64,
                      background: `linear-gradient(135deg, ${persona?.color ?? '#6d235c'}, #2a0a20)`,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      flexShrink: 0,
                      ...(selected.isReversed ? { transform: 'rotate(180deg)' } : {}),
                    }}
                  >
                    🔮
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      {i + 1}. {selected.card.korean_name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
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
                      }}
                    >
                      {selected.isReversed ? '역방향 ↓' : '정방향 ↑'}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>

      {allDone && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
