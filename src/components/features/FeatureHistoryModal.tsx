import type { FC } from 'react'
import { motion } from 'framer-motion'
import { Feature, FeatureHistory } from '../../types/Project'
import useStore from '../../store/useStore'

interface FeatureHistoryModalProps {
  feature: Feature
  isOpen: boolean
  onClose: () => void
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

export const FeatureHistoryModal: FC<FeatureHistoryModalProps> = ({ feature, isOpen, onClose }) => {
  const updateFeature = useStore(state => state.updateFeature)

  if (!isOpen) return null

  const handleRestore = (historyEntry: FeatureHistory) => {
    if (window.confirm('Are you sure you want to restore this version?')) {
      const restoredFeature: Feature = {
        ...feature,
        ...historyEntry.previousValues,
        updatedAt: new Date().toISOString()
      }
      updateFeature(restoredFeature)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[rgba(20,10,30,0.8)] backdrop-blur-md rounded-xl border border-[rgba(255,0,255,0.2)] p-6 w-full max-w-2xl shadow-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Feature History</h2>
          <button
            onClick={onClose}
            className="text-[#b4a5d0] hover:text-[#ff00ff] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {feature.history && feature.history.length > 0 ? (
            [...feature.history].reverse().map((historyEntry) => (
              <div
                key={historyEntry.id}
                className="bg-[rgba(255,255,255,0.03)] rounded-lg p-4 border border-[rgba(255,0,255,0.2)]"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[#b4a5d0] text-sm">
                    {formatDate(historyEntry.timestamp)}
                  </span>
                  <button
                    onClick={() => handleRestore(historyEntry)}
                    className="text-sm text-[#b4a5d0] hover:text-[#ff00ff] transition-colors"
                  >
                    Restore this version
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[#b4a5d0] text-sm">Name: </span>
                    <span className="text-white">{historyEntry.previousValues.name}</span>
                  </div>
                  <div>
                    <span className="text-[#b4a5d0] text-sm">Description: </span>
                    <span className="text-white">{historyEntry.previousValues.description}</span>
                  </div>
                  <div>
                    <span className="text-[#b4a5d0] text-sm">Category: </span>
                    <span className="text-white">{historyEntry.previousValues.category}</span>
                  </div>
                  {historyEntry.previousValues.priority && (
                    <div>
                      <span className="text-[#b4a5d0] text-sm">Priority: </span>
                      <span className="text-white">{historyEntry.previousValues.priority}</span>
                    </div>
                  )}
                  {historyEntry.previousValues.notes && (
                    <div>
                      <span className="text-[#b4a5d0] text-sm">Notes: </span>
                      <span className="text-white">{historyEntry.previousValues.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-[#b4a5d0] py-8">
              No history available for this feature
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[rgba(255,0,255,0.2)] text-[#b4a5d0] hover:text-[#ff00ff] hover:border-[#ff00ff]"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )
} 