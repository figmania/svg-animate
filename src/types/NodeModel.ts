import { AnimEase, AnimTimeline, NodeDataModel } from '@figmania/common'
import { ExportFormat } from './Export'

export interface NodeData {
  duration: number
  trigger: string
  exportFormat: ExportFormat
  defaultEase: AnimEase
  timelines: AnimTimeline[]
}

export const NodeModel: NodeDataModel<NodeData> = {
  key: 'v1',
  defaults: { duration: 1, trigger: 'hover', exportFormat: 'html', defaultEase: 'ease-in-out', timelines: [] }
}
