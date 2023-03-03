import { TreeNode } from '@figmania/common'
import { Button, Icons, Navbar } from '@figmania/ui'
import { FunctionComponent } from 'react'
import { useConfig, useMessenger } from '../providers/MessengerProvider'
import { NodeData } from '../utils/shared'
import styles from './EmptyScreen.module.scss'

export interface EmptyScreenProps {
  node?: TreeNode<NodeData>
}

export const EmptyScreen: FunctionComponent<EmptyScreenProps> = ({ node }) => {
  const [config, saveConfig] = useConfig()
  const messenger = useMessenger()
  const title = node ? node.name : 'No node selected'
  const icon: Icons = node ? 'ui-animate-on' : 'ui-animate-off'
  return (
    <>
      <Navbar icon={icon} title={title} isDisabled={true}>
        {node && <Button icon={'ui-animate-on'} onClick={() => { messenger.request('enableExport', undefined) }} title="Enable SVG Export"></Button>}
        <Button className={styles['tutorial-button']} title={config.tutorial ? 'Hide Tutorial' : 'Show Tutorial'} isSelected={config.tutorial} onClick={() => { saveConfig({ tutorial: !config.tutorial }) }} />
      </Navbar>
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
