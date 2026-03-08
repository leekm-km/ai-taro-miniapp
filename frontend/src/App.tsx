import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from '@/store/AppContext'
import LanguageSelect from '@/pages/LanguageSelect'
import CharacterSelect from '@/pages/CharacterSelect'
import FortuneCategory from '@/pages/FortuneCategory'
import QuestionInput from '@/pages/QuestionInput'
import CardSelection from '@/pages/CardSelection'
import CardReveal from '@/pages/CardReveal'
import AdPlaceholder from '@/pages/AdPlaceholder'
import Result from '@/pages/Result'
import FollowUpAd from '@/pages/FollowUpAd'
import '@/styles/global.css'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LanguageSelect />} />
          <Route path="/character" element={<CharacterSelect />} />
          <Route path="/category" element={<FortuneCategory />} />
          <Route path="/question" element={<QuestionInput />} />
          <Route path="/card-selection" element={<CardSelection />} />
          <Route path="/card-reveal" element={<CardReveal />} />
          <Route path="/ad" element={<AdPlaceholder />} />
          <Route path="/result" element={<Result />} />
          <Route path="/follow-up-ad" element={<FollowUpAd />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
