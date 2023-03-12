import { Button, ICON, NumberInput, Select } from '@figmania/ui'
import { FunctionComponent, useState } from 'react'
import { Animation, AnimationType } from '../types/Animation'
import { AnimationOption, ANIMATION_SELECT_OPTIONS } from '../utils/shared'
import styles from './AnimationRow.module.scss'
import { HoverInfo } from './HoverInfo'

export interface AnimationRowProps {
  index: number
  animation: Animation
  options: AnimationOption[]
  update: (animation: Animation, index: number) => void
  remove: (animation: Animation, index: number) => void
  hoverInfo: (enter: boolean, text?: string) => void
}

function convertStateToAnimation({ type, from, to }: Animation): Animation {
  const result: Animation = { type, from, to }
  if (type === 'opacity' || type === 'scale') {
    result.from /= 100
    result.to /= 100
  }
  return result
}

function convertAnimationToState({ type, from, to }: Animation): Animation {
  const result: Animation = { type, from, to }
  if (type === 'opacity' || type === 'scale') {
    result.from *= 100
    result.to *= 100
  }
  return result
}

export const AnimationRow: FunctionComponent<AnimationRowProps> = ({ animation, index, options, hoverInfo, update, remove }) => {
  const state = convertAnimationToState(animation)
  const [type, setType] = useState<AnimationType>(state.type)
  const [from, setFrom] = useState<number>(state.from)
  const [to, setTo] = useState<number>(state.to)
  const selectedOption = ANIMATION_SELECT_OPTIONS.find(({ value }) => value === type)!
  return (
    <div className={styles['animation']}>
      <HoverInfo text="Switch between different Animation Properties" emit={hoverInfo}>
        <Select placeholder="..." value={type} options={[selectedOption, ...options]} onChange={(value) => {
          const option = value as AnimationOption
          const newState = convertAnimationToState({ type: option.value, from: option.from, to: option.to })
          setType(newState.type)
          setFrom(newState.from)
          setTo(newState.to)
          update(convertStateToAnimation(newState), index)
        }} />
      </HoverInfo>
      <HoverInfo text="Set the From / Start value of this Animation" emit={hoverInfo}>
        <NumberInput
          value={from} defaultValue={selectedOption.from}
          min={selectedOption.min} max={selectedOption.max} precision={selectedOption.precision}
          name="transition-from" icon={ICON.TRANSITION_FROM} suffix={selectedOption.suffix} className={styles['field-input']} style={{ width: 100 }}
          onChange={(value) => {
            setFrom(value)
            update(convertStateToAnimation({ from: value, to, type }), index)
          }} />
      </HoverInfo>
      <HoverInfo text="Set the To / End value of this Animation" emit={hoverInfo}>
        <NumberInput
          value={to} defaultValue={selectedOption.to}
          min={selectedOption.min} max={selectedOption.max} precision={selectedOption.precision}
          name="transition-to" icon={ICON.TRANSITION_TO} suffix={selectedOption.suffix} className={styles['field-input']} style={{ width: 100 }}
          onChange={(value) => {
            setTo(value)
            update(convertStateToAnimation({ from, to: value, type }), index)
          }} />
      </HoverInfo>
      <HoverInfo text="Remove this Animation" emit={hoverInfo}>
        <Button icon={ICON.UI_MINUS} onClick={() => {
          remove(convertStateToAnimation({ from, to, type }), index)
        }} />
      </HoverInfo>
    </div>
  )
}
