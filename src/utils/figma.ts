import { FigmaNode, nodeHasSvgExport, nodeTree } from '@figmania/common'
import { customAlphabet } from 'nanoid/non-secure'
import { NodeEvent, NodeType } from '../Schema'
import { NodeData, NodeModel } from '../types/NodeModel'
import { DISABLE_PAYMENTS } from './contants'

export const uid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 12)

export interface NodeSelection {
  node?: FigmaNode
  hash?: string
}

export function nodeCreateHash(node: FigmaNode): string {
  const parts = [node.exportSettings ? node.exportSettings.filter(({ format }) => format === 'SVG').length : 0]
  return parts.map(String).join(':')
}

export function nodeFurthest(figmaNode: FigmaNode, predicate: (child: FigmaNode) => boolean): FigmaNode | null {
  let result: FigmaNode | null = null
  let current: FigmaNode = figmaNode
  while (current) {
    if (current && predicate(current)) { result = current }
    current = current.parent as FigmaNode
  }
  return result
}

export function nodeToEvent(figmaNode: FigmaNode): NodeEvent {
  const node = nodeTree<NodeData>(figmaNode, NodeModel)
  const figmaMasterNode = nodeFurthest(figmaNode, nodeHasSvgExport)
  let type: NodeType
  if (nodeHasSvgExport(figmaNode)) {
    type = NodeType.MASTER
  } else if (figmaMasterNode) {
    type = NodeType.CHILD
  } else {
    type = NodeType.ORPHAN
  }
  const masterNode = figmaMasterNode ? nodeTree<NodeData>(figmaMasterNode, NodeModel) : undefined
  return { uuid: getDocumentUuid(), type, node, masterNode, paid: figmaIsPaid(), width: figmaMasterNode?.width, height: figmaMasterNode?.height }
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

export function ensurePluginData(node: FigmaNode | PageNode | DocumentNode, key: string, generatorFn: () => string) {
  const value = node.getPluginData(key)
  if (value) { return value }
  const newValue = generatorFn()
  node.setPluginData(key, newValue)
  return newValue
}

export function getDocumentUuid() {
  return ensurePluginData(figma.root, 'uuid', () => uid())
}
