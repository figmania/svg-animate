import { Messenger, svgPrettify, uiDownload } from '@figmania/common'
import { Accordion, Button, Code, Input, Select } from '@figmania/ui'
import { SvgAnimateEase, SvgAnimateTrigger } from '@figmania/webcomponent'
import { debounce } from 'debounce'
import { createRef, FunctionComponent, useState } from 'react'
import { NotifyRequest } from '../types/messages'
import { DOWNLOAD_OPTIONS_MAP, EASE_SELECT_OPTIONS, ExportFormat, ExportMode, EXPORT_FORMAT_LABELS, EXPORT_FORMAT_SELECT_OPTIONS, NodeData, TRIGGER_LABELS, TRIGGER_SELECT_OPTIONS } from '../utils/shared'

export interface ExportProps {
  name: string
  data: NodeData
  code?: string
  update: (data: Partial<NodeData>, shouldExport: boolean) => Promise<void>
  messenger: Messenger
}

const EMBED_URL = 'https://cdn.jsdelivr.net/npm/@figmania/webcomponent/build/index.umd.js'

let lastExportMode: ExportMode = 'playback'

export const Export: FunctionComponent<ExportProps> = ({ name, data, code, update, messenger }) => {
  const { ease, trigger, exportFormat } = data

  const [exportMode, setExportMode] = useState<ExportMode>(lastExportMode)
  const [duration, setDuration] = useState<number>(data.duration)

  const textarea = createRef<HTMLTextAreaElement>()

  const updateExportMode = (mode: ExportMode) => {
    lastExportMode = mode
    setExportMode(mode)
  }

  const debouncedUpdateDuration = debounce(() => {
    update({ duration }, true)
  }, 500)

  const getCodeForPlayback = () => {
    return code ? `<svg-animate trigger="${trigger}">${code}</svg-animate>` : ''
  }

  const getCodeForRender = () => {
    if (!code) { return '...' }
    switch (exportFormat) {
      case 'svg': { return code }
      case 'element': { return `<svg-animate trigger="${trigger}">${code}</svg-animate>` }
      case 'html': { return `<html><head></head><body><svg-animate trigger="${trigger}">${code}</svg-animate><script src="${EMBED_URL}"></${'script'}></body></html>` }
      default: { return '</>' }
    }
  }

  if (!code) { return <div className="flex-1"></div> }
  return (
    <>
      <Accordion title={`Play ${TRIGGER_LABELS[trigger]}`} active={exportMode === 'playback'} activate={() => {
        updateExportMode('playback')
      }} renderHeader={() => (
        <Select isDisabled={exportMode !== 'playback'} className="header-select" placeholder="Trigger" value={trigger} options={TRIGGER_SELECT_OPTIONS} onChange={(option) => {
          const newTrigger = option.value as SvgAnimateTrigger
          if (trigger === newTrigger) { return }
          update({ trigger: newTrigger }, true)
        }} />
      )} renderSettings={() => (
        <div className="row">
          <div className="col">
            <label className="field-label">Default Duration</label>
            <Input name="transition-duration" icon="transition-duration" placeholder="500ms" suffix="ms" type="number" value={duration * 1000} onChange={(value) => {
              setDuration(value === '' ? 0.5 : (+value) / 1000)
              debouncedUpdateDuration()
            }} />
          </div>
          <div className="col">
            <label className="field-label">Default Easing</label>
            <Select placeholder="Default Easing" value={ease} options={EASE_SELECT_OPTIONS} onChange={(option) => {
              const newEase = option.value as SvgAnimateEase
              if (ease === newEase) { return }
              update({ ease: newEase }, true)
            }} />
          </div>
        </div>
      )}>
        <div className="playback" dangerouslySetInnerHTML={{ __html: getCodeForPlayback() }}></div>
      </Accordion>
      <Accordion title={`Export as ${EXPORT_FORMAT_LABELS[exportFormat]}`} active={exportMode === 'code'} activate={() => {
        updateExportMode('code')
      }} renderHeader={() => (
        <>
          <Select isDisabled={exportMode !== 'code'} className="header-select-small" placeholder="Export Format" value={exportFormat} options={EXPORT_FORMAT_SELECT_OPTIONS} onChange={(option) => {
            const newExportFormat = option.value as ExportFormat
            if (exportFormat === newExportFormat) { return }
            update({ exportFormat: newExportFormat }, true)
          }}></Select>
          <Button icon={'ui-clipboard'} onClick={() => {
            if (!code || !textarea.current) { return }
            textarea.current.value = getCodeForRender()
            textarea.current.select()
            document.execCommand('copy')
            messenger.request<NotifyRequest, void>('notify', { message: 'Code copied to clipboard' })
          }} />
          <Button icon={'ui-download'} onClick={() => {
            if (!code) { return }
            const { type, extension } = DOWNLOAD_OPTIONS_MAP[exportFormat]
            uiDownload(svgPrettify(getCodeForRender()), { type, filename: `${name}.${extension}` })
          }} />
        </>
      )}>
        {exportMode === 'code' && (
          <Code className='html' source={getCodeForRender()} lang='xml' />
        )}
      </Accordion>
      <textarea ref={textarea} wrap="soft" readOnly={true} />
    </>
  )
}
