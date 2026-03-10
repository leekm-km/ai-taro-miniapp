import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Markdown from 'react-markdown'
import { motion } from 'framer-motion'
import { useApp } from '@/store/AppContext'
import { getCardImagePath } from '@/data/cardImages'

// [INTRO] / [CARD_N] / [SUMMARY] 태그로 reading 파싱
function parseReading(reading: string, cardCount: number) {
  const intro = reading.match(/\[INTRO\]([\s\S]*?)(?=\[CARD_1\]|\[SUMMARY\]|$)/)?.[1]?.trim() ?? ''

  const cards: string[] = []
  for (let i = 1; i <= cardCount; i++) {
    const nextTag = i < cardCount ? `\\[CARD_${i + 1}\\]` : '\\[SUMMARY\\]'
    const pattern = new RegExp(`\\[CARD_${i}\\]([\\s\\S]*?)(?=${nextTag}|$)`)
    const match = reading.match(pattern)?.[1]?.trim() ?? ''
    cards.push(match)
  }

  const summary = reading.match(/\[SUMMARY\]([\s\S]*)$/)?.[1]?.trim() ?? ''

  // 태그가 없으면 전체를 intro로 (구버전 응답 호환)
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

export default function Result() {
  const navigate = useNavigate()
  const {
    language,
    persona,
    category,
    question,
    selectedCards,
    reading,
    conversationHistory,
    reset,
  } = useApp()

  const [showInput, setShowInput] = useState(false)
  const [followUpText, setFollowUpText] = useState('')

  useEffect(() => {
    if (!persona || !category || !reading) navigate('/')
  }, [persona, category, reading, navigate])

  if (!persona || !category || !reading) return null

  const parsed = parseReading(reading, selectedCards.length)

  const handleSendFollowUp = () => {
    if (!followUpText.trim()) return
    const q = followUpText.trim()
    setFollowUpText('')
    navigate('/follow-up-ad', { state: { question: q } })
  }

  const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <div className="page" style={{ gap: 0, padding: 0 }}>

      {/* ① 타로술사 큰 사진 */}
      <div style={{ width: '100%', position: 'relative' }}>
        <img
          src={persona.imagePaths[0]}
          alt={persona.nameKo}
          style={{
            width: '100%',
            maxHeight: 280,
            objectFit: 'cover',
            objectPosition: 'top',
            display: 'block',
          }}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        {/* 이름 오버레이 */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '32px 16px 12px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{persona.nameKo}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
            {category.labels[language] ?? category.labels.ko}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* 질문 표시 */}
        {question && (
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 12,
              padding: '10px 14px',
              border: '1px solid var(--border-color)',
              fontSize: 14,
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{ color: 'var(--text-secondary)', fontSize: 11, marginRight: 8 }}>질문</span>
            {question}
          </div>
        )}

        {/* ② 자기소개 / 인트로 텍스트 */}
        {parsed.intro && (
          <motion.div {...fadeUp}>
            <Markdown components={markdownComponents}>{parsed.intro}</Markdown>
          </motion.div>
        )}

        {/* ③ 카드별 섹션 */}
        {selectedCards.map((selected, i) => {
          const cardImagePath = getCardImagePath(selected.card.id)
          const cardText = parsed.cards[i] ?? ''

          return (
            <motion.div
              key={selected.card.id}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              style={{
                borderTop: `1px solid ${persona.color}44`,
                paddingTop: 20,
              }}
            >
              {/* 카드 이미지 + 정보 */}
              <div style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
                {/* 카드 이미지 */}
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

                {/* 카드 이름 + 방향 */}
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

              {/* 카드 해석 텍스트 */}
              {cardText && (
                <Markdown components={markdownComponents}>{cardText}</Markdown>
              )}
            </motion.div>
          )
        })}

        {/* ④ 종합 해석 */}
        {parsed.summary && (
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: selectedCards.length * 0.15 }}
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

        {/* 이전 추가질문 대화 */}
        {conversationHistory.length > 2 && (
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
            {conversationHistory.slice(2).map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 12,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: msg.role === 'user' ? 'rgba(109,35,92,0.2)' : 'var(--bg-card)',
                  border: `1px solid ${msg.role === 'user' ? persona.color + '44' : 'var(--border-color)'}`,
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  {msg.role === 'user' ? '질문' : persona.nameKo}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.7 }}>{msg.content}</div>
              </div>
            ))}
          </div>
        )}

        {/* 추가질문 영역 */}
        <div style={{ paddingBottom: 24 }}>
          {!showInput ? (
            <button
              className="btn-primary"
              onClick={() => setShowInput(true)}
              style={{ marginBottom: 12 }}
            >
              광고보고 추가질문하기 💬
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                placeholder="추가 질문을 입력하세요..."
                onKeyDown={(e) => e.key === 'Enter' && handleSendFollowUp()}
                style={{
                  flex: 1,
                  background: 'var(--bg-card)',
                  border: `1px solid ${persona.color}88`,
                  borderRadius: 10,
                  padding: '12px 16px',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={handleSendFollowUp}
                disabled={!followUpText.trim()}
                style={{
                  background: followUpText.trim() ? persona.color : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '12px 16px',
                  cursor: followUpText.trim() ? 'pointer' : 'default',
                  fontSize: 18,
                  transition: 'all 0.2s',
                }}
              >
                ↑
              </button>
            </div>
          )}

          <button className="btn-secondary" onClick={() => { reset(); navigate('/') }}>
            처음으로 돌아가기
          </button>
        </div>

      </div>
    </div>
  )
}
