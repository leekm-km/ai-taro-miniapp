import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/store/AppContext'

const PROMPTS: Record<string, string> = {
  ko: '무엇이 궁금하신가요?',
  en: 'What would you like to know?',
  zh: '您想了解什么？',
  th: 'คุณต้องการรู้อะไร?',
}

const PLACEHOLDERS: Record<string, string> = {
  ko: '질문을 입력하거나 빈칸으로 두셔도 됩니다...',
  en: 'Enter your question or leave it blank...',
  zh: '请输入您的问题，或留空也可以...',
  th: 'ป้อนคำถามหรือเว้นว่างไว้ก็ได้...',
}

export default function QuestionInput() {
  const navigate = useNavigate()
  const { language, persona, category, setQuestion } = useApp()
  const [text, setText] = useState('')

  if (!persona || !category) {
    navigate('/')
    return null
  }

  const handleNext = () => {
    setQuestion(text.trim())
    navigate('/card-selection')
  }

  return (
    <div className="page" style={{ gap: 20 }}>
      <div style={{ paddingTop: 12 }}>
        {/* 선택 정보 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            background: 'var(--bg-card)',
            borderRadius: 12,
            border: `1px solid ${persona.color}66`,
            marginBottom: 20,
          }}
        >
          <img
            src={persona.imagePaths[0]}
            alt={persona.nameKo}
            style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: persona.color }}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{persona.nameKo}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {category.labels[language] ?? category.labels.ko} · {category.cardCount}장
            </div>
          </div>
        </div>

        <h1 className="page-title">{PROMPTS[language]}</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          {persona.greetings[language] ?? persona.greetings.ko}
        </p>
      </div>

      <div style={{ flex: 1 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDERS[language]}
          rows={6}
          style={{
            width: '100%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 12,
            padding: 16,
            color: 'var(--text-primary)',
            fontSize: 15,
            lineHeight: 1.6,
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = persona.color
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)'
          }}
        />
      </div>

      <button className="btn-primary" onClick={handleNext}>
        {language === 'ko' && '카드 선택하기 🃏'}
        {language === 'en' && 'Choose Cards 🃏'}
        {language === 'zh' && '选择牌 🃏'}
        {language === 'th' && 'เลือกไพ่ 🃏'}
      </button>
    </div>
  )
}
