import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Graph from './pages/Graph'
import Upload from './pages/Upload'
import Chat from './pages/Chat'
import History from './pages/History'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import Compliance from './pages/Compliance'
import Incidents from './pages/Incidents'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="graph" element={<Graph />} />
          <Route path="upload" element={<Upload />} />
          <Route path="chat" element={<Chat />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
