// @ts-nocheck
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage } from '../pages/LandingPage'
import { ProjectDetailPage } from '../pages/ProjectDetailPage'
import { Debug } from './Debug'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
      </Routes>
      <Debug />
    </BrowserRouter>
  )
}

export default App