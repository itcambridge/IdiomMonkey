// @ts-nocheck
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App