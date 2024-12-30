// @ts-nocheck
import React from 'react'
import { generateMarkdown } from '../../utils/markdownExport'
import useStore from '../../store/useStore'

interface ExportButtonProps {
  projectId: string;
  className?: string;
}

export const ExportButton = ({ projectId, className }: ExportButtonProps) => {
  const handleExport = () => {
    const store = useStore.getState()
    const project = store.projects[projectId]
    const features = Object.values(store.features).filter(f => f.project_id === projectId)
    const dependencies = Object.entries(store.dependencies).reduce((acc, [featureId, deps]) => {
      acc[featureId] = deps.map(d => d.depends_on_id)
      return acc
    }, {} as Record<string, string[]>)

    const markdown = generateMarkdown(project, features, dependencies)
    
    // Download logic...
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-features.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className={`bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 shadow-sm transition-all flex items-center gap-2 ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export as Markdown
    </button>
  )
} 