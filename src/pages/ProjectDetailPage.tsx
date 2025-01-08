import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import useStore from '../store/useStore'
import { CreateFeatureModal } from '../components/features/CreateFeatureModal'
import { FeatureCategory, Feature } from '../types/Project'
import { DependencyGraph } from '../components/features/DependencyGraph'
import { ExportButton } from '../components/features/ExportButton'
import { motion } from 'framer-motion'

const Legend = () => (
  <div className="flex items-center gap-8 text-sm bg-[rgba(255,255,255,0.03)] backdrop-blur-md p-4 rounded-xl border border-[rgba(255,0,255,0.2)] shadow-lg">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full bg-[#00ffff]" />
      <span className="text-[#b4a5d0]">Essential</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full bg-[#ff69b4]" />
      <span className="text-[#b4a5d0]">Nice-to-Have</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full bg-[#ff00ff]" />
      <span className="text-[#b4a5d0]">Future</span>
    </div>
  </div>
)

const FeatureCard = ({ feature, provided, snapshot }: {
  feature: Feature
  provided: any
  snapshot: any
}) => {
  const deleteFeature = useStore(state => state.deleteFeature)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${feature.name}"?`)) {
      deleteFeature(feature.id)
    }
  }

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`feature-card group relative bg-[rgba(255,255,255,0.03)] backdrop-blur-md rounded-xl border border-[rgba(255,0,255,0.2)] p-4 ${
        snapshot.isDragging ? 'shadow-[0_0_15px_rgba(255,0,255,0.3)] scale-105' : 'shadow-lg'
      }`}
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-[#b4a5d0] hover:text-[#ff00ff] opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Delete feature: ${feature.name}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
      <h3 className="font-medium text-white">{feature.name}</h3>
      <p className="text-sm text-[#b4a5d0] mt-1">{feature.description}</p>
    </div>
  )
}

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const project = useStore(state => state.projects[id || ''])
  const features = useStore(state => state.features)
  const moveFeature = useStore(state => state.moveFeature)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showGraph, setShowGraph] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dependencies = useStore(state => state.dependencies)

  const projectFeatures = Object.values(features).filter(f => f.project_id === id)
  const essentialFeatures = projectFeatures.filter(f => f.category === FeatureCategory.Essential)
  const niceToHaveFeatures = projectFeatures.filter(f => f.category === FeatureCategory.NiceToHave)
  const futureFeatures = projectFeatures.filter(f => f.category === FeatureCategory.Future)

  const onDragEnd = (result: any) => {
    if (!result.destination) return
    const { draggableId, destination } = result
    moveFeature(
      draggableId,
      destination.droppableId as FeatureCategory,
      id || '',
      destination.index
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Project not found</h1>
            <Link to="/" className="text-[#ff00ff] hover:text-[#ff69b4]">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/" className="text-[#b4a5d0] hover:text-[#ff00ff] text-sm flex items-center gap-1 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Projects
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
              <p className="text-lg text-[#b4a5d0]">{project.description}</p>
            </div>
            <div className="flex items-center gap-4">
              {showGraph && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-[#b4a5d0]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-lg bg-gradient-to-r from-[#ff00ff] to-[#ff69b4] text-white shadow-[0_0_10px_rgba(255,0,255,0.3)] hover:shadow-[0_0_15px_rgba(255,0,255,0.5)] transition-all"
                title="Add Feature"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </motion.button>
              <motion.button
                onClick={() => setShowGraph(!showGraph)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,0,255,0.2)] text-[#b4a5d0] hover:text-[#ff00ff] hover:border-[#ff00ff] shadow-lg transition-all"
                title={showGraph ? "Show Cards" : "Show Dependencies"}
              >
                {showGraph ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clipRule="evenodd" />
                  </svg>
                )}
              </motion.button>
              <motion.button
                onClick={() => ExportButton({ projectId: id || '' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,0,255,0.2)] text-[#b4a5d0] hover:text-[#ff00ff] hover:border-[#ff00ff] shadow-lg transition-all"
                title="Export as Markdown"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        <Legend />

        <div className="mt-8">
          {showGraph ? (
            <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-md rounded-xl border border-[rgba(255,0,255,0.2)] shadow-lg p-6">
              <DependencyGraph 
                features={projectFeatures}
                dependencies={dependencies}
                searchTerm={searchTerm}
              />
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid gap-8 md:grid-cols-3">
                <Droppable droppableId="essential">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-[rgba(255,255,255,0.03)] backdrop-blur-md rounded-xl border border-[rgba(255,0,255,0.2)] shadow-lg p-6"
                    >
                      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#00ffff]"></div>
                        Essential Features
                      </h2>
                      {essentialFeatures.map((feature, index) => (
                        <Draggable key={feature.id} draggableId={feature.id} index={index}>
                          {(provided, snapshot) => (
                            <FeatureCard
                              feature={feature}
                              provided={provided}
                              snapshot={snapshot}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <Droppable droppableId="nice-to-have">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-[rgba(255,255,255,0.03)] backdrop-blur-md rounded-xl border border-[rgba(255,0,255,0.2)] shadow-lg p-6"
                    >
                      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff69b4]"></div>
                        Nice-to-Have Features
                      </h2>
                      {niceToHaveFeatures.map((feature, index) => (
                        <Draggable key={feature.id} draggableId={feature.id} index={index}>
                          {(provided, snapshot) => (
                            <FeatureCard
                              feature={feature}
                              provided={provided}
                              snapshot={snapshot}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <Droppable droppableId="future">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-[rgba(255,255,255,0.03)] backdrop-blur-md rounded-xl border border-[rgba(255,0,255,0.2)] shadow-lg p-6"
                    >
                      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff00ff]"></div>
                        Future Ideas
                      </h2>
                      {futureFeatures.map((feature, index) => (
                        <Draggable key={feature.id} draggableId={feature.id} index={index}>
                          {(provided, snapshot) => (
                            <FeatureCard
                              feature={feature}
                              provided={provided}
                              snapshot={snapshot}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </DragDropContext>
          )}
        </div>

        <CreateFeatureModal
          projectId={id || ''}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  )
} 