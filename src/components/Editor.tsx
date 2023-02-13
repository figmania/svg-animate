import { TreeNode } from '@figmania/common'
import { Button, Icon, Input, Navbar } from '@figmania/ui'
import { FunctionComponent, useState } from 'react'
import { ANIMATION_SELECT_OPTIONS, NodeData } from '../utils/shared'
import { AnimationRow } from './AnimationRow'
import { HoverInfo } from './HoverInfo'

export interface EditorProps {
  node: TreeNode<NodeData>
  exportData: NodeData
  update: (data: Partial<NodeData>) => Promise<void>
}

export const Editor: FunctionComponent<EditorProps> = ({ node, exportData, update }) => {
  const [info, setInfo] = useState('Hover over an element for additional information')

  const onHoverInfo = (enter: boolean, text?: string) => {
    setInfo((enter && text) ? text : 'Hover over an element for additional information')
  }

  const defaultDuration = exportData?.duration ?? 0.5
  const assignedTypes = node.data.animations.map(({ type }) => type)
  const options = ANIMATION_SELECT_OPTIONS.filter(({ value }) => assignedTypes.indexOf(value) === -1)

  return (
    <>
      <Navbar icon={node.data.active ? 'ui-animate-on' : 'ui-animate-off'} title={node.name} isDisabled={!node.data.active}>
        <HoverInfo text="Set the Delay before this Animation starts" emit={onHoverInfo}>
          <Input name="transition-delay" isDisabled={!node.data.active} icon="transition-delay" suffix="ms" className={`field-input ${node.data.delay ? 'set' : 'unset'}`} placeholder="0" type="number" value={node.data.delay * 1000} onChange={(value) => {
            if (value === '') { update({ delay: exportData.delay ?? 0.5 }); return }
            const delay = (+value) / 1000
            if (node.data.delay === delay) { return }
            update({ delay })
          }} style={{ width: 100 }} />
        </HoverInfo>
        <HoverInfo text="Set the Duration of this Animation" emit={onHoverInfo}>
          <Input name="transition-duration" isDisabled={!node.data.active} icon="transition-duration" suffix="ms" className={`field-input ${node.data.duration ? 'set' : 'unset'}`} placeholder={String(defaultDuration)} type="number" value={node.data.duration * 1000} onChange={(value) => {
            if (value === '') { update({ duration: exportData.duration ?? 0.5 }); return }
            const duration = (+value) / 1000
            if (node.data.duration === duration) { return }
            update({ duration })
          }} style={{ width: 100 }} />
        </HoverInfo>
        <HoverInfo text="Add a new Animation" emit={onHoverInfo}>
          <Button icon="ui-plus" onClick={() => {
            const data: Partial<NodeData> = { animations: [...node.data.animations] }
            const newAssignedTypes = node.data.animations.map(({ type }) => type)
            const nextOption = ANIMATION_SELECT_OPTIONS.find(({ value }) => newAssignedTypes.indexOf(value) === -1)
            if (!nextOption) { return }
            data.animations!.push({ type: nextOption.value, from: nextOption.from, to: nextOption.to })
            if (data.animations!.length === 1) { data.active = true }
            update(data)
          }} isDisabled={assignedTypes.length === ANIMATION_SELECT_OPTIONS.length}></Button>
        </HoverInfo>
      </Navbar>
      <div className="flex-1 animations-wrapper">
        <div className="animations">
          {node.data.animations.map((animation, index) => (
            <AnimationRow hoverInfo={onHoverInfo} key={`${node.id}:${animation.type}`} index={index} animation={animation} options={options} update={(newAnimation, newIndex) => {
              node.data.animations[newIndex] = newAnimation
              update({ animations: node.data.animations })
            }} remove={(_, newIndex) => {
              if (newIndex < 0 || newIndex >= node.data.animations.length) { return }
              const data: Partial<NodeData> = { animations: [...node.data.animations] }
              data.animations!.splice(newIndex, 1)
              if (data.animations!.length === 0) { data.active = false }
              update(data)
            }}></AnimationRow>
          ))}
        </div>
        {(node.data.animations.length === 0) && (
          <div className="notice">Click the <Icon icon="ui-plus"></Icon> icon to animate a property of the selected node.</div>
        )}
      </div>
      <Navbar icon="ui-info" title={info}></Navbar>
    </>
  )
}
