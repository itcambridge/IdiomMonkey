import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { Feature, Project, Dependency, FeatureCategory } from '../types/Project'

interface FeatureState {
  // Projects
  projects: Record<string, Project>
  createProject: (name: string, purpose: string) => void
  addProject: (project: Project) => void
  updateProject: (project: Project) => void
  deleteProject: (id: string) => void

  // Features
  features: Record<string, Feature>
  addFeature: (feature: Feature) => void
  updateFeature: (feature: Feature) => void
  deleteFeature: (id: string) => void
  getProjectFeatures: (projectId: string) => Feature[]
  
  // Feature Ordering
  featureOrders: Record<string, string[]> // projectId -> array of featureIds
  moveFeature: (featureId: string, newCategory: FeatureCategory, projectId: string, newIndex: number) => void

  // Dependencies
  dependencies: Record<string, Dependency[]>
  addDependency: (dependency: Dependency) => void
  removeDependency: (featureId: string, dependsOnId: string) => void

  // Node Positions
  nodePositions: Record<string, { x: number; y: number }>
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void
}

const useStore = create<FeatureState>()(
  devtools(
    persist(
      (set, get) => ({
        // Projects
        projects: {},
        createProject: (name: string, purpose: string) =>
          set((state) => {
            const id = crypto.randomUUID()
            const newProject: Project = {
              id,
              name,
              purpose,
              description: purpose,
              created_at: new Date().toISOString()
            }
            return {
              projects: { ...state.projects, [id]: newProject }
            }
          }),
        addProject: (project) =>
          set((state) => ({
            projects: { ...state.projects, [project.id]: project }
          })),
        updateProject: (project) =>
          set((state) => ({
            projects: { ...state.projects, [project.id]: project }
          })),
        deleteProject: (id) =>
          set((state) => {
            // Get features associated with this project
            const projectFeatures = Object.values(state.features)
              .filter(f => f.project_id === id)
              .map(f => f.id)

            // Remove the project
            const { [id]: removedProject, ...remainingProjects } = state.projects

            // Remove project features
            const remainingFeatures = { ...state.features }
            projectFeatures.forEach(featureId => {
              delete remainingFeatures[featureId]
            })

            // Clean up dependencies
            const remainingDependencies = { ...state.dependencies }
            projectFeatures.forEach(featureId => {
              delete remainingDependencies[featureId]
            })
            // Also remove any dependencies that point to deleted features
            Object.keys(remainingDependencies).forEach(featureId => {
              remainingDependencies[featureId] = remainingDependencies[featureId]
                ?.filter(dep => !projectFeatures.includes(dep.depends_on_id)) || []
            })

            // Clean up feature orders
            const { [id]: removedOrder, ...remainingOrders } = state.featureOrders

            // Clean up node positions
            const remainingPositions = { ...state.nodePositions }
            projectFeatures.forEach(featureId => {
              delete remainingPositions[featureId]
            })

            return {
              projects: remainingProjects,
              features: remainingFeatures,
              dependencies: remainingDependencies,
              featureOrders: remainingOrders,
              nodePositions: remainingPositions
            }
          }),

        // Features
        features: {},
        addFeature: (feature) =>
          set((state) => ({
            features: { ...state.features, [feature.id]: feature }
          })),
        updateFeature: (feature) =>
          set((state) => ({
            features: { ...state.features, [feature.id]: feature }
          })),
        deleteFeature: (id) =>
          set((state) => {
            const { [id]: removed, ...remaining } = state.features
            return { features: remaining }
          }),
        getProjectFeatures: (projectId) => {
          const state = get()
          return Object.values(state.features).filter(
            feature => feature.project_id === projectId
          )
        },

        // Feature Ordering
        featureOrders: {},
        moveFeature: (featureId, newCategory, projectId, newIndex) =>
          set((state) => {
            const feature = state.features[featureId]
            if (!feature) return state

            // Update feature category
            const updatedFeature = {
              ...feature,
              category: newCategory
            }

            // Update feature orders
            const currentOrders = state.featureOrders[projectId] || []
            const newOrders = [...currentOrders]
            
            // Remove from old position
            const oldIndex = newOrders.indexOf(featureId)
            if (oldIndex !== -1) {
              newOrders.splice(oldIndex, 1)
            }
            
            // Insert at new position
            newOrders.splice(newIndex, 0, featureId)

            return {
              features: {
                ...state.features,
                [featureId]: updatedFeature
              },
              featureOrders: {
                ...state.featureOrders,
                [projectId]: newOrders
              }
            }
          }),

        // Dependencies
        dependencies: {},
        addDependency: (dependency) =>
          set((state) => ({
            dependencies: {
              ...state.dependencies,
              [dependency.feature_id]: [
                ...(state.dependencies[dependency.feature_id] || []),
                dependency
              ]
            }
          })),
        removeDependency: (featureId, dependsOnId) =>
          set((state) => ({
            dependencies: {
              ...state.dependencies,
              [featureId]: state.dependencies[featureId]?.filter(
                d => d.depends_on_id !== dependsOnId
              ) || []
            }
          })),

        // Node Positions
        nodePositions: {},
        updateNodePosition: (nodeId, position) =>
          set((state) => ({
            nodePositions: {
              ...state.nodePositions,
              [nodeId]: position
            }
          }))
      }),
      {
        name: 'feature-store',
      }
    )
  )
)

export default useStore 