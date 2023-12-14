import { AnimEase, AnimProperty } from '@figmania/common'
import { ICON } from '@figmania/ui'
import { ExportFormat } from '../types/Export'

export interface AnimationOption {
  value: AnimProperty
  label: string
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
  label: string
  icon: ICON
}

export interface EaseOption {
  value: AnimEase
  label: string
  icon: ICON
}

export interface ExportFormatOption {
  value: ExportFormat
  label: string
}

export const ANIMATION_SELECT_OPTIONS: AnimationOption[] = [
  { value: 'opacity', label: 'Opacity', from: 0, to: 1, min: 0, max: 1, step: 0.1, precision: 2, suffix: '%', icon: ICON.ANIMATE_OPACITY },
  { value: 'x', label: 'X', from: 0, to: 100, min: -1000, max: 1000, step: 10, precision: 0, suffix: 'px', icon: ICON.ANIMATE_X },
  { value: 'y', label: 'Y', from: 0, to: 100, min: -1000, max: 1000, step: 10, precision: 0, suffix: 'px', icon: ICON.ANIMATE_Y },
  { value: 'scale', label: 'Scale', from: 0.5, to: 1.0, min: 0, max: 2, step: 0.1, precision: 2, suffix: '%', icon: ICON.ANIMATE_SCALE },
  { value: 'rotation', label: 'Rotation', from: 0, to: 360, min: -720, max: 720, step: 10, precision: 0, suffix: '°', icon: ICON.ANIMATE_ROTATION }
]

export const TRIGGER_SELECT_OPTIONS: TriggerOption[] = [
  { value: 'hover', label: 'Hover', icon: ICON.TRANSITION_TRIGGER },
  { value: 'loop', label: 'Loop', icon: ICON.TRANSITION_TRIGGER },
  { value: 'on', label: 'Load', icon: ICON.TRANSITION_TRIGGER },
  { value: 'off', label: 'Never', icon: ICON.TRANSITION_TRIGGER },
  { value: 'visible', label: 'Visible', icon: ICON.TRANSITION_TRIGGER }
]

export const TRIGGER_LABELS: { [key: string]: string } = {
  hover: 'On Hover',
  loop: 'Loop',
  on: 'On Load',
  off: 'Never',
  visible: 'When Visible'
}

export const EASE_SELECT_OPTIONS: EaseOption[] = [
  { value: 'linear', label: 'Linear', icon: ICON.EASE_LINEAR },
  { value: 'ease-in', label: 'Ease In', icon: ICON.EASE_IN },
  { value: 'ease-in-out', label: 'Ease In Out', icon: ICON.EASE_IN_OUT },
  { value: 'ease-out', label: 'Ease Out', icon: ICON.EASE_OUT }
]

export const EXPORT_FORMAT_SELECT_OPTIONS: ExportFormatOption[] = [
  { value: 'html', label: 'HTML' },
  { value: 'element', label: 'Element' },
  { value: 'svg', label: 'SVG' },
  { value: 'apng', label: 'APNG' },
  { value: 'mp4', label: 'MP4' }
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
  html: { type: 'text/html', extension: 'html' },
  apng: { type: 'image/apng', extension: 'png' },
  mp4: { type: 'video/mp4', extension: 'mp4' }
}
