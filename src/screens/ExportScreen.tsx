import { TreeNode, prettyPrint, uiDownload } from '@figmania/common'
import { convert } from '@figmania/converter'
import { Button, Code, ICON, Navbar, Select, useClipboard, useNotify } from '@figmania/ui'
import { FunctionComponent, useMemo } from 'react'
import { ExportFormat } from '../types/Export'
import { NodeData } from '../types/NodeModel'
import { EMBED_URL } from '../utils/contants'
import { DOWNLOAD_OPTIONS_MAP, EXPORT_FORMAT_SELECT_OPTIONS, TRIGGER_SELECT_OPTIONS } from '../utils/shared'
import styles from './ExportScreen.module.scss'

export interface ExportScreenProps {
  node: TreeNode<NodeData>
  code?: string
  width?: number
  height?: number
  update: (data: Partial<NodeData>, shouldExport: boolean) => Promise<void>
}

export const ExportScreen: FunctionComponent<ExportScreenProps> = ({ node, code, width, height, update }) => {
  const clipboard = useClipboard()
  const notify = useNotify()
  const { trigger, exportFormat } = node.data

  const formattedCode = useMemo(() => {
    if (!code) { return 'Loading ...' }
    switch (exportFormat) {
      case 'svg': { return code }
      case 'element': { return `<svg-animate trigger="${trigger}">${code}</svg-animate>` }
      case 'html': { return `<html><head></head><body><svg-animate trigger="${trigger}">${code}</svg-animate><script src="${EMBED_URL}"></${'script'}></body></html>` }
      case 'apng': { return false }
      case 'mp4': { return false }
      default: { return '</>' }
    }
  }, [code, exportFormat, trigger])

  return (
    <>
      <Navbar icon={ICON.UI_DOWNLOAD} label='Export'>
        <Select className={styles['header-select']} placeholder="Export Format" value={exportFormat} options={EXPORT_FORMAT_SELECT_OPTIONS} onChange={(option) => {
          const newExportFormat = option.value as ExportFormat
          if (exportFormat === newExportFormat) { return }
          update({ exportFormat: newExportFormat }, true)
        }} />
        <Select disabled={['svg', 'apng', 'mp4'].includes(exportFormat)} className={styles['header-select']} placeholder="Trigger" value={trigger} options={TRIGGER_SELECT_OPTIONS} onChange={(option) => {
          const newTrigger = option.value
          if (trigger === newTrigger) { return }
          update({ trigger: newTrigger }, true)
        }} />
        <Button disabled={['apng', 'mp4'].includes(exportFormat)} icon={ICON.UI_CLIPBOARD} onClick={() => {
          if (!code || !formattedCode) { return }
          clipboard(prettyPrint(formattedCode))
          notify('Code copied to clipboard')
        }} />
        <Button icon={ICON.UI_DOWNLOAD} onClick={() => {
          if (!code) { return }
          const { type, extension } = DOWNLOAD_OPTIONS_MAP[exportFormat]
          if (formattedCode) {
            uiDownload(prettyPrint(formattedCode), { type, filename: `${node.name}.${extension}` })
          } else if (exportFormat === 'apng') {
            if (!width || !height) { return }
            const loop = node.data.trigger === 'loop'
            convert(code, { format: 'apng', fps: 30, width, height, loop, lossy: true }).then((buffer) => {
              const data = new Uint8Array(buffer) as unknown as string
              uiDownload(data, { type: 'image/apng', filename: `${node.name}.png` })
            })
          } else if (exportFormat === 'mp4') {
            if (!width || !height) { return }
            const loop = node.data.trigger === 'loop'
            convert(code, { format: 'mp4', fps: 30, width, height, loop, lossy: true }).then((buffer) => {
              const data = new Uint8Array(buffer) as unknown as string
              uiDownload(data, { type: 'video/mp4', filename: `${node.name}.mp4` })
            })
          }
        }} />
      </Navbar>
      <div className={styles['container']}>
        {formattedCode && <Code value={formattedCode} indent />}
      </div>
    </>
  )
}
