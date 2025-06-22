import { Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import { ChatInterface } from './pages/ChatInterface'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/chat" element={<ChatInterface />} />
    </Routes>
  )
}

export default App
