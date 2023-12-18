import { prettyPrint, transformSvg, uiDownload } from '@figmania/common'
import { Button, ICON, Icon, Tab, Tabs, useClipboard, useConfig, useController, useNotify } from '@figmania/ui'
import clsx from 'clsx'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import styles from './App.module.scss'
import { Config } from './Schema'
import { SettingsPanel } from './components/SettingsPanel'
import { useNode } from './hooks/useNode'
import { EditorScreen } from './screens/EditorScreen'
import { ExportScreen } from './screens/ExportScreen'
import { PreviewScreen } from './screens/PreviewScreen'
import { TutorialScreen } from './screens/TutorialScreen'
import { getFormattedCode } from './utils/code'
import { nodeTreeHasTransitions } from './utils/math'
import { DOWNLOAD_OPTIONS_MAP } from './utils/shared'

export const ScreenComponents: FunctionComponent[] = [PreviewScreen, EditorScreen, ExportScreen]

export const App: FunctionComponent = () => {
  const [screen, setScreen] = useState(0)
  const clipboard = useClipboard()
  const notify = useNotify()
  const controller = useController()
  const { node, masterNode } = useNode()
  const [showSettings, setShowSettings] = useState(false)
  const [config, saveConfig] = useConfig<Config>()

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
      {/* <BetaBanner cta='Learn More' onClick={() => { window.open('https://www.figmania.app/') }}>Timeline Editor has arrived</BetaBanner> */}
      <Tabs className={styles['tabs']} selectedIndex={screen} items={[
        <Tab label='Preview' />,
        <Tab label='Editor' />,
        <Tab label='Export' />
      ]} onChange={setScreen}>
        {node && masterNode ? (
          <>
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
            <Button className={clsx(
              styles['btn-settings'],
              showSettings && styles['selected']
            )} icon={ICON.APP_SETTINGS} selected={showSettings} onClick={() => {
              setShowSettings(!showSettings)
            }} />
            <Button className={clsx(
              styles['btn-help'],
              config.help && styles['selected']
            )} icon={ICON.UI_HELP} selected={config.help} onClick={() => {
              saveConfig({ help: !config.help })
            }} />
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
        <div className={styles['help']}>
          <Icon icon={ICON.UI_HELP} />
          <div>TODO</div>
        </div>
      )}
    </div>
  )
}
