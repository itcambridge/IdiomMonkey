// @ts-nocheck
import React from 'react'
import { Link } from 'react-router-dom'
import useStore from '../../store/useStore'
import { motion } from 'framer-motion'

export const ProjectList = () => {
  const projects = useStore(state => state.projects)
  const features = useStore(state => state.features)
  const deleteProject = useStore(state => state.deleteProject)

  const handleDeleteProject = (projectId: string, projectName: string) => {
    if (window.confirm(`Are you sure you want to delete "${projectName}" and all its features?`)) {
      deleteProject(projectId)
    }
  }

  if (Object.keys(projects).length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
        <p className="text-gray-600">Create your first project to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-6">
        Your Projects
      </h2>
      <div className="grid gap-4">
        {Object.values(projects).map(project => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="project-card group relative"
          >
            <Link to={`/project/${project.id}`} className="block">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {project.name}
              </h3>
              <p className="text-gray-600">
                {project.description || project.purpose}
              </p>
              <div className="mt-4 text-sm text-gray-500">
                {Object.values(features).filter(f => f.project_id === project.id).length} features
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault()
                handleDeleteProject(project.id, project.name)
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Delete project: ${project.name}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 