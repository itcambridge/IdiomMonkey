import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { Project } from '../types/Project'

export const HomePage = () => {
  const navigate = useNavigate()
  const projects = useStore(state => state.projects)
  const addProject = useStore(state => state.addProject)
  const [name, setName] = useState('')
  const [purpose, setPurpose] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const project: Project = {
      id: crypto.randomUUID(),
      name: name.trim(),
      purpose: purpose.trim(),
      createdAt: new Date().toISOString()
    }

    addProject(project)
    setName('')
    setPurpose('')
    navigate(`/project/${project.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 sm:text-5xl">
            Plan and organize your app features efficiently
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Break down your project into essential, nice-to-have, and future features. 
            Visualize dependencies and prioritize development.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-[minmax(400px,1fr),2fr] md:items-start">
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                      placeholder="Enter project name"
                    />
                  </div>
                  <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Purpose
                    </label>
                    <textarea
                      id="purpose"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                      placeholder="Describe the purpose of your project"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create Project
                  </button>
                </form>
              </div>
            </div>

            <div className="w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Projects</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {Object.values(projects).length === 0 ? (
                  <div className="col-span-2 bg-white rounded-xl p-8 text-center border border-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-gray-600">No projects yet. Create your first project to get started!</p>
                  </div>
                ) : (
                  Object.values(projects)
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map(project => (
                      <div
                        key={project.id}
                        onClick={() => navigate(`/project/${project.id}`)}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group border border-gray-100"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-500 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {project.purpose}
                        </p>
                        <div className="mt-4 flex items-center text-xs text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          Created: {new Date(project.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 