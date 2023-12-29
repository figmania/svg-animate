/* eslint-disable @typescript-eslint/no-explicit-any */
import { TreeNode } from '@figmania/common'
import { createContext } from 'react'
import { NodeEvent } from '../Schema'
import { NodeData } from '../types/NodeModel'

export interface NodeContextValue extends NodeEvent {
  update: (node: TreeNode<NodeData>, data?: Partial<NodeData>) => Promise<void>
}

export const NodeContext = createContext<NodeContextValue>(null!)
