import { TreeNode } from '@figmania/common'
import { NodeData } from '../../utils/shared'

export interface ExportRequest {
  node: TreeNode<NodeData>
}

export interface ExportResponse {
  buffer: Uint8Array
  children: TreeNode<NodeData>[]
}