// TODO: Edge Case for copy-paste
import { AnimEase, AnimProperty, NodeDataModel, clearNodeData, figmaNodeList, nodeData, nodeHasSvgExport, nodeTree, setNodeData } from '@figmania/common'
import { ExportFormat } from '../types/Export'
import { NodeModel } from '../types/NodeModel'
import { normalizeTick } from '../utils/math'
import { MigrationFn } from '../utils/migrate'

export const EaseGsapToAnim: Record<string, AnimEase> = {
  'none': 'linear',
  'power1.in': 'ease-in',
  'power1.out': 'ease-out',
  'power1.inOut': 'ease-in-out'
}

interface NodeDataV0 {
  active: boolean
  delay: number
  duration: number
  ease: string
  trigger: string
  animations: { type: AnimProperty, from: number, to: number }[]
  exportFormat: ExportFormat
  uuid?: string
}

const NodeModelV0: NodeDataModel<NodeDataV0> = {
  key: 'data',
  defaults: { active: false, delay: 0, duration: 0.5, ease: 'power1.inOut', trigger: 'hover', animations: [], exportFormat: 'html' }
}

export const migrateV0: MigrationFn = () => {
  const masterFigmaNodes = figmaNodeList(figma.root)
    .filter(nodeHasSvgExport)
    .filter((figmaNode) => figmaNode.getPluginDataKeys().includes('data'))
    .reverse()
  for (const masterFigmaNode of masterFigmaNodes) {
    const masterData = nodeData(masterFigmaNode, NodeModelV0)
    const master = nodeTree(masterFigmaNode, NodeModel)
    const defaultDelay = normalizeTick(masterData.delay ?? 0)
    const defaultDuration = normalizeTick(masterData.duration ?? 0.5)
    master.data.duration = 0.1
    master.data.trigger = masterData.trigger ?? 'hover'
    master.data.exportFormat = masterData.exportFormat ?? 'html'
    master.data.defaultEase = EaseGsapToAnim[masterData.ease] ?? 'ease-in-out'
    const childFigmaNodes = figmaNodeList(masterFigmaNode)
      .filter((figmaNode) => figmaNode.getPluginDataKeys().includes('data'))
      .reverse()
    for (const childFigmaNode of childFigmaNodes) {
      if (!childFigmaNode.getPluginData(NodeModelV0.key)) { continue }
      const childData = nodeData(childFigmaNode, NodeModelV0)
      const child = nodeTree(childFigmaNode, NodeModel)
      child.data.timelines = childData.animations.map((animation) => {
        const from = normalizeTick(childData.delay ?? defaultDelay)
        const to = normalizeTick(from + (childData.duration ?? defaultDuration))
        master.data.duration = Math.max(master.data.duration, to)
        return {
          initialValue: animation.from,
          property: animation.type,
          transitions: [{
            from, to, value: animation.to,
            ease: EaseGsapToAnim[childData.ease] ?? master.data.defaultEase
          }]
        }
      })
      setNodeData(childFigmaNode, NodeModel, child.data)
      clearNodeData(childFigmaNode, NodeModelV0)
    }
    setNodeData(masterFigmaNode, NodeModel, master.data)
    clearNodeData(masterFigmaNode, NodeModelV0)
  }
}
