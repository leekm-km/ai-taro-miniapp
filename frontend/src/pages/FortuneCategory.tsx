import { useNavigate } from 'react-router-dom'
import { useApp } from '@/store/AppContext'
import { CATEGORIES } from '@/data/categories'
import type { FortuneCategory } from '@/types'

export default function FortuneCategoryPage() {
  const navigate = useNavigate()
  const { language, persona, setCategory } = useApp()

  if (!persona) {
    navigate('/')
    return null
  }

  const handleSelect = (cat: FortuneCategory) => {
    setCategory(cat)
    navigate('/question')
  }

  return (
    <div className="page" style={{ gap: 16 }}>
      <div style={{ paddingTop: 12 }}>
        {/* 캐릭터 정보 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            background: 'var(--bg-card)',
            borderRadius: 12,
            border: `1px solid ${persona.color}66`,
            marginBottom: 16,
          }}
        >
          <img
            src={persona.imagePaths[0]}
            alt={persona.nameKo}
            style={{
              width: 50,
              height: 50,
              borderRadius: 8,
              objectFit: 'cover',
              background: persona.color,
            }}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{persona.nameKo}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{persona.nameEn}</div>
          </div>
        </div>

        <h1 className="page-title">운세 선택</h1>
        <p className="page-subtitle">
          {language === 'ko' && '어떤 운세가 궁금하신가요?'}
          {language === 'en' && 'What fortune do you seek?'}
          {language === 'zh' && '您想了解什么运势？'}
          {language === 'th' && 'คุณต้องการดูดวงอะไร?'}
        </p>
      </div>

      {/* 4x2 그리드 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          flex: 1,
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 14,
              padding: '18px 12px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-card-hover)'
              e.currentTarget.style.borderColor = persona.color
              e.currentTarget.style.transform = 'scale(1.03)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-card)'
              e.currentTarget.style.borderColor = 'var(--border-color)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <span style={{ fontSize: 28 }}>{cat.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {cat.labels[language] ?? cat.labels.ko}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              {cat.cardCount}장
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
