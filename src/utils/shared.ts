import { ICON } from '@figmania/ui'
import { AnimationType } from '../types/Animation'
import { ExportFormat } from '../types/Export'

export interface AnimationOption {
  value: AnimationType
  title: string
  from: number
  to: number
  precision: number
  min: number
  max: number
  step: number
  icon: ICON
  suffix?: string
}

export interface TriggerOption {
  value: string
  title: string
  icon: ICON
}

export interface EaseOption {
  value: string
  title: string
  icon: ICON
}

export interface ExportFormatOption {
  value: ExportFormat
  title: string
}

export const ANIMATION_SELECT_OPTIONS: AnimationOption[] = [
  { value: 'opacity', title: 'Opacity', from: 0, to: 1, min: 0, max: 1, step: 0.1, precision: 2, suffix: '%', icon: ICON.ANIMATION_OPACITY },
  { value: 'x', title: 'X', from: 0, to: 100, min: -1000, max: 1000, step: 10, precision: 0, suffix: 'px', icon: ICON.ANIMATION_TRANSLATE_X },
  { value: 'y', title: 'Y', from: 0, to: 100, min: -1000, max: 1000, step: 10, precision: 0, suffix: 'px', icon: ICON.ANIMATION_TRANSLATE_Y },
  { value: 'scale', title: 'Scale', from: 0.5, to: 1.0, min: 0, max: 1, step: 0.1, precision: 2, suffix: '%', icon: ICON.ANIMATION_SCALE },
  { value: 'rotation', title: 'Rotation', from: 0, to: 360, min: 0, max: 1, step: 10, precision: 0, suffix: '°', icon: ICON.ANIMATION_ROTATE }
]

export const TRIGGER_SELECT_OPTIONS: TriggerOption[] = [
  { value: 'hover', title: 'Hover', icon: ICON.TRANSITION_TRIGGER },
  { value: 'loop', title: 'Loop', icon: ICON.TRANSITION_TRIGGER },
  { value: 'on', title: 'Load', icon: ICON.TRANSITION_TRIGGER },
  { value: 'off', title: 'Never', icon: ICON.TRANSITION_TRIGGER },
  { value: 'visible', title: 'Visible', icon: ICON.TRANSITION_TRIGGER }
]

export const TRIGGER_LABELS: { [key: string]: string } = {
  hover: 'On Hover',
  loop: 'Loop',
  on: 'On Load',
  off: 'Never',
  visible: 'When Visible'
}

export const EASE_SELECT_OPTIONS: EaseOption[] = [
  { value: 'none', title: 'Linear', icon: ICON.EASE_LINEAR },
  { value: 'power1.in', title: 'Ease In', icon: ICON.EASE_IN },
  { value: 'power1.inOut', title: 'Ease In Out', icon: ICON.EASE_IN_OUT },
  { value: 'power1.out', title: 'Ease Out', icon: ICON.EASE_OUT }
]

export const EXPORT_FORMAT_SELECT_OPTIONS: ExportFormatOption[] = [
  { value: 'html', title: 'HTML' },
  { value: 'element', title: 'Element' },
  { value: 'svg', title: 'SVG' }
]

export const EXPORT_FORMAT_LABELS: { [key: string]: string } = {
  html: 'HTML',
  element: 'Element',
  svg: 'SVG'
}

export type FormatDownloadMap = {
  [key in ExportFormat]: { type: string, extension: string }
}

export const DOWNLOAD_OPTIONS_MAP: FormatDownloadMap = {
  svg: { type: 'image/svg+xml', extension: 'svg' },
  element: { type: 'text/html', extension: 'html' },
  html: { type: 'text/html', extension: 'html' }
}
