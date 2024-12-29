import React from 'react'
import { exportAsMarkdown } from '../../utils/export'

interface ExportButtonProps {
  projectId: string;
  className?: string;
}

export const ExportButton = ({ projectId, className }: ExportButtonProps) => {
  return (
    <button
      onClick={() => exportAsMarkdown(projectId)}
      className={`bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 shadow-sm transition-all flex items-center gap-2 ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export as Markdown
    </button>
  )
} 