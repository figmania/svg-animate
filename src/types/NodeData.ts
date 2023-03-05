import { Animation } from './Animation'
import { ExportFormat } from './Export'

export interface NodeData {
  active: boolean
  delay: number
  duration: number
  ease: string
  trigger: string
  animations: Animation[]
  exportFormat: ExportFormat
}
