import { CreateSchema, TreeNode } from '@figmania/common'
import { NodeData } from './types/NodeData'

export enum NodeType { NONE, MASTER, CHILD }

export interface NodeEvent {
  node?: TreeNode<NodeData>
  type: NodeType
  masterNode?: TreeNode<NodeData>
  masterData?: NodeData
}

export interface User {
  id: string
  name: string
  email: string
  image: string
  accessToken: string
  refreshToken: string
}

export interface Config {
  tutorial: boolean
  userId: string
  user?: User
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
