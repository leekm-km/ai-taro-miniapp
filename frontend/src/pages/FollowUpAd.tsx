import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '@/store/AppContext'
import { fetchTarotReading } from '@/data/api'
import tarotCards from '@/data/tarot_cards.json'
import type { SelectedCard, TarotCard } from '@/types'

function pickRandomCards(count: number, excludeIds: string[]): SelectedCard[] {
  const available = (tarotCards.cards as TarotCard[]).filter(
    (c) => !excludeIds.includes(c.id)
  )
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((card) => ({
    card,
    isReversed: Math.random() < 0.3,
  }))
}

export default function FollowUpAd() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    persona,
    category,
    language,
    selectedCards,
    setFollowUpQuestion,
    setFollowUpCards,
    setFollowUpReading,
  } = useApp()

  const followUpQuestion =
    (location.state as { question?: string } | null)?.question ?? ''

  const [countdown, setCountdown] = useState(3)
  const [canSkip, setCanSkip] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const calledRef = useRef(false)
  const doneRef = useRef(false)

  useEffect(() => {
    if (!persona || !category || !followUpQuestion) {
      navigate('/result')
      return
    }

    if (!calledRef.current) {
      calledRef.current = true
      setFollowUpQuestion(followUpQuestion)

      const newCards = pickRandomCards(3, selectedCards.map((sc) => sc.card.id))
      setFollowUpCards(newCards)

      const callApi = async () => {
        try {
          const reading = await fetchTarotReading({
            character: persona.id,
            language,
            category: category.id,
            question: followUpQuestion,
            selectedCards: newCards,
          })
          setFollowUpReading(reading)
          doneRef.current = true
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e)
          setError(msg)
        } finally {
          setIsLoading(false)
        }
      }
      callApi()
    }

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

  useEffect(() => {
    if (canSkip && !isLoading && doneRef.current) {
      navigate('/follow-up-result')
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
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-gold)' }}>
              {isLoading ? '🔮 카드 해석 중...' : '준비됐어요!'}
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
          onClick={() => navigate('/follow-up-result')}
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
