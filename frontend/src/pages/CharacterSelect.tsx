import { useNavigate } from 'react-router-dom'
import { useApp } from '@/store/AppContext'
import { PERSONAS } from '@/data/personas'
import type { Persona } from '@/types'

export default function CharacterSelect() {
  const navigate = useNavigate()
  const { language, setPersona } = useApp()

  const handleSelect = (persona: Persona) => {
    setPersona(persona)
    navigate('/category')
  }

  return (
    <div className="page" style={{ gap: 16 }}>
      <div style={{ paddingTop: 12 }}>
        <h1 className="page-title">타로술사 선택</h1>
        <p className="page-subtitle">
          {language === 'ko' && '당신의 타로를 읽어줄 술사를 선택하세요'}
          {language === 'en' && 'Choose your tarot reader'}
          {language === 'zh' && '选择为您解读塔罗牌的占卜师'}
          {language === 'th' && 'เลือกนักอ่านไพ่ทาโรต์ของคุณ'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {PERSONAS.map((persona) => (
          <button
            key={persona.id}
            onClick={() => handleSelect(persona)}
            style={{
              background: 'var(--bg-card)',
              border: `2px solid ${persona.color}44`,
              borderRadius: 16,
              padding: 0,
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = persona.color
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${persona.color}44`
              e.currentTarget.style.transform = 'none'
            }}
          >
            <div
              style={{
                width: 80,
                height: 90,
                background: persona.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src={persona.imagePaths[0]}
                alt={persona.nameKo}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
            <div style={{ padding: '12px 16px', flex: 1 }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 4,
                }}
              >
                {persona.nameKo}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  marginBottom: 4,
                }}
              >
                {persona.nameEn}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: '#c8b89a',
                }}
              >
                {persona.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
