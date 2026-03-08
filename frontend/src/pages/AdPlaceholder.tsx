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

  useEffect(() => {
    if (!persona || !category) { navigate('/'); return }

    // API 호출과 카운트다운 병렬 실행
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
        // 대화 기록에 첫 번째 교환 추가
        addConversation({ role: 'user', content: question || '일반 타로 리딩' })
        addConversation({ role: 'assistant', content: reading })
      } catch (e) {
        setError(`오류: ${e}`)
      } finally {
        setIsLoading(false)
      }
    }

    callApi()

    // 카운트다운
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
      <div style={{ textAlign: 'center' }}>
        {countdown > 0 ? (
          <div style={{ fontSize: 48, fontWeight: 700, color: '#fff' }}>
            {countdown}
          </div>
        ) : (
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-gold)' }}>
            {isLoading ? '🔮 리딩 중...' : '준비됐어요!'}
          </div>
        )}
      </div>

      {/* 로딩 스피너 */}
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

      {error && (
        <div style={{ color: '#ff6b6b', textAlign: 'center', fontSize: 14 }}>
          {error}
          <br />
          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: 12,
              color: 'var(--accent-gold)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            처음으로 돌아가기
          </button>
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
