import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useStore from '../../store/useStore'
import { FeatureCategory, FeaturePriority, Feature } from '../../types/Project'

interface CreateFeatureModalProps {
  projectId: string
  isOpen: boolean
  onClose: () => void
}

export const CreateFeatureModal = ({ projectId, isOpen, onClose }: CreateFeatureModalProps) => {
  console.log('Modal rendered with projectId:', projectId)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: FeatureCategory.Essential,
    notes: ''
  })

  const addFeature = useStore(state => state.addFeature)

  const [priority, setPriority] = useState<FeaturePriority>(FeaturePriority.Medium)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form submitted with data:', formData)
    
    const newFeature: Feature = {
      id: uuidv4(),
      project_id: projectId,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      priority,
      notes: formData.notes,
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('Attempting to create feature:', newFeature)
    
    try {
      addFeature(newFeature)
      console.log('Feature added to store')
      
      const features = useStore.getState().features
      console.log('Current features in store:', features)
    } catch (error) {
      console.error('Error adding feature:', error)
    }

    setFormData({
      name: '',
      description: '',
      category: FeatureCategory.Essential,
      notes: ''
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Feature</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Feature Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as FeatureCategory }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={FeatureCategory.Essential}>Essential</option>
              <option value={FeatureCategory.NiceToHave}>Nice-to-Have</option>
              <option value={FeatureCategory.Future}>Future</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as FeaturePriority)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={FeaturePriority.High}>High</option>
              <option value={FeaturePriority.Medium}>Medium</option>
              <option value={FeaturePriority.Low}>Low</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Feature
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 