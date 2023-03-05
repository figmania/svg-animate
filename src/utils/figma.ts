import { FigmaNode, nodeClosest, nodeData, NodeDataModel, nodeHasSvgExport, nodeTree } from '@figmania/common'
import { NodeEvent, NodeType } from '../Schema'
import { NodeData } from '../types/NodeData'

export const DataModel: NodeDataModel<NodeData> = {
  key: 'data',
  defaults: { active: false, delay: 0, duration: 0.5, ease: 'power1.inOut', trigger: 'hover', animations: [], exportFormat: 'html' }
}

export function nodeToEvent(node: FigmaNode) {
  const event: NodeEvent = {
    node: nodeTree<NodeData>(node, DataModel),
    type: nodeHasSvgExport(node) ? NodeType.MASTER : NodeType.CHILD
  }
  const masterNode = nodeClosest(node, nodeHasSvgExport)
  if (masterNode) { event.masterData = nodeData<NodeData>(masterNode, DataModel) }
  return event
}