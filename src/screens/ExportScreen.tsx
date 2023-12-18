import { TreeNode, prettyPrint, uiDownload } from '@figmania/common'
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
  update: (data: Partial<NodeData>, shouldExport: boolean) => Promise<void>
}

export const ExportScreen: FunctionComponent<ExportScreenProps> = ({ node, code, update }) => {
  const clipboard = useClipboard()
  const notify = useNotify()
  const { trigger, exportFormat } = node.data

  const formattedCode = useMemo(() => {
    if (!code) { return 'Loading ...' }
    switch (exportFormat) {
      case 'svg': { return code }
      case 'element': { return `<svg-animate trigger="${trigger}">${code}</svg-animate>` }
      case 'html': { return `<html><head></head><body><svg-animate trigger="${trigger}">${code}</svg-animate><script src="${EMBED_URL}"></${'script'}></body></html>` }
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
        <Select disabled={exportFormat === 'svg'} className={styles['header-select']} placeholder="Trigger" value={trigger} options={TRIGGER_SELECT_OPTIONS} onChange={(option) => {
          const newTrigger = option.value
          if (trigger === newTrigger) { return }
          update({ trigger: newTrigger }, true)
        }} />
        <Button icon={ICON.UI_CLIPBOARD} onClick={() => {
          if (!code) { return }
          clipboard(prettyPrint(formattedCode))
          notify('Code copied to clipboard')
        }} />
        <Button icon={ICON.UI_DOWNLOAD} onClick={() => {
          if (!code) { return }
          const { type, extension } = DOWNLOAD_OPTIONS_MAP[exportFormat]
          uiDownload(prettyPrint(formattedCode), { type, filename: `${node.name}.${extension}` })
        }} />
      </Navbar>
      <div className={styles['container']}>
        <Code value={formattedCode} indent />
      </div>
    </>
  )
}
