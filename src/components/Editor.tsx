import { TreeNode } from '@figmania/common'
import { Button, Icon, Input, Navbar } from '@figmania/ui'
import { Component } from 'react'
import { Animation, ANIMATION_SELECT_OPTIONS, NodeData } from '../utils/shared'
import { AnimationRow } from './AnimationRow'
import { HoverInfo } from './HoverInfo'

export interface EditorProps {
  node: TreeNode<NodeData>
  exportData: NodeData
  update: (data: Partial<NodeData>) => Promise<void>
}

export interface EditorState {
  info: string
}

export class Editor extends Component<EditorProps, EditorState> {
  state: EditorState = { info: 'Hover over an element for additional information' }

  constructor(props: EditorProps) {
    super(props)
    this.onDelayChange = this.onDelayChange.bind(this)
    this.onDurationChange = this.onDurationChange.bind(this)
    this.onAnimationAddClick = this.onAnimationAddClick.bind(this)
    this.onAnimationUpdate = this.onAnimationUpdate.bind(this)
    this.onAnimationRemove = this.onAnimationRemove.bind(this)
    this.onHoverInfo = this.onHoverInfo.bind(this)
  }

  async onDelayChange(value: string | number) {
    if (value === '') { return this.props.update({ delay: this.props.exportData.delay ?? 0.5 }) }
    const delay = (+value) / 1000
    if (this.data.delay === delay) { return }
    await this.props.update({ delay })
  }

  async onDurationChange(value: string | number) {
    if (value === '') { return this.props.update({ duration: this.props.exportData.duration ?? 0.5 }) }
    const duration = (+value) / 1000
    if (this.data.duration === duration) { return }
    await this.props.update({ duration })
  }

  onAnimationUpdate(animation: Animation, index: number) {
    this.data.animations[index] = animation
    this.props.update({ animations: this.data.animations })
  }

  onAnimationRemove(_: Animation, index: number) {
    if (index < 0 || index >= this.data.animations.length) { return }

    // Build Data
    const data: Partial<NodeData> = { animations: [...this.data.animations] }
    data.animations!.splice(index, 1)

    // Set Inactive if last animation was removed
    if (data.animations!.length === 0) { data.active = false }

    // Enable Node
    this.props.update(data)
  }

  onHoverInfo(enter: boolean, text?: string) {
    this.setState({
      info: (enter && text) ? text : 'Hover over an element for additional information'
    })
  }

  async onAnimationAddClick() {
    const data: Partial<NodeData> = { animations: [...this.data.animations] }
    const assignedTypes = this.data.animations.map(({ type }) => type)
    const nextOption = ANIMATION_SELECT_OPTIONS.find(({ value }) => assignedTypes.indexOf(value) === -1)
    if (!nextOption) { return }
    data.animations!.push({ type: nextOption.value, from: nextOption.from, to: nextOption.to })
    if (data.animations!.length === 1) { data.active = true }
    await this.props.update(data)
  }

  render() {
    const assignedTypes = this.data.animations.map(({ type }) => type)
    const options = ANIMATION_SELECT_OPTIONS.filter(({ value }) => assignedTypes.indexOf(value) === -1)
    return <>
      <Navbar icon={this.data.active ? 'ui-animate-on' : 'ui-animate-off'} title={this.name} isDisabled={!this.data.active}>
        <HoverInfo text="Set the Delay before this Animation starts" emit={this.onHoverInfo}>
          <Input name="transition-delay" isDisabled={!this.data.active} icon="transition-delay" suffix="ms" className={`field-input ${this.data.delay ? 'set' : 'unset'}`} placeholder="0" type="number" value={this.data.delay * 1000} onChange={(value) => { this.onDelayChange(value) }} style={{ width: 100 }} />
        </HoverInfo>
        <HoverInfo text="Set the Duration of this Animation" emit={this.onHoverInfo}>
          <Input name="transition-duration" isDisabled={!this.data.active} icon="transition-duration" suffix="ms" className={`field-input ${this.data.duration ? 'set' : 'unset'}`} placeholder={String(this.defaultDuration)} type="number" value={this.data.duration * 1000} onChange={(value) => { this.onDurationChange(value) }} style={{ width: 100 }} />
        </HoverInfo>
        <HoverInfo text="Add a new Animation" emit={this.onHoverInfo}>
          <Button icon="ui-plus" onClick={() => { this.onAnimationAddClick() }} isDisabled={assignedTypes.length === ANIMATION_SELECT_OPTIONS.length}></Button>
        </HoverInfo>
      </Navbar>
      <div className="flex-1 animations-wrapper">
        <div className="animations">
          {this.data.animations.map((animation, index) => (<AnimationRow hoverInfo={this.onHoverInfo} key={`${this.id}:${animation.type}`} index={index} animation={animation} options={options} update={this.onAnimationUpdate} remove={this.onAnimationRemove}></AnimationRow>))}
        </div>
        {(this.data.animations.length === 0) && (
          <div className="notice">Click the <Icon icon="ui-plus"></Icon> icon to animate a property of the selected node.</div>
        )}
      </div>
      <Navbar icon="ui-info" title={this.state.info}></Navbar>
    </>
  }

  get id() { return this.props.node.id }
  get name() { return this.props.node.name }
  get data() { return this.props.node.data }
  get exportData() { return this.props.exportData }
  get children() { return this.props.node.children }
  get defaultDuration() { return this.props.exportData?.duration ?? 0.5 }
}
