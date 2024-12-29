import useStore from '../store/useStore'

export const exportAsMarkdown = (projectId: string) => {
  const store = useStore.getState()
  const project = store.projects[projectId]
  const features = Object.values(store.features).filter(f => f.project_id === projectId)
  const dependencies = store.dependencies

  if (!project) return

  const essentialFeatures = features.filter(f => f.category === 'essential')
  const niceToHaveFeatures = features.filter(f => f.category === 'nice-to-have')
  const futureFeatures = features.filter(f => f.category === 'future')

  let markdown = `# ${project.name}\n\n`
  markdown += `${project.description || project.purpose}\n\n`

  const addFeatureSection = (title: string, features: typeof essentialFeatures) => {
    if (features.length === 0) return ''
    let section = `## ${title}\n\n`
    features.forEach(feature => {
      section += `### ${feature.name}\n`
      section += `${feature.description}\n\n`
      
      // Add dependencies
      const featureDependencies = dependencies[feature.id] || []
      if (featureDependencies.length > 0) {
        section += '**Dependencies:**\n'
        featureDependencies.forEach(dep => {
          const dependentFeature = store.features[dep.depends_on_id]
          if (dependentFeature) {
            section += `- ${dependentFeature.name}\n`
          }
        })
        section += '\n'
      }
    })
    return section
  }

  markdown += addFeatureSection('Essential Features', essentialFeatures)
  markdown += addFeatureSection('Nice-to-Have Features', niceToHaveFeatures)
  markdown += addFeatureSection('Future Ideas', futureFeatures)

  // Create and download the markdown file
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