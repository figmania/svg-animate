import { AnimEase } from '@figmania/common'
import { ICON, NumberInput, Select } from '@figmania/ui'
import clsx from 'clsx'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { useNode } from '../hooks/useNode'
import { ExportFormat } from '../types/Export'
import { HelpText } from '../utils/help'
import { getNodeTreeMaxDuration } from '../utils/math'
import { EASE_SELECT_OPTIONS, EXPORT_FORMAT_SELECT_OPTIONS, TRIGGER_SELECT_OPTIONS } from '../utils/shared'
import { HelpMarker } from './HelpMarker'
import styles from './SettingsPanel.module.scss'

export interface SettingsPanelProps {
  open: boolean
}

export const SettingsPanel: FunctionComponent<SettingsPanelProps> = ({ open }) => {
  const { masterNode, update } = useNode()
  const [duration, setDuration] = useState<number>(masterNode?.data.duration ?? 1000)
  const minDuration = useMemo(() => masterNode ? getNodeTreeMaxDuration(masterNode) : 0, [masterNode?.data])

  useEffect(() => {
    if (!masterNode) { return }
    setDuration(masterNode.data.duration)
  }, [masterNode?.data.duration])

  const debouncedUpdateDuration = useDebounce((value: number) => {
    if (!masterNode) { return }
    update(masterNode, { duration: value })
  }, 500)

  if (!masterNode) { return <></> }

  return (
    <div className={clsx(styles['settings'], open && styles['open'])}>
      <HelpMarker text={HelpText.SETTINGS_DURATION}>
        <div className={styles['setting']}>
          <label className={styles['setting-label']}>Duration</label>
          <NumberInput
            className={styles['setting-input']}
            value={duration} defaultValue={masterNode.data.duration} precision={3}
            min={minDuration} max={10} step={0.1}
            name="transition-duration" icon={ICON.TRANSITION_DURATION} suffix="ms"
            style={{ width: 88 }}
            onChange={(value) => {
              setDuration(value)
              debouncedUpdateDuration(value)
            }} />
        </div>
      </HelpMarker>
      <HelpMarker text={HelpText.SETTINGS_EASING}>
        <div className={styles['setting']}>
          <label className={styles['setting-label']}>Easing</label>
          <Select
            className={styles['setting-select']}
            placeholder="Default Easing" value={masterNode.data.defaultEase} options={EASE_SELECT_OPTIONS} onChange={(option) => {
              const newEase = option.value as AnimEase
              if (!masterNode || masterNode.data.defaultEase === newEase) { return }
              update(masterNode, { defaultEase: newEase })
            }} />
        </div>
      </HelpMarker>
      <HelpMarker text={HelpText.SETTINGS_FORMAT}>
        <div className={styles['setting']}>
          <label className={styles['setting-label']}>Format</label>
          <Select className={styles['setting-select']} placeholder="Format" value={masterNode.data.exportFormat} options={EXPORT_FORMAT_SELECT_OPTIONS} onChange={(option) => {
            const newExportFormat = option.value as ExportFormat
            if (!masterNode || masterNode.data.exportFormat === newExportFormat) { return }
            update(masterNode, { exportFormat: newExportFormat })
          }} />
        </div>
      </HelpMarker>

      {masterNode.data.exportFormat !== 'svg' && (
        <HelpMarker text={HelpText.SETTINGS_TRIGGER}>
          <div className={styles['setting']}>
            <label className={styles['setting-label']}>Trigger</label>
            <Select className={styles['setting-select']} placeholder="Trigger" value={masterNode.data.trigger} options={TRIGGER_SELECT_OPTIONS} onChange={(option) => {
              if (!masterNode || masterNode.data.trigger === option.value) { return }
              update(masterNode, { trigger: option.value })
            }} />
          </div>
        </HelpMarker>
      )}
    </div>
  )
}
