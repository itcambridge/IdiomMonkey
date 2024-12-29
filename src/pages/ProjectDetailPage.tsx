import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import useStore from '../store/useStore'
import { CreateFeatureModal } from '../components/features/CreateFeatureModal'
import { FeatureCategory, Feature } from '../types/Project'
import { DependencyGraph } from '../components/features/DependencyGraph'
import { ExportButton } from '../components/features/ExportButton'

const Legend = () => (
  <div className="flex items-center gap-8 text-sm text-gray-600 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded" style={{ 
        background: '#e3f2fd',
        border: '1px solid #2196f3'
      }} />
      <span>Essential</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded" style={{ 
        background: '#f3e5f5',
        border: '1px solid #9c27b0'
      }} />
      <span>Nice-to-Have</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded" style={{ 
        background: '#e8f5e9',
        border: '1px solid #4caf50'
      }} />
      <span>Future</span>
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
      className={`feature-card group relative ${
        snapshot.isDragging ? 'shadow-lg bg-blue-50 scale-105' : ''
      }`}
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Delete feature: ${feature.name}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
      <h3 className="font-medium text-gray-900">{feature.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
            <Link to="/" className="text-blue-500 hover:text-blue-600">
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
          <Link to="/" className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Projects
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <p className="text-lg text-gray-600">{project.description}</p>
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
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
                  {searchTerm && (
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">
                      {projectFeatures.filter(f => 
                        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        f.description.toLowerCase().includes(searchTerm.toLowerCase())
                      ).length} matches
                    </span>
                  )}
                </div>
              )}
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Feature
              </button>
              <button
                onClick={() => setShowGraph(!showGraph)}
                className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 shadow-sm transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                {showGraph ? 'Show Cards' : 'Show Dependencies'}
              </button>
              <ExportButton projectId={id || ''} className="btn-export" />
            </div>
          </div>
        </div>

        <Legend />

        <div className="mt-8">
          {showGraph ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
                      className="category-container"
                    >
                      <h2 className="category-header">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-500"></div>
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
                      className="category-container"
                    >
                      <h2 className="category-header">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-500"></div>
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
                      className="category-container"
                    >
                      <h2 className="category-header">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-500"></div>
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