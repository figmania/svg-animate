import { TreeNode } from '@figmania/common'
import { Editor, ICON, Navbar } from '@figmania/ui'
import clsx from 'clsx'
import { FunctionComponent, useEffect, useState } from 'react'
import { NodeData } from '../types/NodeModel'
import styles from './EditorScreen.module.scss'

export interface EditorScreenProps {
  node: TreeNode<NodeData>
  duration: number
  update: (data: Partial<NodeData>) => Promise<void>
}

export const EditorScreen: FunctionComponent<EditorScreenProps> = ({ node, duration, update }) => {
  const [timelines, setTimelines] = useState(node.data.timelines ?? [])

  useEffect(() => { setTimelines(node.data.timelines) }, [node.data.timelines])

  return (
    <>
      <Navbar icon={ICON.SYMBOL_COMPONENT} label={node.name} />
      <div className={clsx(styles['flex-1'], styles['editor-wrapper'])}>
        <Editor
          className={clsx(styles['flex-1'], styles['editor'])}
          timelines={timelines} bar={{ duration, tick: 0.1 }}
          config={{
            opacity: { icon: ICON.ANIMATE_OPACITY, label: 'Opacity', from: 0, to: 1, min: 0, max: 1, step: 0.1, precision: 2, suffix: '%' },
            x: { icon: ICON.ANIMATE_X, label: 'Move X', from: 0, to: 100, min: -1000, max: 1000, step: 10, precision: 0, suffix: 'px' },
            y: { icon: ICON.ANIMATE_Y, label: 'Move Y', from: 0, to: 100, min: -1000, max: 1000, step: 10, precision: 0, suffix: 'px' },
            scale: { icon: ICON.ANIMATE_SCALE, label: 'Scale', from: 0.5, to: 1.0, min: 0, max: 2, step: 0.1, precision: 2, suffix: '%' },
            rotation: { icon: ICON.ANIMATE_ROTATION, label: 'Rotation', from: 0, to: 360, min: -720, max: 720, step: 10, precision: 0, suffix: '°' }
          }} onChange={(newTimelines) => {
            setTimelines(newTimelines)
            update({ timelines: newTimelines })
          }} />
      </div>
    </>
  )
}
