import React, { useState, useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  ReactFlowProvider,
  Panel
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Feature, Dependency, FeatureCategory } from '../../types/Project'
import { v4 as uuidv4 } from 'uuid'
import useStore from '../../store/useStore'

interface DependencyGraphProps {
  features: Feature[]
  dependencies: Record<string, Dependency[]>
  searchTerm: string
}

export const DependencyGraph = ({ features, dependencies, searchTerm }: DependencyGraphProps) => {
  const addDependency = useStore(state => state.addDependency)
  const removeDependency = useStore(state => state.removeDependency)
  const nodePositions = useStore(state => state.nodePositions)
  const updateNodePosition = useStore(state => state.updateNodePosition)

  const getDependencyCounts = () => {
    const counts: Record<string, { dependents: number, dependencies: number }> = {}
    features.forEach(f => {
      counts[f.id] = { dependents: 0, dependencies: 0 }
    })
    Object.entries(dependencies).forEach(([featureId, deps]) => {
      if (counts[featureId]) {
        counts[featureId].dependencies = deps.length
        deps.forEach(dep => {
          if (counts[dep.depends_on_id]) {
            counts[dep.depends_on_id].dependents += 1
          }
        })
      }
    })
    return counts
  }

  const dependencyCounts = getDependencyCounts()

  const createNodes = () => features.map((feature) => ({
    id: feature.id,
    data: { 
      label: (
        <div className="p-4">
          <div className="font-medium text-gray-900">{feature.name}</div>
          <div className="text-sm text-gray-600 mt-2">{feature.description}</div>
        </div>
      ),
      feature
    },
    position: nodePositions[feature.id] || {
      x: Math.random() * 500,
      y: Math.random() * 500
    },
    type: 'default',
    className: `node ${
      feature.category === FeatureCategory.Essential 
        ? 'node-essential'
        : feature.category === FeatureCategory.NiceToHave 
        ? 'node-nice-to-have'
        : 'node-future'
    }`,
    style: {
      width: 250,
      fontSize: '14px',
      fontFamily: 'Inter, system-ui, sans-serif',
      transition: 'all 0.2s ease',
      opacity: searchTerm ? 
        (feature.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         feature.description.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0.2) 
        : 1
    }
  }))

  const createEdges = () => Object.values(dependencies)
    .flat()
    .filter(dep => 
      features.some(f => f.id === dep.feature_id) && 
      features.some(f => f.id === dep.depends_on_id)
    )
    .map((dep) => ({
      id: dep.id,
      source: dep.feature_id,
      target: dep.depends_on_id,
      type: 'default',
      animated: true,
      style: {
        stroke: '#94a3b8',
        strokeWidth: 2,
        opacity: 0.8
      },
      markerEnd: {
        type: 'arrowclosed',
        color: '#94a3b8',
        width: 20,
        height: 20
      }
    }))

  const [nodes, setNodes, onNodesChange] = useNodesState(createNodes())
  const [edges, setEdges, onEdgesChange] = useEdgesState(createEdges())

  useEffect(() => {
    setNodes(createNodes())
    setEdges(createEdges())
  }, [features, dependencies, searchTerm])

  const onConnect = (params: Connection) => {
    if (params.source && params.target) {
      const newDependency: Dependency = {
        id: uuidv4(),
        feature_id: params.source,
        depends_on_id: params.target
      }
      addDependency(newDependency)
      const newEdge: Edge = {
        id: newDependency.id,
        source: params.source,
        target: params.target,
        type: 'default',
        animated: true,
        style: {
          stroke: '#94a3b8',
          strokeWidth: 2,
          opacity: 0.8
        },
        markerEnd: {
          type: 'arrowclosed',
          color: '#94a3b8',
          width: 20,
          height: 20
        }
      }
      setEdges(eds => [...eds, newEdge])
    }
  }

  const onEdgeClick = (_: React.MouseEvent, edge: Edge) => {
    if (window.confirm('Remove this dependency?')) {
      removeDependency(edge.source, edge.target)
      setEdges(edges.filter(e => e.id !== edge.id))
    }
  }

  const onNodeDragStop = (_: React.MouseEvent, node: Node) => {
    updateNodePosition(node.id, node.position)
  }

  return (
    <div className="dependency-graph">
      <div style={{ height: '600px' }} className="relative rounded-lg border border-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100/30 via-gray-50/20 to-white/10 pointer-events-none" />
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeClick={onEdgeClick}
            onNodeDragStop={onNodeDragStop}
            fitView
            connectOnClick={true}
            minZoom={0.5}
            maxZoom={1.5}
            defaultZoom={1}
            edgeClass="connector-line"
            aria-label="Feature dependency graph"
          >
            <Background color="#e2e8f0" gap={16} className="grid-background" />
            <Controls className="zoom-control" />
            <Panel position="bottom-center" className="dependency-panel text-sm text-gray-600">
              Drag between nodes to create dependencies
            </Panel>
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  )
} 