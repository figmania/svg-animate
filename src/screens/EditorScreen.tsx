import { Editor, ICON } from '@figmania/ui'
import { FunctionComponent, useEffect, useState } from 'react'
import tutorial3 from '../assets/tutorials/tutorial-03.svg?raw'
import { HelpMarker } from '../components/HelpMarker'
import { SvgAnimate } from '../components/SvgAnimate'
import { useNode } from '../hooks/useNode'
import { HelpText } from '../utils/help'
import { shared } from '../utils/styles'
import styles from './EditorScreen.module.scss'

export const EditorScreen: FunctionComponent = () => {
  const { node, masterNode, update } = useNode()
  const duration = masterNode?.data.duration ?? 1000
  const [timelines, setTimelines] = useState(node?.data.timelines ?? [])

  useEffect(() => {
    if (!node) { return }
    setTimelines(node.data.timelines)
  }, [node?.data.timelines])

  if (node && masterNode && node.id === masterNode.id && timelines != null) {
    return (
      <div className={shared('screen', 'flex-column', 'align-center', 'justify-center')}>
        <SvgAnimate className={styles['svg']} svg={tutorial3} loop />
      </div>
    )
  }

  return (
    <div className={shared('screen')}>
      {node && masterNode && timelines && (
        <HelpMarker text={HelpText.EDITOR}>
          <Editor
            className={styles['editor']}
            timelines={timelines} bar={{ duration, tick: 0.1 }}
            allowMultiple
            config={{
              opacity: { icon: ICON.ANIMATE_OPACITY, label: 'Opacity', from: 0, to: 1, min: 0, max: 1, step: 0.1, precision: 2, suffix: '%' },
              x: { icon: ICON.ANIMATE_X, label: 'Move X', from: 0, to: 100, min: -1000, max: 1000, step: 10, precision: 0, suffix: 'px' },
              y: { icon: ICON.ANIMATE_Y, label: 'Move Y', from: 0, to: 100, min: -1000, max: 1000, step: 10, precision: 0, suffix: 'px' },
              scale: { icon: ICON.ANIMATE_SCALE, label: 'Scale', from: 0.5, to: 1.0, min: 0, max: 2, step: 0.1, precision: 2, suffix: '%' },
              rotation: { icon: ICON.ANIMATE_ROTATION, label: 'Rotation', from: 0, to: 360, min: -720, max: 720, step: 10, precision: 0, suffix: '°' }
            }} onChange={(newTimelines) => {
              if (!node) { return }
              setTimelines(newTimelines)
              update(node, { timelines: newTimelines })
            }} />
        </HelpMarker>
      )}
    </div>
  )
}
