import { bufferDecodeUtf8, nodeIdHash, nodeList, svgTransform, TreeNode } from '@figmania/common'
import { Button, Navbar, UIComponent } from '@figmania/ui'
import { setDefaultProps, setTweenProps, TweenProps } from '@figmania/webcomponent'
import { ExportRequest, ExportResponse, SelectRequest, UpdateRequest } from '../types/messages'
import { NodeData } from '../utils/shared'
import { Editor } from './Editor'
import { Export } from './Export'
import { Tutorial } from './Tutorial'

export interface UiState {
  node?: TreeNode<NodeData>
  code?: string
  exportData?: NodeData
  hasExport?: boolean
  tutorial: boolean
}

export interface AnimationProperties {
  [key: string]: number
}

export class Ui extends UIComponent<{}, UiState> {
  state: UiState = { tutorial: false }

  constructor(props: {}) {
    super(props)
    this.update = this.update.bind(this)
    this.export = this.export.bind(this)
    this.onEnableExportClick = this.onEnableExportClick.bind(this)
    this.messenger.addRequestHandler<SelectRequest, void>('select', this.handleSelectRequest.bind(this))
    this.messenger.addRequestHandler<boolean, boolean>('tutorial', this.handleTutorialRequest.bind(this))
  }

  async update(data: Partial<NodeData>, shouldExport = false): Promise<void> {
    const { node } = this.state
    if (!node) { throw new Error('Invalid node for update') }
    Object.assign(node.data, data)
    await new Promise<void>((resolve) => { this.setState({ node }, resolve) })
    await this.messenger.request<UpdateRequest, void>('update', { node })
    if (shouldExport) { await this.export() }
  }

  async export(): Promise<void> {
    const { node } = this.state
    if (!node) { return }
    const { buffer } = await this.messenger.request<ExportRequest, ExportResponse>('export', { node })
    const contents = await bufferDecodeUtf8(buffer)
    const code = svgTransform(contents, node, { replaceIds: true }, (svg) => {
      svg.removeAttribute('width')
      svg.removeAttribute('height')
      svg.setAttribute('xmlns:anim', 'http://www.w3.org/2000/anim')
      setDefaultProps(svg, { transformOrigin: '50% 50%', duration: node.data.duration, ease: node.data.ease })
      const list = nodeList<NodeData>(node).filter(({ data }) => data.active)
      for (const { id, data } of list) {
        const hash = nodeIdHash(id)
        const target = svg.getElementById(hash)
        if (!target) { continue }
        const from = data.animations.reduce<AnimationProperties>((obj, entry) => { obj[entry.type] = entry.from; return obj }, {})
        const to = data.animations.reduce<AnimationProperties>((obj, entry) => { obj[entry.type] = entry.to; return obj }, {})
        const props: TweenProps = { from, to, delay: data.delay }
        if (data.duration) { props.duration = data.duration }
        setTweenProps(target, props)
      }
      return svg
    })
    this.setState({ code })
  }

  async handleSelectRequest({ node, hasExport, exportData }: SelectRequest): Promise<void> {
    this.setState({ node, hasExport, exportData })
    if (node && hasExport) { this.export() }
  }

  async handleTutorialRequest(tutorial: boolean): Promise<boolean> {
    this.setState({ tutorial })
    return tutorial
  }

  onEnableExportClick() {
    if (!this.state.node) { return }
    this.messenger.request<{}, void>('enableExport', {})
  }

  render() {
    const { node, code, hasExport, exportData, tutorial } = this.state
    if (!node) {
      return (
        <>
          <Navbar icon="ui-forward" title="No node selected" isDisabled={true}></Navbar>
          <Tutorial messenger={this.messenger} show={tutorial}></Tutorial>
        </>
      )
    }

    if (node && hasExport) {
      return <Export messenger={this.messenger} node={node} update={this.update} code={code}></Export>
    } else if (node && exportData) {
      return <Editor node={node} update={this.update} exportData={exportData}></Editor>
    } else {
      return <>
        {node ? (
          <Navbar icon="ui-animate-off" title={node.name} isDisabled={true}>
            <Button icon={'ui-animate-on'} onClick={() => { this.onEnableExportClick() }} title="Enable SVG Export"></Button>
          </Navbar>
        ) : (
          <Navbar icon="ui-animate-off" title="No node selected" isDisabled={true}></Navbar>
        )}
        <Tutorial messenger={this.messenger} show={tutorial}></Tutorial>
      </>
    }
  }
}
