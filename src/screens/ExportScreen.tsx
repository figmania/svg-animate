import { format, uiDownload } from '@figmania/common'
import { Accordion, Button, Code, Input, Select } from '@figmania/ui'
import { debounce } from 'debounce'
import { createRef, FunctionComponent, useState } from 'react'
import { Playback } from '../components/Playback'
import { useMessenger } from '../providers/MessengerProvider'
import { DOWNLOAD_OPTIONS_MAP, EASE_SELECT_OPTIONS, ExportFormat, ExportMode, EXPORT_FORMAT_SELECT_OPTIONS, NodeData, TRIGGER_SELECT_OPTIONS } from '../utils/shared'
import styles from './ExportScreen.module.scss'

export interface ExportScreenProps {
  name: string
  data: NodeData
  code?: string
  update: (data: Partial<NodeData>, shouldExport: boolean) => Promise<void>
}

const EMBED_URL = 'https://cdn.jsdelivr.net/npm/@figmania/webcomponent/build/index.umd.js'

let lastExportMode: ExportMode = 'playback'

export const ExportScreen: FunctionComponent<ExportScreenProps> = ({ name, data, code, update }) => {
  const messenger = useMessenger()
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

  const getCodeForRender = () => {
    if (!code) { return '...' }
    switch (exportFormat) {
      case 'svg': { return code }
      case 'element': { return `<svg-animate trigger="${trigger}">${code}</svg-animate>` }
      case 'html': { return `<html><head></head><body><svg-animate trigger="${trigger}">${code}</svg-animate><script src="${EMBED_URL}"></${'script'}></body></html>` }
      default: { return '</>' }
    }
  }

  if (!code) { return <div className={styles['flex-1']}></div> }
  return (
    <>
      <Accordion title={'Preview'} active={exportMode === 'playback'} activate={() => {
        updateExportMode('playback')
      }} renderHeader={() => (
        <>
          <Button icon={'ui-clipboard'} onClick={() => {
            if (!code || !textarea.current) { return }
            textarea.current.value = format(getCodeForRender())
            textarea.current.select()
            document.execCommand('copy')
            messenger.emit('toast:show', { message: 'Code copied to clipboard' })
          }} />
          <Button icon={'ui-download'} onClick={() => {
            if (!code) { return }
            const { type, extension } = DOWNLOAD_OPTIONS_MAP[exportFormat]
            uiDownload(format(getCodeForRender()), { type, filename: `${name}.${extension}` })
          }} />
        </>
      )} renderSettings={() => (
        <div className={styles['row']}>
          <div className={styles['col']}>
            <label className={styles['field-label']}>Default Duration</label>
            <Input name="transition-duration" icon="transition-duration" placeholder="500ms" suffix="ms" type="number" value={duration * 1000} onChange={(value) => {
              setDuration(value === '' ? 0.5 : (+value) / 1000)
              debouncedUpdateDuration()
            }} />
          </div>
          <div className={styles['col']}>
            <label className={styles['field-label']}>Default Easing</label>
            <Select placeholder="Default Easing" value={ease} options={EASE_SELECT_OPTIONS} onChange={(option) => {
              const newEase = option.value
              if (ease === newEase) { return }
              update({ ease: newEase }, true)
            }} />
          </div>
        </div>
      )}>
        <Playback code={code} loop={trigger === 'loop'} />
      </Accordion>
      <Accordion title={'View Code'} active={exportMode === 'code'} activate={() => {
        updateExportMode('code')
      }} renderHeader={() => (
        <>
          <Select isDisabled={exportMode !== 'code'} className={styles['header-select']} placeholder="Export Format" value={exportFormat} options={EXPORT_FORMAT_SELECT_OPTIONS} onChange={(option) => {
            const newExportFormat = option.value as ExportFormat
            if (exportFormat === newExportFormat) { return }
            update({ exportFormat: newExportFormat }, true)
          }}></Select>
          <Select isDisabled={exportMode !== 'code' || exportFormat === 'svg'} className={styles['header-select']} placeholder="Trigger" value={trigger} options={TRIGGER_SELECT_OPTIONS} onChange={(option) => {
            const newTrigger = option.value
            if (trigger === newTrigger) { return }
            update({ trigger: newTrigger }, true)
          }} />
        </>
      )}>
        {exportMode === 'code' && (
          <Code language='html' source={getCodeForRender()} indent />
        )}
      </Accordion>
      <textarea ref={textarea} wrap="soft" readOnly={true} className={styles['textarea']} />
    </>
  )
}
