import { FigmaNode, nodeClosest, nodeHasSvgExport, nodeTree } from '@figmania/common'
import { NodeEvent, NodeType } from '../Schema'
import { NodeData, NodeModel } from '../types/NodeModel'
import { DISABLE_PAYMENTS } from './contants'

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
  return { type, node, masterNode, paid: figmaIsPaid(), width: figmaNode.width, height: figmaNode.height }
}

export function figmaIsPaid(): boolean {
  if (DISABLE_PAYMENTS) { return true }
  return !figma.payments || figma.payments.status.type === 'PAID'
}

export async function figmaCheckout(interstitial: 'PAID_FEATURE' | 'TRIAL_ENDED' | 'SKIP'): Promise<boolean> {
  if (DISABLE_PAYMENTS) { return true }
  if (!figma.payments) { return false }
  if (figma.payments.status.type !== 'PAID') {
    await figma.payments.initiateCheckoutAsync({ interstitial })
  }
  return figma.payments.status.type === 'PAID'
}
