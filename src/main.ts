import { FigmaController, figmaExportAsync, FigmaNode, figmaNodeById, nodeClosest, nodeData, nodeHasSvgExport, nodeList, nodeTree } from '@figmania/common'
import { AppConfig, DEFAULT_CONFIG } from './messenger/AppConfig'
import { NodeSelectEvent, NodeType } from './messenger/events/NodeSelectEvent'
import { ToastShowEvent } from './messenger/events/ToastShowEvent'
import { ExportRequest, ExportResponse } from './messenger/requests/Export'
import { UpdateRequest } from './messenger/requests/Update'
import { Schema } from './messenger/Schema'
import { DataModel, NodeData } from './utils/shared'

function nodeCreateHash(node: FigmaNode): string {
  const parts = [node.exportSettings ? node.exportSettings.filter(({ format }) => format === 'SVG').length : 0]
  return parts.map(String).join(':')
}

class Controller extends FigmaController<Schema> {
  private selectedNodeHash?: string
  private selectedNode?: FigmaNode
  private config: AppConfig = { ...DEFAULT_CONFIG }

  constructor() {
    super({ width: 400, height: 512 })

    // Message Handlers
    this.addRequestHandler('setConfig', this.handleSetConfigRequest.bind(this))
    this.addRequestHandler('update', this.handleUpdateRequest.bind(this))
    this.addRequestHandler('enableExport', this.handleEnableExportRequest.bind(this))
    this.addRequestHandler('export', this.handleExportRequest.bind(this))

    this.on('toast:show', this.onToastShow.bind(this))

    // Observe Selection Changes
    setInterval(this.observeChanges.bind(this), 500)

    // Load Settings
    figma.clientStorage.getAsync('config').then((config: Partial<AppConfig>) => {
      this.config = { ...this.config, ...config }
      this.emit('config:changed', this.config)
    })
  }

  select([figmaNode]: ReadonlyArray<SceneNode>): void {
    this.setSelectedNode(figmaNode)
    const event: NodeSelectEvent = {
      node: nodeTree<NodeData>(figmaNode, DataModel),
      type: nodeHasSvgExport(figmaNode) ? NodeType.MASTER : NodeType.CHILD
    }
    const masterNode = nodeClosest(figmaNode, nodeHasSvgExport)
    if (masterNode) { event.masterData = nodeData<NodeData>(masterNode, DataModel) }
    this.emit('node:select', event)
  }

  deselect() {
    delete this.selectedNode
    this.emit('node:select', { type: NodeType.NONE })
  }

  handleUpdateRequest({ node }: UpdateRequest) {
    const figmaNode = figmaNodeById(node.id)
    figmaNode.setPluginData('data', JSON.stringify(node.data))
  }

  async handleEnableExportRequest(): Promise<void> {
    if (!this.selectedNode) { return }
    this.selectedNode.exportSettings = [...this.selectedNode.exportSettings, {
      format: 'SVG',
      contentsOnly: true,
      svgOutlineText: true,
      svgIdAttribute: true,
      svgSimplifyStroke: true
    }]
    this.select([this.selectedNode])
  }

  async handleExportRequest({ node }: ExportRequest): Promise<ExportResponse> {
    const figmaNode = figmaNodeById(node.id)
    const buffer = await figmaExportAsync(figmaNode)
    const children = nodeList<NodeData>(node).filter(({ data }) => data.active)
    return { buffer, children }
  }

  onToastShow({ message }: ToastShowEvent): void {
    figma.notify(message)
  }

  async handleSetConfigRequest(config: Partial<AppConfig>): Promise<void> {
    this.config = { ...this.config, ...config }
    await figma.clientStorage.setAsync('config', this.config)
  }

  private setSelectedNode(node: FigmaNode | null) {
    if (node) {
      this.selectedNode = node
      this.selectedNodeHash = nodeCreateHash(node)
    } else {
      delete this.selectedNode
      delete this.selectedNodeHash
    }
  }

  private observeChanges() {
    if (!this.selectedNode) { return }
    const selectedNodeHash = nodeCreateHash(this.selectedNode)
    if (this.selectedNodeHash === selectedNodeHash) { return }
    this.select([this.selectedNode])
  }
}

new Controller()
