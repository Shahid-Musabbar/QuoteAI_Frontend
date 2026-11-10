import { Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout.jsx'
import ConversationLayout from './layout/ConversationLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import SolutionsPage from './pages/SolutionsPage.jsx'
import PricingPage from './pages/PricingPage.jsx'
import FaqPage from './pages/FaqPage.jsx'
import NewConversationPrompt from './pages/NewConversationPrompt.jsx'
import ConversationView from './pages/ConversationView.jsx'
import DataSourcesPage from './pages/DataSourcesPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/data" element={<DataSourcesPage />} />
        <Route path="/demo" element={<ConversationLayout />}>
          <Route index element={<NewConversationPrompt />} />
          <Route path=":conversationId" element={<ConversationView />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
