import { configPlugin, createController, createFigmaDelegate, figmaExportAsync, FigmaNode, figmaNodeById, nodeList, nodePlugin, notifyPlugin, resizePlugin } from '@figmania/common'
import { Config, NodeType, Schema } from './Schema'
import { NodeData } from './types/NodeData'
import { nodeToEvent } from './utils/figma'

interface NodeSelection {
  node?: FigmaNode
  hash?: string
}

function nodeCreateHash(node: FigmaNode): string {
  const parts = [node.exportSettings ? node.exportSettings.filter(({ format }) => format === 'SVG').length : 0]
  return parts.map(String).join(':')
}

createController<Schema>(createFigmaDelegate(), async (controller) => {
  const selection: NodeSelection = {}

  const size = await resizePlugin(controller, { width: 400, height: 512 })
  figma.showUI(__html__, { visible: true, ...size })
  configPlugin<Config>(controller, { theme: 'dark', tutorial: true })
  notifyPlugin(controller)
  nodePlugin(controller, (node) => {
    if (!node) {
      delete selection.node
      delete selection.hash
      return { type: NodeType.NONE }
    } else {
      selection.node = node
      selection.hash = nodeCreateHash(node)
      return nodeToEvent(node)
    }
  })

  setInterval(() => {
    if (!selection.node) { return }
    const hash = nodeCreateHash(selection.node)
    if (selection.hash === hash) { return }
    selection.hash = hash
    controller.emit('node:select', nodeToEvent(selection.node))
  }, 500)

  controller.addRequestHandler('update', (node) => {
    const figmaNode = figmaNodeById(node.id)
    figmaNode.setPluginData('data', JSON.stringify(node.data))
  })

  controller.addEventHandler('export:enable', () => {
    if (!selection.node) { return }
    selection.node.exportSettings = [...selection.node.exportSettings, {
      format: 'SVG',
      contentsOnly: true,
      svgOutlineText: true,
      svgIdAttribute: true,
      svgSimplifyStroke: true
    }]
    selection.hash = nodeCreateHash(selection.node)
    controller.emit('node:select', nodeToEvent(selection.node))
  })

  controller.addRequestHandler('export', async (node) => {
    const figmaNode = figmaNodeById(node.id)
    const buffer = await figmaExportAsync(figmaNode)
    const children = nodeList<NodeData>(node).filter(({ data }) => data.active)
    return { buffer, children }
  })
})
