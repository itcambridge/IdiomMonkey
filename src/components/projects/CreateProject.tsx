import React, { useState } from 'react'
import useStore from '../../store/useStore'
import { motion } from 'framer-motion'

export const CreateProject = () => {
  const [name, setName] = useState('')
  const [purpose, setPurpose] = useState('')
  const [debugMessage, setDebugMessage] = useState('')
  const createProject = useStore(state => state.createProject)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !purpose.trim()) return

    try {
      setDebugMessage('Creating project...')
      
      createProject(name, purpose)
      
      const projects = useStore.getState().projects
      const projectCount = Object.keys(projects).length
      
      setDebugMessage(`Project created. Total projects: ${projectCount}`)
      
      setName('')
      setPurpose('')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setDebugMessage(`Error: ${errorMessage}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative bg-opacity-5 bg-white backdrop-blur-md rounded-xl p-6 border border-[rgba(255,0,255,0.2)] shadow-lg">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <input
            id="projectName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name your project"
            className="w-full px-4 py-3 rounded-lg border border-[rgba(255,0,255,0.2)] bg-[rgba(255,255,255,0.03)]
              placeholder:text-[#b4a5d0] text-white
              transition-all duration-200
              focus:outline-none focus:border-[#ff00ff] focus:ring-2 focus:ring-[rgba(255,0,255,0.2)]
              hover:border-[rgba(255,0,255,0.4)]"
          />
        </div>
        <div className="flex-[2]">
          <input
            id="projectPurpose"
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Describe what this project aims to achieve"
            className="w-full px-4 py-3 rounded-lg border border-[rgba(255,0,255,0.2)] bg-[rgba(255,255,255,0.03)]
              placeholder:text-[#b4a5d0] text-white
              transition-all duration-200
              focus:outline-none focus:border-[#ff00ff] focus:ring-2 focus:ring-[rgba(255,0,255,0.2)]
              hover:border-[rgba(255,0,255,0.4)]"
          />
        </div>
        <motion.button
          type="submit"
          disabled={!name.trim() || !purpose.trim()}
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(255,0,255,0.5)' }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-lg font-medium text-white whitespace-nowrap
            bg-gradient-to-r from-[#ff00ff] to-[#ff69b4]
            transition-all duration-200
            hover:from-[#ff40ff] hover:to-[#ff8dc7]
            focus:outline-none focus:ring-2 focus:ring-[rgba(255,0,255,0.5)]
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:from-[#ff00ff] disabled:hover:to-[#ff69b4]
            shadow-[0_0_10px_rgba(255,0,255,0.3)]"
        >
          Create Project
        </motion.button>
      </div>
      
      {debugMessage && (
        <div className="mt-4 p-2 bg-[rgba(255,0,255,0.1)] text-[#ff69b4] rounded border border-[rgba(255,0,255,0.2)]">
          {debugMessage}
        </div>
      )}
    </form>
  )
}