import { prettyPrint, transformSvg, uiDownload } from '@figmania/common'
import { Button, ICON, Tab, Tabs, useClipboard, useConfig, useController, useNotify } from '@figmania/ui'
import clsx from 'clsx'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import styles from './App.module.scss'
import { Config, Schema } from './Schema'
import { HelpBar } from './components/HelpBar'
import { HelpMarker } from './components/HelpMarker'
import { SettingsPanel } from './components/SettingsPanel'
import { useCheckout } from './hooks/useCheckout'
import { useNode } from './hooks/useNode'
import { EditorScreen } from './screens/EditorScreen'
import { ExportScreen } from './screens/ExportScreen'
import { PreviewScreen } from './screens/PreviewScreen'
import { TutorialScreen } from './screens/TutorialScreen'
import { fetchApi } from './utils/api'
import { getFormattedCode } from './utils/code'
import { HelpText } from './utils/help'
import { nodeTreeHasTransitions } from './utils/math'
import { DOWNLOAD_OPTIONS_MAP } from './utils/shared'

const ScreenComponents: FunctionComponent[] = [PreviewScreen, EditorScreen, ExportScreen]

export const App: FunctionComponent = () => {
  const [screen, setScreen] = useState(0)
  const clipboard = useClipboard()
  const notify = useNotify()
  const controller = useController<Schema>()
  const { uuid, node, masterNode, width, height } = useNode()
  const [showSettings, setShowSettings] = useState(false)
  const [config, saveConfig] = useConfig<Config>()
  const [paid, checkout] = useCheckout()
  const [loading, setLoading] = useState(false)

  console.info('paid', paid)

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
              <Button className={clsx(
                styles['pro-button'],
                !paid && styles['locked']
              )} icon={ICON.LINK_WEB} loading={loading} onClick={() => {
                if (!width || !height) { return }
                setLoading(true)
                checkout().then(() => {
                  return controller.request('export', node).then((value) => transformSvg(value, node))
                }).then((contents) => {
                  const payload = { uuid, nodeId: node.id, userId: config.userId, name: node.name, contents }
                  return fetchApi<{ url: string }>('/api/upload', payload)
                }).then(({ url }) => {
                  window.open(url, '_blank')
                }).catch(() => {
                  notify('Unable to export to Video')
                }).then(() => {
                  setLoading(false)
                })
              }} />
            </HelpMarker>
            <HelpMarker text={HelpText.COPY_TO_CLIPBOARD}>
              <Button icon={ICON.UI_CLIPBOARD} onClick={() => {
                controller.request('export', node)
                  .then((value) => transformSvg(value, node))
                  .then((value) => getFormattedCode(value, masterNode.data.exportFormat, masterNode.data.trigger))
                  .then((value) => prettyPrint(value))
                  .then((value) => {
                    clipboard(value)
                    notify('Code copied to clipboard')
                  })
              }} />
            </HelpMarker>
            <HelpMarker text={HelpText.DOWNLOAD_TO_DISK}>
              <Button icon={ICON.UI_DOWNLOAD} onClick={() => {
                controller.request('export', node)
                  .then((value) => transformSvg(value, node))
                  .then((value) => getFormattedCode(value, masterNode.data.exportFormat, masterNode.data.trigger))
                  .then((value) => prettyPrint(value))
                  .then((value) => {
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
