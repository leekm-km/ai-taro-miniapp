import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/store/AppContext'
import { fetchFollowUpReading } from '@/data/api'

export default function FollowUpLoading() {
  const navigate = useNavigate()
  const {
    persona,
    category,
    language,
    followUpQuestion,
    followUpCards,
    conversationHistory,
    setFollowUpReading,
    setFollowUpMode,
  } = useApp()
  const calledRef = useRef(false)

  useEffect(() => {
    if (!persona || !category || !followUpQuestion || followUpCards.length === 0) {
      navigate('/result')
      return
    }
    if (calledRef.current) return
    calledRef.current = true

    const callApi = async () => {
      try {
        const reading = await fetchFollowUpReading({
          character: persona.id,
          language,
          category: category.id,
          question: followUpQuestion,
          selectedCards: followUpCards,
          conversationHistory,
        })
        setFollowUpReading(reading)
        setFollowUpMode(false)
        navigate('/follow-up-result')
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        alert(`오류가 발생했어요: ${msg}`)
        navigate('/result')
      }
    }
    callApi()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--bg-dark)',
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
          width: 48,
          height: 48,
          border: '4px solid #333',
          borderTop: `4px solid ${persona?.color ?? 'var(--accent-gold)'}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <div
        style={{
          fontSize: 15,
          color: 'var(--text-secondary)',
          textAlign: 'center',
          lineHeight: 1.7,
          whiteSpace: 'pre-line',
        }}
      >
        {'추가 질문을 바탕으로\n카드를 리딩하고 있어요.\n잠시만 기다려주세요.'}
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
