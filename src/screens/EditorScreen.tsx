import { TreeNode } from '@figmania/common'
import { Button, ICON, Icon, Navbar, NumberInput } from '@figmania/ui'
import clsx from 'clsx'
import { FunctionComponent, useState } from 'react'
import { AnimationRow } from '../components/AnimationRow'
import { HoverInfo } from '../components/HoverInfo'
import { NodeData } from '../types/NodeData'
import { ANIMATION_SELECT_OPTIONS } from '../utils/shared'
import styles from './EditorScreen.module.scss'

export interface EditorScreenProps {
  node: TreeNode<NodeData>
  masterData: NodeData
  update: (data: Partial<NodeData>) => Promise<void>
}

export const EditorScreen: FunctionComponent<EditorScreenProps> = ({ node, masterData, update }) => {
  const [info, setInfo] = useState('Hover over an element for additional information')
  const assignedTypes = node.data.animations.map(({ type }) => type)
  const options = ANIMATION_SELECT_OPTIONS.filter(({ value }) => assignedTypes.indexOf(value) === -1)

  const onHoverInfo = (enter: boolean, text?: string) => {
    setInfo((enter && text) ? text : 'Hover over an element for additional information')
  }

  return (
    <>
      <Navbar icon={node.data.active ? ICON.UI_ANIMATE_ON : ICON.UI_ANIMATE_OFF} title={node.name} disabled={!node.data.active}>
        <HoverInfo text="Set the Delay before this Animation starts" emit={onHoverInfo}>
          <NumberInput
            value={node.data.delay} defaultValue={0} min={0} step={0.1} max={100} precision={3} style={{ width: 100 }}
            name="transition-delay" disabled={!node.data.active} icon={ICON.TRANSITION_DELAY} suffix="ms" className={clsx(styles['field-input'], node.data.delay ? styles['set'] : styles['unset'])}
            onChange={(delay) => {
              if (node.data.delay === delay) { return }
              update({ delay })
            }} />
        </HoverInfo>
        <HoverInfo text="Set the Duration of this Animation" emit={onHoverInfo}>
          <NumberInput
            value={node.data.duration ?? masterData.duration} defaultValue={masterData.duration ?? 0.5} fadeDefault min={0} max={100} precision={3} style={{ width: 100 }}
            name="transition-duration" disabled={!node.data.active} icon={ICON.TRANSITION_DURATION} suffix="ms" className={clsx(styles['field-input'], node.data.duration ? styles['set'] : styles['unset'])}
            onChange={(duration, event) => {
              if (node.data.duration === duration) { return }
              if (event.target.value === '') {
                update({ duration: undefined })
              } else {
                update({ duration })
              }
            }} />
        </HoverInfo>
        <HoverInfo text="Add a new Animation" emit={onHoverInfo}>
          <Button icon={ICON.UI_PLUS} onClick={() => {
            const data: Partial<NodeData> = { animations: [...node.data.animations] }
            const newAssignedTypes = node.data.animations.map(({ type }) => type)
            const nextOption = ANIMATION_SELECT_OPTIONS.find(({ value }) => newAssignedTypes.indexOf(value) === -1)
            if (!nextOption) { return }
            data.animations!.push({ type: nextOption.value, from: nextOption.from, to: nextOption.to })
            if (data.animations!.length === 1) { data.active = true }
            update(data)
          }} disabled={assignedTypes.length === ANIMATION_SELECT_OPTIONS.length}></Button>
        </HoverInfo>
      </Navbar>
      <div className={clsx(styles['flex-1'], styles['animations-wrapper'])}>
        <div className={styles['animations']}>
          {node.data.animations.map((animation, index) => (
            <AnimationRow hoverInfo={onHoverInfo} key={`${node.id}:${animation.type}`} index={index} animation={animation} options={options} update={(newAnimation, newIndex) => {
              node.data.animations[newIndex] = newAnimation
              update({ animations: node.data.animations })
            }} remove={(_, newIndex) => {
              if (newIndex < 0 || newIndex >= node.data.animations.length) { return }
              const data: Partial<NodeData> = { animations: [...node.data.animations] }
              data.animations!.splice(newIndex, 1)
              if (data.animations!.length === 0) { data.active = true }
              update(data)
            }}></AnimationRow>
          ))}
        </div>
        {(node.data.animations.length === 0) && (
          <div className={styles['notice']}>Click the <Icon icon={ICON.UI_PLUS}></Icon> icon to animate a property of the selected node.</div>
        )}
      </div>
      <Navbar icon={ICON.UI_INFO} title={info} />
    </>
  )
}
