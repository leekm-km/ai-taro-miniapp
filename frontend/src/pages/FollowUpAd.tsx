import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '@/store/AppContext'
import { fetchFollowUpReading } from '@/data/api'

export default function FollowUpAd() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    persona,
    category,
    language,
    selectedCards,
    conversationHistory,
    addConversation,
  } = useApp()

  const followUpQuestion = (location.state as { question?: string } | null)?.question ?? ''
  const [countdown, setCountdown] = useState(3)
  const [canSkip, setCanSkip] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const doneRef = useRef(false)
  const resultRef = useRef<string | null>(null)

  useEffect(() => {
    if (!persona || !category || !followUpQuestion) {
      navigate('/result')
      return
    }

    const callApi = async () => {
      try {
        const reading = await fetchFollowUpReading({
          character: persona.id,
          language,
          category: category.id,
          question: followUpQuestion,
          selectedCards,
          conversationHistory,
        })
        resultRef.current = reading
        addConversation({ role: 'user', content: followUpQuestion })
        addConversation({ role: 'assistant', content: reading })
        doneRef.current = true
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    }

    callApi()

    let count = 3
    const interval = setInterval(() => {
      count--
      setCountdown(count)
      if (count <= 0) {
        clearInterval(interval)
        setCanSkip(true)
      }
    }, 1000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (canSkip && !isLoading && doneRef.current) {
      navigate('/result')
    }
  }, [canSkip, isLoading, navigate])

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          aspectRatio: '16/9',
          background: '#111',
          borderRadius: 12,
          border: '1px solid #333',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <div style={{ fontSize: 64 }}>▶</div>
        <div style={{ color: '#666', fontSize: 14 }}>광고 플레이스홀더</div>
      </div>

      <div style={{ textAlign: 'center' }}>
        {countdown > 0 ? (
          <div style={{ fontSize: 48, fontWeight: 700, color: '#fff' }}>{countdown}</div>
        ) : (
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-gold)' }}>
            {isLoading ? '🔮 답변 준비 중...' : '준비됐어요!'}
          </div>
        )}
      </div>

      {isLoading && (
        <div
          style={{
            width: 32,
            height: 32,
            border: '3px solid #333',
            borderTop: '3px solid var(--accent-gold)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      )}

      {canSkip && !isLoading && !error && (
        <button
          onClick={() => navigate('/result')}
          style={{
            background: 'var(--accent-gold)',
            color: '#000',
            border: 'none',
            borderRadius: 10,
            padding: '12px 32px',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Skip →
        </button>
      )}

      {error && (
        <div
          style={{
            color: '#ff6b6b',
            textAlign: 'center',
            fontSize: 13,
            maxWidth: 320,
            padding: '12px 16px',
            background: 'rgba(255,0,0,0.1)',
            borderRadius: 8,
            border: '1px solid rgba(255,0,0,0.3)',
          }}
        >
          <div style={{ marginBottom: 8, fontWeight: 600 }}>오류가 발생했어요</div>
          <div style={{ fontSize: 11, color: '#ff9090', marginBottom: 12 }}>{error}</div>
          <button
            onClick={() => navigate('/result')}
            style={{
              color: 'var(--accent-gold)',
              background: 'none',
              border: '1px solid var(--accent-gold)',
              borderRadius: 6,
              padding: '6px 16px',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            결과로 돌아가기
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
