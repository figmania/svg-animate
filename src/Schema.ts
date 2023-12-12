import { CreateSchema, TreeNode } from '@figmania/common'
import { NodeData } from './types/NodeModel'

export enum NodeType { NONE, MASTER, CHILD, ORPHAN }

export interface NodeEvent {
  type: NodeType
  node?: TreeNode<NodeData>
  masterNode?: TreeNode<NodeData>
  paid: boolean
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
    data: [TreeNode<NodeData>, string]
  } | {
    name: 'purchase'
    data: ['PAID_FEATURE' | 'TRIAL_ENDED' | 'SKIP', boolean]
  }
  events: {
    name: 'node:select'
    data: NodeEvent
  } | {
    name: 'export:enable'
    data: void
  }
}>
