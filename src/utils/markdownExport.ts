import { Feature, Project, FeatureCategory } from '../types/Project'

export const generateMarkdown = (
  project: Project,
  features: Feature[],
  dependencies: Record<string, string[]>
): string => {
  const categorizedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = []
    }
    acc[feature.category].push(feature)
    return acc
  }, {} as Record<FeatureCategory, Feature[]>)

  let markdown = `# ${project.name}\n\n`
  markdown += `## Project Purpose\n${project.purpose}\n\n`
  
  // Essential Features
  markdown += `## Essential Features\n`
  categorizedFeatures[FeatureCategory.Essential]?.forEach(feature => {
    markdown += `### ${feature.name}\n`
    markdown += `${feature.description}\n\n`
    if (feature.notes) {
      markdown += `**Notes:** ${feature.notes}\n\n`
    }
    const deps = dependencies[feature.id]
    if (deps?.length) {
      markdown += `**Dependencies:**\n`
      deps.forEach(depId => {
        const depFeature = features.find(f => f.id === depId)
        markdown += `- ${depFeature?.name}\n`
      })
      markdown += '\n'
    }
  })

  // Nice-to-Have Features
  markdown += `## Nice-to-Have Features\n`
  categorizedFeatures[FeatureCategory.NiceToHave]?.forEach(feature => {
    // Similar structure as above
    markdown += `### ${feature.name}\n`
    // ... rest of feature details
  })

  // Future Ideas
  markdown += `## Future Ideas\n`
  categorizedFeatures[FeatureCategory.Future]?.forEach(feature => {
    // Similar structure as above
    markdown += `### ${feature.name}\n`
    // ... rest of feature details
  })

  return markdown
} 