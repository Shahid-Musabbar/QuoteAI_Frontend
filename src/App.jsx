import { Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import SolutionsPage from './pages/SolutionsPage.jsx'
import PricingPage from './pages/PricingPage.jsx'
import FaqPage from './pages/FaqPage.jsx'
import DemoPage from './pages/DemoPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/demo" element={<DemoPage />} />
      </Route>
    </Routes>
  )
}

export default App
