import React, { useState } from 'react'
import useStore from '../../store/useStore'
import { motion } from 'framer-motion'

export const CreateProject = () => {
  const [name, setName] = useState('')
  const [purpose, setPurpose] = useState('')
  const createProject = useStore(state => state.createProject)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !purpose.trim()) return
    createProject(name, purpose)
    setName('')
    setPurpose('')
  }

  return (
    <form onSubmit={handleSubmit} className="relative bg-white rounded-xl p-8 sm:p-10 border border-gray-100 shadow-sm">
      <div className="space-y-6">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-900 mb-2">
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name your project"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white
              placeholder:text-gray-400 text-gray-900
              transition-all duration-200
              focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
              hover:border-gray-300"
          />
        </div>
        <div>
          <label htmlFor="projectPurpose" className="block text-sm font-medium text-gray-900 mb-2">
            Project Purpose
          </label>
          <textarea
            id="projectPurpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Describe what this project aims to achieve and its main objectives"
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white
              placeholder:text-gray-400 text-gray-900 resize-none
              transition-all duration-200
              focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
              hover:border-gray-300"
          />
        </div>
        <motion.button
          type="submit"
          disabled={!name.trim() || !purpose.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-6 py-3 rounded-lg font-medium text-white
            bg-gradient-to-r from-indigo-600 to-purple-600
            transition-all duration-200
            hover:from-indigo-700 hover:to-purple-700
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:from-indigo-600 disabled:hover:to-purple-600
            shadow-sm hover:shadow-md"
        >
          Create Project
        </motion.button>
      </div>
    </form>
  )
}