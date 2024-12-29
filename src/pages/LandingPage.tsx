import React from 'react'
import { CreateProject } from '../components/projects/CreateProject'
import { ProjectList } from '../components/projects/ProjectList'
import { motion } from 'framer-motion'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
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
        
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-16 lg:gap-20 lg:grid-cols-[minmax(400px,1fr),2fr] md:items-start">
            <motion.div 
              variants={fadeIn}
              className="w-full max-w-md mx-auto relative"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                  Start building your ideas today!
                </h2>
                <p className="text-indigo-900/70 mt-3">
                  Transform your vision into an organized roadmap
                </p>
              </motion.div>
              <motion.div 
                className="create-project-form"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CreateProject />
              </motion.div>
            </motion.div>
            <motion.div 
              variants={fadeIn}
              className="w-full"
            >
              <ProjectList />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}