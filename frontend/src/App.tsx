import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AppProvider } from '@/store/AppContext'
import { useApp } from '@/store/AppContext'
import CharacterSelect from '@/pages/CharacterSelect'
import FortuneCategory from '@/pages/FortuneCategory'
import QuestionInput from '@/pages/QuestionInput'
import CardSelection from '@/pages/CardSelection'
import CardReveal from '@/pages/CardReveal'
import AdPlaceholder from '@/pages/AdPlaceholder'
import Result from '@/pages/Result'
import FollowUpAd from '@/pages/FollowUpAd'
import FollowUpCardReveal from '@/pages/FollowUpCardReveal'
import FollowUpLoading from '@/pages/FollowUpLoading'
import FollowUpResult from '@/pages/FollowUpResult'
import '@/styles/global.css'

function HomeButton() {
  const navigate = useNavigate()
  const location = useLocation()
  const { reset } = useApp()

  if (location.pathname === '/character') return null

  return (
    <button
      onClick={() => { reset(); navigate('/character') }}
      style={{
        position: 'fixed',
        top: 12,
        right: 12,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.55)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 8,
        color: '#fff',
        fontSize: 13,
        padding: '6px 12px',
        cursor: 'pointer',
        backdropFilter: 'blur(6px)',
      }}
    >
      🏠 홈
    </button>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <HomeButton />
        <Routes>
          <Route path="/" element={<Navigate to="/character" replace />} />
          <Route path="/character" element={<CharacterSelect />} />
          <Route path="/category" element={<FortuneCategory />} />
          <Route path="/question" element={<QuestionInput />} />
          <Route path="/card-selection" element={<CardSelection />} />
          <Route path="/card-reveal" element={<CardReveal />} />
          <Route path="/ad" element={<AdPlaceholder />} />
          <Route path="/result" element={<Result />} />
          <Route path="/follow-up-ad" element={<FollowUpAd />} />
          <Route path="/follow-up-card-reveal" element={<FollowUpCardReveal />} />
          <Route path="/follow-up-loading" element={<FollowUpLoading />} />
          <Route path="/follow-up-result" element={<FollowUpResult />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
