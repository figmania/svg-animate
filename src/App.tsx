import { prettyPrint, transformSvg, uiDownload } from '@figmania/common'
import { Button, ICON, Tab, Tabs, useClipboard, useConfig, useController, useNotify } from '@figmania/ui'
import clsx from 'clsx'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import styles from './App.module.scss'
import { Config, Schema } from './Schema'
import { ExportButton } from './components/ExportButton'
import { HelpBar } from './components/HelpBar'
import { HelpMarker } from './components/HelpMarker'
import { SettingsPanel } from './components/SettingsPanel'
import { MPEvent, useAnalytics } from './hooks/useAnalytics'
import { useNode } from './hooks/useNode'
import { EditorScreen } from './screens/EditorScreen'
import { ExportScreen } from './screens/ExportScreen'
import { PreviewScreen } from './screens/PreviewScreen'
import { TutorialScreen } from './screens/TutorialScreen'
import { getFormattedCode } from './utils/code'
import { HelpText } from './utils/help'
import { nodeTreeHasTransitions } from './utils/math'
import { DOWNLOAD_OPTIONS_MAP } from './utils/shared'

const ScreenComponents: FunctionComponent[] = [PreviewScreen, EditorScreen, ExportScreen]
const ScreenNames: string[] = ['Preview', 'Editor', 'Export']

export const App: FunctionComponent = () => {
  const [screen, setScreen] = useState(0)
  const clipboard = useClipboard()
  const notify = useNotify()
  const controller = useController<Schema>()
  const { node, masterNode } = useNode()
  const [showSettings, setShowSettings] = useState(false)
  const [config, saveConfig] = useConfig<Config>()
  const { identify, trackEvent } = useAnalytics()

  useEffect(() => {
    if (!config.userId || config.userId === 'unknown') { return }
    identify(config.userId, config.user)
  }, [config.userId])

  useEffect(() => {
    if (!ScreenNames[screen]) { return }
    trackEvent(MPEvent.VIEW_SCREEN, { name: ScreenNames[screen] })
  }, [screen])

  const hasTransitions = useMemo(() => {
    return masterNode ? nodeTreeHasTransitions(masterNode) : false
  }, [masterNode])

  useEffect(() => {
    if (!node || !masterNode) { return }
    if (screen === 1 && node.id === masterNode.id && hasTransitions) {
      // Editor to Preview
      setScreen(0)
    } else if (screen === 0 && node.id !== masterNode.id) {
      // Preview to Editor
      setScreen(1)
    }
  }, [node, masterNode])

  const Component = ScreenComponents[screen]
  return (
    <div className={styles['layout']}>
      <Tabs className={styles['tabs']} selectedIndex={screen} items={[
        <HelpMarker text={HelpText.TAB_PREVIEW}><Tab label='Preview' /></HelpMarker>,
        <HelpMarker text={HelpText.TAB_EDITOR}><Tab label='Editor' /></HelpMarker>,
        <HelpMarker text={HelpText.TAB_EXPORT}><Tab label='Export' /></HelpMarker>
      ]} onChange={setScreen}>
        {node && masterNode ? (
          <>
            <HelpMarker text={HelpText.EXPORT}>
              <ExportButton icon={ICON.UI_VIDEO} />
            </HelpMarker>
            <HelpMarker text={HelpText.COPY_TO_CLIPBOARD}>
              <Button icon={ICON.UI_CLIPBOARD} onClick={() => {
                controller.request('export', masterNode)
                  .then((value) => transformSvg(value, masterNode))
                  .then((value) => getFormattedCode(value, masterNode.data.exportFormat, masterNode.data.trigger))
                  .then((value) => prettyPrint(value))
                  .then((value) => {
                    clipboard(value)
                    trackEvent(MPEvent.EXPORT_SVG, { type: 'clipboard', size: value.length })
                    notify('Code copied to clipboard')
                  })
              }} />
            </HelpMarker>
            <HelpMarker text={HelpText.DOWNLOAD_TO_DISK}>
              <Button icon={ICON.UI_DOWNLOAD} onClick={() => {
                controller.request('export', masterNode)
                  .then((value) => transformSvg(value, masterNode))
                  .then((value) => getFormattedCode(value, masterNode.data.exportFormat, masterNode.data.trigger))
                  .then((value) => prettyPrint(value))
                  .then((value) => {
                    trackEvent(MPEvent.EXPORT_SVG, { type: 'download', size: value.length })
                    const { type, extension } = DOWNLOAD_OPTIONS_MAP[masterNode.data.exportFormat]
                    uiDownload(value, { type, filename: `${masterNode.name}.${extension}` })
                  })
              }} />
            </HelpMarker>
            <HelpMarker text={HelpText.TOGGLE_SETTINGS}>
              <Button className={clsx(
                styles['btn-settings'],
                showSettings && styles['selected']
              )} icon={ICON.APP_SETTINGS} selected={showSettings} onClick={() => {
                setShowSettings(!showSettings)
              }} />
            </HelpMarker>
            <HelpMarker text={HelpText.TOGGLE_HELP}>
              <Button className={clsx(
                styles['btn-help'],
                config.help && styles['selected']
              )} icon={ICON.UI_HELP} selected={config.help} onClick={() => {
                saveConfig({ help: !config.help })
              }} />
            </HelpMarker>
          </>
        ) : (node && (
          <Button icon={ICON.CONTROL_CHECK} label="Create Animation" onClick={() => {
            trackEvent(MPEvent.CREATE_ANIMATION)
            controller.emit('export:enable', undefined)
            setScreen(1)
          }} />
        ))}
      </Tabs>
      <SettingsPanel open={showSettings} />
      {node && masterNode ? (
        <Component />
      ) : (
        <TutorialScreen />
      )}
      {node && masterNode && config.help && (
        <HelpBar />
      )}
    </div>
  )
}
