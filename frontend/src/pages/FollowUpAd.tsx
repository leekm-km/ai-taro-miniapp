import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '@/store/AppContext'

export default function FollowUpAd() {
  const navigate = useNavigate()
  const location = useLocation()
  const { persona, category, setFollowUpQuestion, setFollowUpMode } = useApp()

  const followUpQuestion =
    (location.state as { question?: string } | null)?.question ?? ''

  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (!persona || !category || !followUpQuestion) {
      navigate('/result')
      return
    }
    setFollowUpQuestion(followUpQuestion)
    setFollowUpMode(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!followUpQuestion) return
    let count = 3
    const interval = setInterval(() => {
      count--
      setCountdown(count)
      if (count <= 0) {
        clearInterval(interval)
        navigate('/card-selection')
      }
    }, 1000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followUpQuestion])

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
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-gold)' }}>
            카드를 뽑으러 가는 중...
          </div>
        )}
      </div>
    </div>
  )
}
