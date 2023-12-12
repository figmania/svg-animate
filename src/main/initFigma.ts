import { configPlugin, createController, createFigmaDelegate, figmaExportAsync, figmaNodeById, nodePlugin, notifyPlugin, resizePlugin, setNodeData } from '@figmania/common'
import { Config, NodeType, Schema } from '../Schema'
import { NodeData, NodeModel } from '../types/NodeModel'
import { NodeSelection, nodeCreateHash, nodeToEvent } from '../utils/figma'
import { runMigrations } from '../utils/migrate'

export function initFigma() {
  createController<Schema>(createFigmaDelegate(), async (controller) => {
    const selection: NodeSelection = {}
    figma.on('run', runMigrations)
    const size = await resizePlugin(controller, { width: 400, height: 512 })
    figma.showUI(__html__, { visible: true, ...size })
    configPlugin<Config>(controller, { tutorial: true, userId: figma.currentUser?.id ?? 'unknown' })
    notifyPlugin(controller)
    nodePlugin(controller, (node) => {
      if (!node) {
        delete selection.node
        delete selection.hash
        return { type: NodeType.NONE, paid: figma.payments?.status.type === 'PAID' }
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
      setNodeData<NodeData>(figmaNode, NodeModel, node.data)
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

    controller.addRequestHandler('export', (node) => {
      const figmaNode = figmaNodeById(node.id)
      return figmaExportAsync(figmaNode)
    })

    controller.addRequestHandler('purchase', (interstitial) => {
      if (!figma.payments) { return false }
      return figma.payments.initiateCheckoutAsync({ interstitial }).then(() => {
        return figma.payments?.status.type === 'PAID'
      })
    })
  })
}
