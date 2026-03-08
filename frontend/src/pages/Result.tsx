import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Markdown from 'react-markdown'
import { useApp } from '@/store/AppContext'

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
    addConversation: _addConversation,
    reset,
  } = useApp()

  const [showInput, setShowInput] = useState(false)
  const [followUpText, setFollowUpText] = useState('')

  if (!persona || !category || !reading) {
    navigate('/')
    return null
  }

  const handleAskFollowUp = () => {
    // 추가질문 버튼 → 광고 먼저 보여줌
    setShowInput(true)
  }

  const handleSendFollowUp = () => {
    if (!followUpText.trim()) return
    const q = followUpText.trim()
    setFollowUpText('')
    navigate('/follow-up-ad', { state: { question: q } })
  }

  // reading을 세 부분으로 나눔 (캐릭터 이미지 삽입용)
  const readingParts = splitReading(reading)
  // 첫 번째는 항상 캐릭터 대표 이미지, 나머지는 랜덤
  const [firstImage, ...restImages] = persona.imagePaths
  const images = [firstImage, ...getRandomImages(restImages, 2)]

  return (
    <div className="page" style={{ gap: 16 }}>
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          background: 'var(--bg-card)',
          borderRadius: 12,
          border: `1px solid ${persona.color}66`,
        }}
      >
        <img
          src={persona.imagePaths[0]}
          alt={persona.nameKo}
          style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: persona.color }}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{persona.nameKo}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {category.labels[language] ?? category.labels.ko}
          </div>
        </div>
      </div>

      {/* 질문 표시 */}
      {question && (
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: 12,
            padding: '12px 16px',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>질문</div>
          <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{question}</div>
        </div>
      )}

      {/* 선택 카드 */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        {selectedCards.map((s, i) => (
          <div
            key={s.card.id}
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${s.isReversed ? '#7a1a1a' : '#1a4a2a'}`,
              borderRadius: 10,
              padding: '6px 12px',
              fontSize: 12,
            }}
          >
            <span style={{ color: 'var(--text-secondary)', marginRight: 4 }}>{i + 1}.</span>
            <span>{s.card.korean_name}</span>
            <span
              style={{
                marginLeft: 6,
                color: s.isReversed ? '#ff9090' : '#90ffb0',
                fontSize: 10,
              }}
            >
              {s.isReversed ? '역' : '정'}
            </span>
          </div>
        ))}
      </div>

      {/* 리딩 결과 (캐릭터 이미지 인터리빙) */}
      <div style={{ lineHeight: 1.8 }}>
        {readingParts[0] && (
          <>
            {images[0] && (
              <img
                src={images[0]}
                alt=""
                style={{
                  width: '100%',
                  borderRadius: 12,
                  marginBottom: 16,
                  objectFit: 'cover',
                  maxHeight: 200,
                }}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            )}
            <Markdown
              components={{
                p: ({ children }) => (
                  <p style={{ marginBottom: 12, fontSize: 15, lineHeight: 1.8, color: 'var(--text-primary)' }}>
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong style={{ color: 'var(--accent-gold)' }}>{children}</strong>
                ),
              }}
            >
              {readingParts[0]}
            </Markdown>
          </>
        )}

        {readingParts[1] && (
          <>
            {images[1] && (
              <img
                src={images[1]}
                alt=""
                style={{
                  width: '100%',
                  borderRadius: 12,
                  margin: '16px 0',
                  objectFit: 'cover',
                  maxHeight: 200,
                }}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            )}
            <Markdown
              components={{
                p: ({ children }) => (
                  <p style={{ marginBottom: 12, fontSize: 15, lineHeight: 1.8, color: 'var(--text-primary)' }}>
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong style={{ color: 'var(--accent-gold)' }}>{children}</strong>
                ),
              }}
            >
              {readingParts[1]}
            </Markdown>
          </>
        )}

        {readingParts[2] && (
          <>
            {images[2] && (
              <img
                src={images[2]}
                alt=""
                style={{
                  width: '100%',
                  borderRadius: 12,
                  margin: '16px 0',
                  objectFit: 'cover',
                  maxHeight: 200,
                }}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            )}
            <Markdown
              components={{
                p: ({ children }) => (
                  <p style={{ marginBottom: 12, fontSize: 15, lineHeight: 1.8, color: 'var(--text-primary)' }}>
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong style={{ color: 'var(--accent-gold)' }}>{children}</strong>
                ),
              }}
            >
              {readingParts[2]}
            </Markdown>
          </>
        )}
      </div>

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
            onClick={handleAskFollowUp}
            style={{ marginBottom: 12 }}
          >
            광고보고 추가질문하기 💬
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
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
  )
}

function splitReading(text: string): [string, string, string] {
  const len = text.length
  const third = Math.floor(len / 3)
  return [
    text.slice(0, third),
    text.slice(third, third * 2),
    text.slice(third * 2),
  ]
}

function getRandomImages(paths: string[], count: number): string[] {
  const shuffled = [...paths].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
