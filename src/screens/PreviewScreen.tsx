import { AnimEase, TreeNode } from '@figmania/common'
import { ICON, Navbar, NumberInput, Select } from '@figmania/ui'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { Playback } from '../components/Playback'
import { useDebounce } from '../hooks/useDebounce'
import { NodeData } from '../types/NodeModel'
import { getNodeTreeMaxDuration } from '../utils/math'
import { EASE_SELECT_OPTIONS } from '../utils/shared'
import styles from './PreviewScreen.module.scss'

export interface PreviewScreenProps {
  node: TreeNode<NodeData>
  code?: string
  update: (data: Partial<NodeData>, shouldExport: boolean) => Promise<void>
}

export const PreviewScreen: FunctionComponent<PreviewScreenProps> = ({ node, code, update }) => {
  const { defaultEase, trigger } = node.data
  const [duration, setDuration] = useState<number>(node.data.duration)
  const minDuration = useMemo(() => getNodeTreeMaxDuration(node), [node.data])

  useEffect(() => { setDuration(node.data.duration) }, [node.data.duration])

  const debouncedUpdateDuration = useDebounce((value: number) => { update({ duration: value }, true) }, 500)

  return (
    <>
      <Navbar icon={ICON.CONTROL_PLAY} label='Preview'>
        <NumberInput
          className={styles['navbar-input']}
          value={duration} defaultValue={node.data.duration} precision={3}
          min={minDuration} max={10} step={0.1}
          name="transition-duration" icon={ICON.TRANSITION_DURATION} suffix="ms"
          onChange={(value) => {
            setDuration(value)
            debouncedUpdateDuration(value)
          }} />
        <Select
          className={styles['navbar-input']}
          placeholder="Default Easing" value={defaultEase} options={EASE_SELECT_OPTIONS} onChange={(option) => {
            const newEase = option.value as AnimEase
            if (defaultEase === newEase) { return }
            update({ defaultEase: newEase }, true)
          }} />
      </Navbar>
      <div className={styles['container']}>
        {code && <Playback code={code} loop={trigger === 'loop'} />}
      </div>
    </>
  )
}
