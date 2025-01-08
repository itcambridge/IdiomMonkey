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
      <div className="text-center p-6 sm:p-8 bg-[rgba(255,255,255,0.03)] backdrop-blur-md rounded-xl border border-[rgba(255,0,255,0.2)] shadow-lg max-w-[200px] mx-auto">
        <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
        <p className="text-[#b4a5d0] text-sm">Create your first project to get started!</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-[#ff00ff] to-[#ff69b4] text-transparent bg-clip-text mb-4 sm:mb-6 text-center">
        Your Projects
      </h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
        {Object.values(projects).map(project => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="project-card group relative aspect-square bg-[rgba(255,255,255,0.03)] backdrop-blur-md rounded-xl border border-[rgba(255,0,255,0.2)] shadow-lg p-3 flex flex-col
              hover:border-[#ff00ff] hover:shadow-[0_0_15px_rgba(255,0,255,0.3)] transition-all duration-300"
          >
            <Link to={`/project/${project.id}`} className="flex flex-col flex-1">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-1.5 line-clamp-2">
                  {project.name}
                </h3>
                <p className="text-[#b4a5d0] text-xs line-clamp-3">
                  {project.description || project.purpose}
                </p>
              </div>
              <div className="mt-auto pt-2 text-xs text-[#b4a5d0] flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                {Object.values(features).filter(f => f.project_id === project.id).length} features
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault()
                handleDeleteProject(project.id, project.name)
              }}
              className="absolute top-2 right-2 p-1.5 text-[#b4a5d0] hover:text-[#ff00ff] opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100"
              aria-label={`Delete project: ${project.name}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 