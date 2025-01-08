// @ts-nocheck
import React from 'react'
import { CreateProject } from '../components/projects/CreateProject'
import { ProjectList } from '../components/projects/ProjectList'
import { motion } from 'framer-motion'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="landing-header">
            Feature Brainstorming Tool
          </h1>
        </div>
        
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.div 
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            <CreateProject />
          </motion.div>

          <motion.div 
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            <ProjectList />
          </motion.div>
        </div>
      </div>
    </div>
  )
}