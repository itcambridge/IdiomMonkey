import { useState } from 'react'
import useStore from '../store/useStore'

export const Debug = () => {
  const projects = useStore(state => state.projects)
  const [showDetails, setShowDetails] = useState(false)
  
  return (
    <div style={{ position: 'fixed', bottom: 0, right: 0, padding: '1rem', background: '#fff', border: '1px solid #ccc' }}>
      <button 
        onClick={() => setShowDetails(!showDetails)}
        className="mb-2 text-sm text-blue-500"
      >
        Toggle Debug Info
      </button>
      
      <div className="text-sm mb-2">
        Projects Count: {Object.keys(projects).length}
      </div>
      
      {showDetails && (
        <pre className="text-xs max-h-48 overflow-auto">
          {JSON.stringify({
            projects,
            localStorage: {
              'feature-store': localStorage.getItem('feature-store')
            }
          }, null, 2)}
        </pre>
      )}
    </div>
  )
} 