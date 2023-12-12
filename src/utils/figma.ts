import { FigmaNode, nodeClosest, nodeHasSvgExport, nodeTree } from '@figmania/common'
import { customAlphabet } from 'nanoid'
import { NodeEvent, NodeType } from '../Schema'
import { NodeData, NodeModel } from '../types/NodeModel'

export interface NodeSelection {
  node?: FigmaNode
  hash?: string
}

export function nodeCreateHash(node: FigmaNode): string {
  const parts = [node.exportSettings ? node.exportSettings.filter(({ format }) => format === 'SVG').length : 0]
  return parts.map(String).join(':')
}

export function nodeToEvent(figmaNode: FigmaNode): NodeEvent {
  const node = nodeTree<NodeData>(figmaNode, NodeModel)
  const figmaMasterNode = nodeClosest(figmaNode, nodeHasSvgExport)
  let type: NodeType
  if (nodeHasSvgExport(figmaNode)) {
    type = NodeType.MASTER
  } else if (figmaMasterNode) {
    type = NodeType.CHILD
  } else {
    type = NodeType.ORPHAN
  }
  let masterNode = type === NodeType.MASTER ? node : undefined
  if (!masterNode && figmaMasterNode) { masterNode = nodeTree<NodeData>(figmaMasterNode, NodeModel) }
  return { type, node, masterNode }
}

export const uuid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 12)
