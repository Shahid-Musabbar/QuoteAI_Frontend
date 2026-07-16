import { Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import TryPage from './pages/TryPage.jsx'
import MailPollingPage from './pages/MailPollingPage.jsx'
import SimulationPage from './pages/SimulationPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/try" element={<TryPage />} />
        <Route path="/mail-polling" element={<MailPollingPage />} />
        <Route path="/simulate" element={<SimulationPage />} />
      </Route>
    </Routes>
  )
}

export default App
