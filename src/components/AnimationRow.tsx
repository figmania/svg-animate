import { Button, Input, Select, SelectOption } from '@figmania/ui'
import { Component } from 'react'
import { Animation, AnimationOption, AnimationType, ANIMATION_SELECT_OPTIONS } from '../utils/shared'
import { HoverInfo } from './HoverInfo'

export interface AnimationRowProps {
  index: number
  animation: Animation
  options: AnimationOption[]
  update: (animation: Animation, index: number) => void
  remove: (animation: Animation, index: number) => void
  hoverInfo: (enter: boolean, text?: string) => void
}

export interface AnimationRowState {
  type: AnimationType
  from: number
  to: number
}

function convertStateToAnimation({ type, from, to }: AnimationRowState): Animation {
  const result: Animation = { type, from, to }
  if (type === 'opacity' || type === 'scale') {
    result.from /= 100
    result.to /= 100
  }
  return result
}

function convertAnimationToState({ type, from, to }: Animation): AnimationRowState {
  const result: AnimationRowState = { type, from, to }
  if (type === 'opacity' || type === 'scale') {
    result.from *= 100
    result.to *= 100
  }
  return result
}

export class AnimationRow extends Component<AnimationRowProps, AnimationRowState> {
  constructor(props: AnimationRowProps) {
    super(props)
    this.state = convertAnimationToState(this.props.animation)
    this.onAnimationTypeChange = this.onAnimationTypeChange.bind(this)
    this.onAnimationFromChange = this.onAnimationFromChange.bind(this)
    this.onAnimationToChange = this.onAnimationToChange.bind(this)
    this.onAnimationRemoveClick = this.onAnimationRemoveClick.bind(this)
  }

  async onAnimationTypeChange(option: SelectOption) {
    const { value: type, from, to } = option as AnimationOption
    const state = convertAnimationToState({ type, from, to })
    this.setState(state)
    this.props.update(convertStateToAnimation({ ...this.state, ...state }), this.props.index)
  }

  async onAnimationFromChange(from: string | number) {
    this.setState({ from: +from })
    this.props.update(convertStateToAnimation({ ...this.state, from: +from }), this.props.index)
  }

  async onAnimationToChange(to: string | number) {
    this.setState({ to: +to })
    this.props.update(convertStateToAnimation({ ...this.state, to: +to }), this.props.index)
  }

  async onAnimationRemoveClick() {
    this.props.remove(convertStateToAnimation(this.state), this.props.index)
  }

  render() {
    const { options } = this.props
    const { from, to, type } = this.state
    const selectedOption = ANIMATION_SELECT_OPTIONS.find(({ value }) => value === type)!
    return (
      <div className="animation">
        <HoverInfo text="Switch between different Animation Properties" emit={this.props.hoverInfo}>
          <Select placeholder="..." className="animation-select" value={type} options={[selectedOption, ...options]} onChange={(value) => { this.onAnimationTypeChange(value) }}></Select>
        </HoverInfo>
        <HoverInfo text="Set the From / Start value of this Animation" emit={this.props.hoverInfo}>
          <Input name="transition-from" icon="transition-from" suffix={selectedOption.suffix} className="field-input" placeholder="..." type="number" value={from} onChange={(value) => { this.onAnimationFromChange(value) }} style={{ width: 100 }} />
        </HoverInfo>
        <HoverInfo text="Set the To / End value of this Animation" emit={this.props.hoverInfo}>
          <Input name="transition-to" icon="transition-to" suffix={selectedOption.suffix} className="field-input" placeholder="..." type="number" value={to} onChange={(value) => { this.onAnimationToChange(value) }} style={{ width: 100 }} />
        </HoverInfo>
        <HoverInfo text="Remove this Animation" emit={this.props.hoverInfo}>
          <Button icon="ui-minus" onClick={() => { this.onAnimationRemoveClick() }}></Button>
        </HoverInfo>
      </div>
    )
  }
}
