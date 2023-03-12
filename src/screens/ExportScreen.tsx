import { prettyPrint, uiDownload } from '@figmania/common'
import { Accordion, Button, Code, ICON, NumberInput, Select, useClipboard, useNotify } from '@figmania/ui'
import { debounce } from 'debounce'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { Playback } from '../components/Playback'
import { ExportFormat, ExportMode } from '../types/Export'
import { NodeData } from '../types/NodeData'
import { DOWNLOAD_OPTIONS_MAP, EASE_SELECT_OPTIONS, EXPORT_FORMAT_SELECT_OPTIONS, TRIGGER_SELECT_OPTIONS } from '../utils/shared'
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
  const clipboard = useClipboard()
  const notify = useNotify()
  const { ease, trigger, exportFormat } = data

  const [exportMode, setExportMode] = useState<ExportMode>(lastExportMode)
  const [duration, setDuration] = useState<number>(data.duration)

  /// @TODO
  useEffect(() => {

  })

  const updateExportMode = (mode: ExportMode) => {
    lastExportMode = mode
    setExportMode(mode)
  }

  const debouncedUpdateDuration = debounce((value: number) => {
    console.log('duration', value)
    update({ duration: value }, true)
  }, 500)

  const formattedCode = useMemo(() => {
    if (!code) { return 'Loading ...' }
    switch (exportFormat) {
      case 'svg': { return code }
      case 'element': { return `<svg-animate trigger="${trigger}">${code}</svg-animate>` }
      case 'html': { return `<html><head></head><body><svg-animate trigger="${trigger}">${code}</svg-animate><script src="${EMBED_URL}"></${'script'}></body></html>` }
      default: { return '</>' }
    }
  }, [code, exportFormat, trigger])

  return (
    <>
      <Accordion title={'Preview'} active={exportMode === 'playback'} activate={() => {
        updateExportMode('playback')
      }} renderHeader={() => (
        <>
          <Button icon={ICON.UI_CLIPBOARD} onClick={() => {
            if (!code) { return }
            clipboard(prettyPrint(formattedCode))
            notify('Code copied to clipboard')
          }} />
          <Button icon={ICON.UI_DOWNLOAD} onClick={() => {
            if (!code) { return }
            const { type, extension } = DOWNLOAD_OPTIONS_MAP[exportFormat]
            uiDownload(prettyPrint(formattedCode), { type, filename: `${name}.${extension}` })
          }} />
        </>
      )} renderSettings={() => (
        <div className={styles['row']}>
          <div className={styles['col']}>
            <label className={styles['field-label']}>Default Duration</label>
            <NumberInput
              value={duration} defaultValue={data.duration ?? 0.5} precision={3} min={0.1} max={100} step={0.1}
              name="transition-duration" icon={ICON.TRANSITION_DURATION} suffix="ms"
              onChange={(value) => {
                setDuration(value)
                debouncedUpdateDuration(value)
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
        {code && <Playback code={code} loop={trigger === 'loop'} />}
      </Accordion>
      <Accordion title={'View Code'} active={exportMode === 'code'} activate={() => {
        updateExportMode('code')
      }} renderHeader={() => (
        <>
          <Select disabled={exportMode !== 'code'} className={styles['header-select']} placeholder="Export Format" value={exportFormat} options={EXPORT_FORMAT_SELECT_OPTIONS} onChange={(option) => {
            const newExportFormat = option.value as ExportFormat
            if (exportFormat === newExportFormat) { return }
            update({ exportFormat: newExportFormat }, true)
          }} />
          <Select disabled={exportMode !== 'code' || exportFormat === 'svg'} className={styles['header-select']} placeholder="Trigger" value={trigger} options={TRIGGER_SELECT_OPTIONS} onChange={(option) => {
            const newTrigger = option.value
            if (trigger === newTrigger) { return }
            update({ trigger: newTrigger }, true)
          }} />
        </>
      )}>
        {exportMode === 'code' && (
          <Code value={formattedCode} indent />
        )}
      </Accordion>
    </>
  )
}
