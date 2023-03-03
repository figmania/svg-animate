import { TreeNode } from '@figmania/common'
import { NodeData } from '../../utils/shared'

export enum NodeType { NONE, MASTER, CHILD }

export interface NodeSelectEvent {
  node?: TreeNode<NodeData>
  type: NodeType
  masterNode?: TreeNode<NodeData>
  masterData?: NodeData
}
