import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/store/AppContext'
import { fetchTarotReading } from '@/data/api'

export default function AdPlaceholder() {
  const navigate = useNavigate()
  const { language, persona, category, question, selectedCards, setReading, addConversation } = useApp()
  const [countdown, setCountdown] = useState(3)
  const [canSkip, setCanSkip] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const readingRef = useRef<string | null>(null)
  const calledRef = useRef(false) // StrictMode 이중 호출 방지

  useEffect(() => {
    if (!persona || !category) { navigate('/'); return }

    // API 호출은 한 번만 (StrictMode 이중 실행 방지)
    if (!calledRef.current) {
      calledRef.current = true
      const callApi = async () => {
        try {
          const reading = await fetchTarotReading({
            character: persona.id,
            language,
            category: category.id,
            question,
            selectedCards,
          })
          readingRef.current = reading
          setReading(reading)
          addConversation({ role: 'user', content: question || '일반 타로 리딩' })
          addConversation({ role: 'assistant', content: reading })
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e)
          if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
            setError('서버에 연결할 수 없어요.\n백엔드가 실행 중인지 확인해주세요.\n(cd backend && uvicorn main:app --port 5000)')
          } else {
            setError(msg)
          }
        } finally {
          setIsLoading(false)
        }
      }
      callApi()
    }

    // 카운트다운은 항상 실행 (StrictMode remount 시에도 재시작)
    let count = 3
    setCountdown(3)
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

  // 카운트다운 끝 + API 완료 → 자동 이동
  useEffect(() => {
    if (canSkip && !isLoading && readingRef.current) {
      navigate('/result')
    }
  }, [canSkip, isLoading, navigate])

  const handleSkip = () => {
    if (canSkip && !isLoading) {
      navigate('/result')
    }
  }

  const handleRetry = () => {
    calledRef.current = false
    setError(null)
    setIsLoading(true)
    setCanSkip(false)
    setCountdown(3)
    window.location.reload()
  }

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
      {/* 광고 플레이스홀더 */}
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
        <div style={{ color: '#444', fontSize: 12 }}>
          (앱인토스 콘솔에서 실제 광고 연동)
        </div>
      </div>

      {/* 카운트다운 */}
      {!error && (
        <div style={{ textAlign: 'center' }}>
          {countdown > 0 ? (
            <div style={{ fontSize: 48, fontWeight: 700, color: '#fff' }}>
              {countdown}
            </div>
          ) : (
            <div style={{ fontSize: isLoading ? 15 : 24, fontWeight: 700, color: 'var(--accent-gold)', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
              {isLoading ? '당신의 카드를 신중히 리딩하고 있어요.\n잠시만 기다려주세요.' : '준비됐어요!'}
            </div>
          )}
        </div>
      )}

      {/* 로딩 스피너 */}
      {isLoading && !error && (
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

      {/* Skip 버튼 */}
      {canSkip && !isLoading && !error && (
        <button
          onClick={handleSkip}
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

      {/* 에러 */}
      {error && (
        <div
          style={{
            background: '#1a0000',
            border: '1px solid #ff4444',
            borderRadius: 12,
            padding: '20px 24px',
            maxWidth: 360,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <div
            style={{
              color: '#ff8888',
              fontSize: 13,
              lineHeight: 1.7,
              whiteSpace: 'pre-line',
              marginBottom: 16,
            }}
          >
            {error}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={handleRetry}
              style={{
                background: 'var(--accent-gold)',
                color: '#000',
                border: 'none',
                borderRadius: 8,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              다시 시도
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                color: '#888',
                border: '1px solid #444',
                borderRadius: 8,
                padding: '10px 20px',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              처음으로
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
