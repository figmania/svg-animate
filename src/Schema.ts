import { CreateSchema, TreeNode } from '@figmania/common'
import { NodeData } from './types/NodeData'

export enum NodeType { NONE, MASTER, CHILD }

export interface NodeEvent {
  node?: TreeNode<NodeData>
  type: NodeType
  masterNode?: TreeNode<NodeData>
  masterData?: NodeData
}

export interface Config {
  theme: 'dark' | 'light'
  tutorial: boolean
}

export type Schema = CreateSchema<{
  requests: {
    name: 'update'
    data: [TreeNode<NodeData>, void]
  } | {
    name: 'export'
    data: [TreeNode<NodeData>, { buffer: Uint8Array, children: TreeNode<NodeData>[] }]
  }
  events: {
    name: 'node:select'
    data: NodeEvent
  } | {
    name: 'export:enable'
    data: void
  }
}>
