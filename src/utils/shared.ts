import { NodeDataModel } from '@figmania/common'
import { Icons } from '@figmania/ui'

export type ExportMode = 'playback' | 'code'

export type ExportFormat = 'svg' | 'element' | 'html'

export interface NodeData {
  active: boolean
  delay: number
  duration: number
  ease: string
  trigger: string
  animations: Animation[]
  exportFormat: ExportFormat
}

export const DataModel: NodeDataModel<NodeData> = {
  key: 'data',
  defaults: { active: false, delay: 0, duration: 0.5, ease: 'power1.inOut', trigger: 'hover', animations: [], exportFormat: 'svg' }
}

export type AnimationType = 'x' | 'y' | 'scale' | 'rotation' | 'opacity'

export interface Animation {
  type: AnimationType
  from: number
  to: number
}

export interface AnimationOption {
  value: AnimationType
  title: string
  from: number
  to: number
  icon: Icons
  suffix?: string
}

export interface TriggerOption {
  value: string
  title: string
  icon: Icons
}

export interface EaseOption {
  value: string
  title: string
  icon: Icons
}

export interface ExportFormatOption {
  value: ExportFormat
  title: string
}

export const ANIMATION_SELECT_OPTIONS: AnimationOption[] = [
  { value: 'opacity', title: 'Opacity', from: 0, to: 1, suffix: '%', icon: 'animation-opacity' },
  { value: 'x', title: 'X', from: 0, to: 100, suffix: 'px', icon: 'animation-translate-x' },
  { value: 'y', title: 'Y', from: 0, to: 100, suffix: 'px', icon: 'animation-translate-y' },
  { value: 'scale', title: 'Scale', from: 0.5, to: 1.0, suffix: '%', icon: 'animation-scale' },
  { value: 'rotation', title: 'Rotation', from: 0, to: 360, suffix: '°', icon: 'animation-rotate' }
]

export const TRIGGER_SELECT_OPTIONS: TriggerOption[] = [
  { value: 'hover', title: 'Hover', icon: 'transition-trigger' },
  { value: 'on', title: 'Load', icon: 'transition-trigger' },
  { value: 'off', title: 'Never', icon: 'transition-trigger' },
  { value: 'visible', title: 'Visible', icon: 'transition-trigger' }
]

export const TRIGGER_LABELS: { [key: string]: string } = {
  hover: 'On Hover',
  on: 'On Load',
  off: 'Never',
  visible: 'When Visible'
}

export const EASE_SELECT_OPTIONS: EaseOption[] = [
  { value: 'none', title: 'Linear', icon: 'ease-linear' },
  { value: 'power1.in', title: 'Ease In', icon: 'ease-in' },
  { value: 'power1.inOut', title: 'Ease In Out', icon: 'ease-in-out' },
  { value: 'power1.out', title: 'Ease Out', icon: 'ease-out' }
]

export const EXPORT_FORMAT_SELECT_OPTIONS: ExportFormatOption[] = [
  { value: 'svg', title: 'SVG' },
  { value: 'element', title: 'Element' },
  { value: 'html', title: 'HTML' }
]

export const EXPORT_FORMAT_LABELS: { [key: string]: string } = {
  svg: 'SVG',
  element: 'Element',
  html: 'HTML'
}

export type FormatDownloadMap = {
  [key in ExportFormat]: { type: string, extension: string }
}

export const DOWNLOAD_OPTIONS_MAP: FormatDownloadMap = {
  svg: { type: 'image/svg+xml', extension: 'svg' },
  element: { type: 'text/html', extension: 'html' },
  html: { type: 'text/html', extension: 'html' }
}
