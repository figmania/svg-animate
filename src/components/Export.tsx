import { Messenger, svgPrettify, TreeNode, uiDownload } from '@figmania/common'
import { Accordion, Button, Code, Input, Select, SelectOption } from '@figmania/ui'
import { SvgAnimateEase, SvgAnimateTrigger } from '@figmania/webcomponent'
import { debounce } from 'debounce'
import { Component, createRef } from 'react'
import { NotifyRequest } from '../types/messages'
import { DOWNLOAD_OPTIONS_MAP, EASE_SELECT_OPTIONS, ExportFormat, ExportMode, EXPORT_FORMAT_LABELS, EXPORT_FORMAT_SELECT_OPTIONS, NodeData, TRIGGER_LABELS, TRIGGER_SELECT_OPTIONS } from '../utils/shared'

export interface ExportProps {
  node: TreeNode<NodeData>
  code?: string
  update: (data: Partial<NodeData>, shouldExport: boolean) => Promise<void>
  messenger: Messenger
}

export interface ExportState {
  exportMode: ExportMode
  duration: number
}

const EMBED_URL = 'https://cdn.jsdelivr.net/npm/@figmania/webcomponent/build/index.umd.js'

let lastExportMode: ExportMode = 'playback'

export class Export extends Component<ExportProps, ExportState> {
  private textarea = createRef<HTMLTextAreaElement>()

  constructor(props: ExportProps) {
    super(props)

    this.state = { exportMode: lastExportMode, duration: props.node.data.duration }

    this.updateExportMode = this.updateExportMode.bind(this)
    this.onDownloadClick = this.onDownloadClick.bind(this)
    this.onClipboardClick = this.onClipboardClick.bind(this)
    this.onTriggerChange = this.onTriggerChange.bind(this)
    this.onDurationChange = this.onDurationChange.bind(this)
    this.onEaseChange = this.onEaseChange.bind(this)
    this.onExportFormatChange = this.onExportFormatChange.bind(this)
  }

  async updateExportMode(exportMode: ExportMode) {
    lastExportMode = exportMode
    this.setState({ exportMode })
  }

  async onDownloadClick() {
    if (!this.props.code) { return }
    const { type, extension } = DOWNLOAD_OPTIONS_MAP[this.props.node.data.exportFormat]
    uiDownload(svgPrettify(this.codeForRender), { type, filename: `${this.name}.${extension}` })
  }

  async onClipboardClick() {
    if (!this.props.code || !this.textarea.current) { return }
    this.textarea.current.value = this.codeForRender
    this.textarea.current.select()
    document.execCommand('copy')
    this.props.messenger.request<NotifyRequest, void>('notify', { message: 'Code copied to clipboard' })
  }

  async onTriggerChange(option: SelectOption) {
    const trigger = option.value as SvgAnimateTrigger
    if (this.props.node.data.trigger === trigger) { return }
    await this.props.update({ trigger }, true)
  }

  debouncedUpdateDuration = debounce(() => {
    this.props.update({ duration: this.state.duration }, true)
  }, 500)

  onDurationChange(value: string | number) {
    const duration = value === '' ? 0.5 : (+value) / 1000
    this.setState({ duration })
    this.debouncedUpdateDuration()
  }

  async onEaseChange(option: SelectOption) {
    const ease = option.value as SvgAnimateEase
    if (this.props.node.data.ease === ease) { return }
    await this.props.update({ ease }, true)
  }

  async onExportFormatChange(option: SelectOption) {
    const exportFormat = option.value as ExportFormat
    if (this.props.node.data.exportFormat === exportFormat) { return }
    await this.props.update({ exportFormat }, true)
  }

  render() {
    const { exportMode, duration } = this.state
    const { code, node: { data: { ease, trigger, exportFormat } } } = this.props
    if (!code) { return <div className="flex-1"></div> }
    return <>
      <Accordion title={`Play ${TRIGGER_LABELS[trigger]}`} active={exportMode === 'playback'} activate={() => { this.updateExportMode('playback') }} renderHeader={() => (
        <Select isDisabled={exportMode !== 'playback'} className="header-select" placeholder="Trigger" value={trigger} options={TRIGGER_SELECT_OPTIONS} onChange={(option) => { this.onTriggerChange(option) }}></Select>
      )} renderSettings={() => (
        <div className="row">
          <div className="col">
            <label className="field-label">Default Duration</label>
            <Input name="transition-duration" icon="transition-duration" placeholder="500ms" suffix="ms" type="number" value={duration * 1000} onChange={this.onDurationChange}></Input>
          </div>
          <div className="col">
            <label className="field-label">Default Easing</label>
            <Select placeholder="Default Easing" value={ease} options={EASE_SELECT_OPTIONS} onChange={(option) => { this.onEaseChange(option) }}></Select>
          </div>
        </div>
      )}>
        <div className="playback" dangerouslySetInnerHTML={{ __html: this.codeForPlayback }}></div>
      </Accordion>
      <Accordion title={`Export as ${EXPORT_FORMAT_LABELS[exportFormat]}`} active={exportMode === 'code'} activate={() => { this.updateExportMode('code') }} renderHeader={() => (
        <>
          <Select isDisabled={exportMode !== 'code'} className="header-select-small" placeholder="Export Format" value={exportFormat} options={EXPORT_FORMAT_SELECT_OPTIONS} onChange={(option) => { this.onExportFormatChange(option) }}></Select>
          <Button icon={'ui-clipboard'} onClick={() => { this.onClipboardClick() }}></Button>
          <Button icon={'ui-download'} onClick={() => { this.onDownloadClick() }}></Button>
        </>
      )}>
        {exportMode === 'code' && (
          <Code className='html' source={svgPrettify(this.codeForRender)} lang='xml' />
        )}
      </Accordion>
      <textarea ref={this.textarea} wrap="soft" readOnly={true}></textarea>
    </>
  }

  get id() { return this.props.node.id }
  get name() { return this.props.node.name }
  get data() { return this.props.node.data }
  get children() { return this.props.node.children }

  get codeForPlayback() {
    const { code, node: { data: { trigger } } } = this.props
    if (!code) { return '' }
    return `<svg-animate trigger="${trigger}">${code}</svg-animate>`
  }

  get codeForRender(): string {
    const { code, node: { data: { trigger, exportFormat } } } = this.props
    if (!code) { return '...' }
    switch (exportFormat) {
      case 'svg': { return code }
      case 'element': { return `<svg-animate trigger="${trigger}">${code}</svg-animate>` }
      case 'html': { return `<html><head></head><body><svg-animate trigger="${trigger}">${code}</svg-animate><script src="${EMBED_URL}"></${'script'}></body></html>` }
      default: { return '</>' }
    }
  }
}
