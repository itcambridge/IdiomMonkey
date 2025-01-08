import React, { useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../../store/useStore'
import { Feature, FeatureCategory } from '../../types/Project'

interface EditFeatureModalProps {
  feature: Feature
  isOpen: boolean
  onClose: () => void
}

export const EditFeatureModal = ({ feature, isOpen, onClose }: EditFeatureModalProps) => {
  const updateFeature = useStore(state => state.updateFeature)
  const [name, setName] = useState(feature.name)
  const [description, setDescription] = useState(feature.description)
  const [category, setCategory] = useState(feature.category)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !description.trim()) return

    updateFeature({
      ...feature,
      name,
      description,
      category
    })
    
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[rgba(20,10,30,0.8)] backdrop-blur-md rounded-xl border border-[rgba(255,0,255,0.2)] p-6 w-full max-w-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Edit Feature</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#b4a5d0] mb-1">
              Feature Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[rgba(255,0,255,0.2)] bg-[rgba(20,10,30,0.8)]
                placeholder:text-[#b4a5d0] text-white
                focus:outline-none focus:border-[#ff00ff] focus:ring-2 focus:ring-[rgba(255,0,255,0.2)]"
              placeholder="Enter feature name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#b4a5d0] mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[rgba(255,0,255,0.2)] bg-[rgba(20,10,30,0.8)]
                placeholder:text-[#b4a5d0] text-white
                focus:outline-none focus:border-[#ff00ff] focus:ring-2 focus:ring-[rgba(255,0,255,0.2)]"
              placeholder="Describe the feature"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#b4a5d0] mb-1">
              Category
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setCategory(FeatureCategory.Essential)}
                className={`p-2 rounded-lg border text-sm font-medium transition-all
                  ${category === FeatureCategory.Essential
                    ? 'border-[#00ffff] text-[#00ffff] bg-[rgba(0,255,255,0.1)] shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                    : 'border-[rgba(255,0,255,0.2)] text-[#b4a5d0] hover:border-[#00ffff] hover:text-[#00ffff]'
                  }`}
              >
                Essential
              </button>
              <button
                type="button"
                onClick={() => setCategory(FeatureCategory.NiceToHave)}
                className={`p-2 rounded-lg border text-sm font-medium transition-all
                  ${category === FeatureCategory.NiceToHave
                    ? 'border-[#ff69b4] text-[#ff69b4] bg-[rgba(255,105,180,0.1)] shadow-[0_0_10px_rgba(255,105,180,0.3)]'
                    : 'border-[rgba(255,0,255,0.2)] text-[#b4a5d0] hover:border-[#ff69b4] hover:text-[#ff69b4]'
                  }`}
              >
                Nice
              </button>
              <button
                type="button"
                onClick={() => setCategory(FeatureCategory.Future)}
                className={`p-2 rounded-lg border text-sm font-medium transition-all
                  ${category === FeatureCategory.Future
                    ? 'border-[#ff00ff] text-[#ff00ff] bg-[rgba(255,0,255,0.1)] shadow-[0_0_10px_rgba(255,0,255,0.3)]'
                    : 'border-[rgba(255,0,255,0.2)] text-[#b4a5d0] hover:border-[#ff00ff] hover:text-[#ff00ff]'
                  }`}
              >
                Future
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[rgba(255,0,255,0.2)] text-[#b4a5d0] hover:text-[#ff00ff] hover:border-[#ff00ff]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !description.trim()}
              className="px-4 py-2 rounded-lg font-medium text-white
                bg-gradient-to-r from-[#ff00ff] to-[#ff69b4]
                hover:from-[#ff40ff] hover:to-[#ff8dc7]
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:from-[#ff00ff] disabled:hover:to-[#ff69b4]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
} 