import { SchemaConfig, TreeNode } from '@figmania/common'
import { NodeData } from '../utils/shared'

export interface SelectRequest {
  node?: TreeNode<NodeData>
  hasExport?: boolean
  exportNode?: TreeNode<NodeData>
  exportData?: NodeData
}

export interface UpdateRequest {
  node: TreeNode<NodeData>
}

export interface ExportRequest {
  node: TreeNode<NodeData>
}

export interface ExportResponse {
  buffer: Uint8Array
  children: TreeNode<NodeData>[]
}

export interface NotifyRequest {
  message: string
}


export type AppSchema = SchemaConfig<{
  name: 'export'
  request: ExportRequest
  response: ExportResponse
} | {
  name: 'select'
  request: SelectRequest
  response: void
} | {
  name: 'tutorial'
  request: boolean
  response: boolean
} | {
  name: 'update'
  request: UpdateRequest
  response: void
} | {
  name: 'enableExport'
  request: {}
  response: void
} | {
  name: 'notify'
  request: NotifyRequest
  response: void
}>
