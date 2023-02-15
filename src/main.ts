import { FigmaController, figmaExportAsync, FigmaNode, figmaNodeById, nodeClosest, nodeData, nodeHasSvgExport, nodeList, nodeTree } from '@figmania/common'
import { AppSchema, ExportRequest, ExportResponse, NotifyRequest, SelectRequest, UpdateRequest } from './messenger/AppSchema'
import { DataModel, NodeData } from './utils/shared'

function nodeCreateHash(node: FigmaNode): string {
  const parts = [node.exportSettings ? node.exportSettings.filter(({ format }) => format === 'SVG').length : 0]
  return parts.map(String).join(':')
}

class Controller extends FigmaController<AppSchema> {
  private selectedNodeHash?: string
  private selectedNode?: FigmaNode

  constructor() {
    super({ width: 400, height: 512 })

    // Message Handlers
    this.addRequestHandler('update', this.handleUpdateRequest.bind(this))
    this.addRequestHandler('enableExport', this.handleEnableExportRequest.bind(this))
    this.addRequestHandler('export', this.handleExportRequest.bind(this))
    this.addRequestHandler('notify', this.handleNotifyRequest.bind(this))
    this.addRequestHandler('tutorial', this.handleTutorialRequest.bind(this))

    // Observe Selection Changes
    setInterval(this.observeChanges.bind(this), 500)

    // Load Settings
    figma.clientStorage.getAsync('tutorial').then((result) => {
      this.request('tutorial', !!result)
    })
  }

  select([figmaNode]: ReadonlyArray<SceneNode>): void {
    this.setSelectedNode(figmaNode)
    const request: SelectRequest = { node: nodeTree<NodeData>(figmaNode, DataModel), hasExport: nodeHasSvgExport(figmaNode) }
    const exportNode = nodeClosest(figmaNode, nodeHasSvgExport)
    if (exportNode) { request.exportData = nodeData<NodeData>(exportNode, DataModel) }
    this.request('select', request)
  }

  deselect() {
    delete this.selectedNode
    this.request('select', {})
  }

  async handleUpdateRequest({ node }: UpdateRequest) {
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

  async handleNotifyRequest({ message }: NotifyRequest): Promise<void> {
    figma.notify(message)
  }

  async handleTutorialRequest(tutorial: boolean): Promise<boolean> {
    await figma.clientStorage.setAsync('tutorial', tutorial)
    this.request('tutorial', tutorial)
    return tutorial
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
