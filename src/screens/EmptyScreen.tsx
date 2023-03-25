import { TreeNode } from '@figmania/common'
import { Button, ICON, Navbar, useConfig, useController } from '@figmania/ui'
import { FunctionComponent } from 'react'
import { Config, Schema } from '../Schema'
import { NodeData } from '../types/NodeData'
import styles from './EmptyScreen.module.scss'

const FIGMANIA_HOST = 'www.figmania.dev'

export interface EmptyScreenProps {
  node?: TreeNode<NodeData>
}

export const EmptyScreen: FunctionComponent<EmptyScreenProps> = ({ node }) => {
  const [config, saveConfig] = useConfig<Config>()
  const controller = useController<Schema>()
  const title = node ? node.name : 'No node selected'

  return (
    <>
      <Navbar icon={ICON.SYMBOL_COMPONENT} title={title} disabled={!node}>
        {node && (
          <Button icon={ICON.CONTROL_CHECK} title="Enable SVG Export" onClick={() => {
            controller.emit('export:enable', undefined)
          }} />
        )}
        <Button title="Login" onClick={() => {
          saveConfig({ user: undefined })
          fetch(`https://${FIGMANIA_HOST}/api/authSessions/create/${config.userId}`, { method: 'POST' }).then((response) => response.json()).then(({ readKey, writeKey }) => {
            const interval = setInterval(() => {
              fetch(`https://${FIGMANIA_HOST}/api/authSessions/poll/${readKey}`, { method: 'GET' })
                .then((response) => response.json())
                .then(({ complete, user }) => {
                  if (!complete || !user) { return }
                  saveConfig({ user })
                  clearInterval(interval)
                })
            }, 5000)
            console.info(`https://www.figmania.dev/authSession/${writeKey}`)
            // window.open(`https://www.figmania.dev/authSession/${writeKey}`, 'authWindow', 'popup=1,width=320,height=480')
          })
        }} />
        <Button className={styles['tutorial-button']} title={config.tutorial ? 'Hide Tutorial' : 'Show Tutorial'} selected={config.tutorial} onClick={() => {
          saveConfig({ tutorial: !config.tutorial })
        }} />
      </Navbar>
      {config.user && (
        <div>
          <p>Name: {config.user.name}</p>
          <p>Email: {config.user.email}</p>
          <p>Access Token: {config.user.accessToken}</p>
          <p>Refresh Token: {config.user.refreshToken}</p>
        </div>
      )}
      {config.tutorial && (
        <div className={styles['tutorial']}>
          <div className={styles['tutorial-section']}>How to create Animations</div>
          <div className={styles['tutorial-step']}><strong>Step 1:</strong> Select the Frame you want to animate and click on <strong>Enable SVG Export</strong>.</div>
          <div className={styles['tutorial-step']}><strong>Step 2:</strong> Select a node within that Frame to set up animations such as X Position, Y Position, Scale, Rotation and Opacity.</div>
          <div className={styles['tutorial-step']}><strong>Step 3:</strong> Use the built-in live-preview to tweak your animations until you're happy with the result.</div>
          <div className={styles['tutorial-step']}><strong>Step 4:</strong> Download or copy the animated SVG and paste it on your website.</div>
          <div className={styles['tutorial-section']}>How to use Animations</div>
          <div className={styles['tutorial-step']}><strong>•</strong> SVG Animate uses a small web component library under the hood to make your animations work.</div>
          <div className={styles['tutorial-step']}><strong>•</strong> This library uses GreenSock GSAP, a powerful, lightweight and performant animation engine.</div>
          <div className={styles['tutorial-step']}><strong>•</strong> When exporting from SVG Animate, you can download or copy the snippet with the click of a button, and paste it on your website. No complicated setup needed.</div>
        </div>
      )}
    </>
  )
}
