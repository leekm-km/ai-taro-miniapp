import { useNavigate } from 'react-router-dom'
import { useApp } from '@/store/AppContext'
import type { Language } from '@/types'

const LANGUAGES: { code: Language; label: string; emoji: string }[] = [
  { code: 'ko', label: '한국어', emoji: '🇰🇷' },
  { code: 'en', label: 'English', emoji: '🇺🇸' },
  { code: 'zh', label: '中文', emoji: '🇨🇳' },
  { code: 'th', label: 'ไทย', emoji: '🇹🇭' },
]

export default function LanguageSelect() {
  const navigate = useNavigate()
  const { setLanguage } = useApp()

  const handleSelect = (code: Language) => {
    setLanguage(code)
    navigate('/character')
  }

  return (
    <div className="page" style={{ justifyContent: 'center', gap: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🔮</div>
        <h1 className="page-title" style={{ fontSize: 28 }}>AI 타로오빠</h1>
        <p className="page-subtitle">언어를 선택해주세요 / Choose your language</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 14,
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontSize: 18,
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-card-hover)'
              e.currentTarget.style.borderColor = 'var(--accent-gold)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-card)'
              e.currentTarget.style.borderColor = 'var(--border-color)'
            }}
          >
            <span style={{ fontSize: 28 }}>{lang.emoji}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
