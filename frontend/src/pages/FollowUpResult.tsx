import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Markdown from 'react-markdown'
import { motion } from 'framer-motion'
import { useApp } from '@/store/AppContext'
import { getCardImagePath } from '@/data/cardImages'

function parseReading(reading: string, cardCount: number) {
  const intro =
    reading.match(/\[INTRO\]([\s\S]*?)(?=\[CARD_1\]|\[SUMMARY\]|$)/)?.[1]?.trim() ?? ''

  const cards: string[] = []
  for (let i = 1; i <= cardCount; i++) {
    const nextTag = i < cardCount ? `\\[CARD_${i + 1}\\]` : '\\[SUMMARY\\]'
    const pattern = new RegExp(`\\[CARD_${i}\\]([\\s\\S]*?)(?=${nextTag}|$)`)
    cards.push(reading.match(pattern)?.[1]?.trim() ?? '')
  }

  const summary = reading.match(/\[SUMMARY\]([\s\S]*)$/)?.[1]?.trim() ?? ''

  if (!intro && cards.every((c) => !c) && !summary) {
    return { intro: reading, cards: new Array(cardCount).fill(''), summary: '' }
  }
  return { intro, cards, summary }
}

const markdownComponents = {
  p: ({ children }: { children?: ReactNode }) => (
    <p style={{ marginBottom: 12, fontSize: 15, lineHeight: 1.85, color: 'var(--text-primary)' }}>
      {children}
    </p>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong style={{ color: 'var(--accent-gold)' }}>{children}</strong>
  ),
}

export default function FollowUpResult() {
  const navigate = useNavigate()
  const {
    persona,
    category,
    language,
    followUpQuestion,
    followUpCards,
    followUpReading,
  } = useApp()

  useEffect(() => {
    if (!persona || !category || !followUpReading || followUpCards.length === 0)
      navigate('/result')
  }, [persona, category, followUpReading, followUpCards, navigate])

  if (!persona || !category || !followUpReading || followUpCards.length === 0) return null

  const parsed = parseReading(followUpReading, followUpCards.length)

  const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <div className="page" style={{ gap: 0, padding: 0 }}>

      {/* 타로술사 사진 */}
      <div style={{ width: '100%', position: 'relative' }}>
        <img
          src={persona.imagePaths[0]}
          alt={persona.nameKo}
          style={{
            width: '100%',
            maxHeight: 220,
            objectFit: 'cover',
            objectPosition: 'top',
            display: 'block',
          }}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px 16px 12px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--accent-gold)', fontWeight: 600, marginBottom: 2 }}>
            추가 질문 리딩
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{persona.nameKo}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
            {category.labels[language] ?? category.labels.ko}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* 추가 질문 표시 */}
        {followUpQuestion && (
          <div
            style={{
              background: `${persona.color}18`,
              borderRadius: 12,
              padding: '10px 14px',
              border: `1px solid ${persona.color}44`,
              fontSize: 14,
              color: 'var(--text-primary)',
            }}
          >
            <span style={{ color: 'var(--text-secondary)', fontSize: 11, marginRight: 8 }}>
              추가 질문
            </span>
            {followUpQuestion}
          </div>
        )}

        {/* 새로 뽑은 카드 안내 */}
        <motion.div {...fadeUp}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
              color: 'var(--text-secondary)',
              fontSize: 13,
            }}
          >
            <span style={{ color: persona.color, fontSize: 16 }}>✦</span>
            추가 질문을 위해 새로운 카드 {followUpCards.length}장을 뽑았습니다
          </div>
        </motion.div>

        {/* 인트로 */}
        {parsed.intro && (
          <motion.div {...fadeUp}>
            <Markdown components={markdownComponents}>{parsed.intro}</Markdown>
          </motion.div>
        )}

        {/* 카드별 섹션 */}
        {followUpCards.map((selected, i) => {
          const cardImagePath = getCardImagePath(selected.card.id)
          const cardText = parsed.cards[i] ?? ''

          return (
            <motion.div
              key={`${selected.card.id}-${i}`}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              style={{
                borderTop: `1px solid ${persona.color}44`,
                paddingTop: 20,
              }}
            >
              <div style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 88,
                    height: 136,
                    flexShrink: 0,
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: `2px solid ${persona.color}88`,
                    background: `linear-gradient(135deg, ${persona.color}22, #0d0d1a)`,
                    boxShadow: `0 4px 16px ${persona.color}44`,
                    ...(selected.isReversed ? { transform: 'rotate(180deg)' } : {}),
                  }}
                >
                  {cardImagePath ? (
                    <img
                      src={cardImagePath}
                      alt={selected.card.korean_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 32,
                      }}
                    >
                      🔮
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, paddingTop: 4 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    카드 {i + 1}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                    {selected.card.korean_name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
                    {selected.card.name}
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      background: selected.isReversed ? '#7a1a1a' : '#1a4a2a',
                      color: selected.isReversed ? '#ff9090' : '#90ffb0',
                      borderRadius: 6,
                      padding: '3px 10px',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {selected.isReversed ? '역방향 ↓' : '정방향 ↑'}
                  </div>
                </div>
              </div>

              {cardText && (
                <Markdown components={markdownComponents}>{cardText}</Markdown>
              )}
            </motion.div>
          )
        })}

        {/* 종합 해석 */}
        {parsed.summary && (
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: followUpCards.length * 0.15 }}
            style={{
              borderTop: `1px solid ${persona.color}44`,
              paddingTop: 20,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#fff',
                letterSpacing: 2,
                marginBottom: 14,
                padding: '8px 14px',
                background: persona.color,
                borderRadius: 8,
                display: 'inline-block',
              }}
            >
              ✦ 종합 해석
            </div>
            <Markdown components={markdownComponents}>{parsed.summary}</Markdown>
          </motion.div>
        )}

        {/* 하단 버튼 */}
        <div style={{ paddingBottom: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="btn-secondary"
            onClick={() => navigate('/result')}
          >
            원래 결과로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}
