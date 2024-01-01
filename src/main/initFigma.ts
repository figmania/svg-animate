import { configPlugin, createController, createFigmaDelegate, figmaExportAsync, figmaNodeById, nodePlugin, notifyPlugin, resizePlugin, setNodeData } from '@figmania/common'
import { Config, NodeType, Schema, User } from '../Schema'
import { NodeData, NodeModel } from '../types/NodeModel'
import { NodeSelection, figmaCheckout, figmaIsPaid, getDocumentUuid, nodeCreateHash, nodeToEvent } from '../utils/figma'
import { runMigrations } from '../utils/migrate'

export function initFigma() {
  createController<Schema>(createFigmaDelegate(), async (controller) => {
    const selection: NodeSelection = {}
    figma.on('run', runMigrations)
    const size = await resizePlugin(controller, { width: 422, height: 512 })
    figma.showUI(__html__, { visible: true, themeColors: true, ...size })
    const user: User | undefined = figma.currentUser ? {
      id: figma.currentUser.id!,
      name: figma.currentUser.name!,
      image: figma.currentUser.photoUrl!
    } : undefined
    configPlugin<Config>(controller, { tutorial: true, help: true, user, userId: figma.currentUser?.id ?? 'unknown' })
    notifyPlugin(controller)
    nodePlugin(controller, (node) => {
      if (!node) {
        delete selection.node
        delete selection.hash
        return { uuid: getDocumentUuid(), type: NodeType.NONE, paid: figmaIsPaid() }
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

    controller.addRequestHandler('purchase', figmaCheckout)
  })
}
