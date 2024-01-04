import { transformSvg } from '@figmania/common'
import { sequence } from '@figmania/encoder-sequence'
import { createSvg } from '@figmania/encoder-svg-renderer'
import { Button, ButtonProps, useConfig, useController, useNotify } from '@figmania/ui'
import clsx from 'clsx'
import { FunctionComponent, useState } from 'react'
import { Config, Schema } from '../Schema'
import { MPEvent, useAnalytics } from '../hooks/useAnalytics'
import { useCheckout } from '../hooks/useCheckout'
import { useNode } from '../hooks/useNode'
import { PurchaseStatus, apiSvgsCreate, apiSvgsPolicy, apiUsersStatus, fetchUpload, functionApiEncode } from '../utils/api'
import styles from './ExportButton.module.scss'

export interface ExportButtonProps extends Omit<ButtonProps, 'loading' | 'onClick'> { }

export const ExportButton: FunctionComponent<ExportButtonProps> = ({ className, ...props }) => {
  const { uuid, masterNode, width, height } = useNode()
  const controller = useController<Schema>()
  const notify = useNotify()
  const { trackEvent } = useAnalytics()
  const [config] = useConfig<Config>()
  const [paid, checkout] = useCheckout()
  const [loading, setLoading] = useState(false)

  async function runExport() {
    if (!masterNode) { return }
    const contents = await controller.request('export', masterNode).then((value) => transformSvg(value, masterNode))
    const { purchaseStatus } = await apiUsersStatus(config.userId, config.user)
    if (purchaseStatus === PurchaseStatus.UNPAID) { await checkout('TRIAL_ENDED') }
    trackEvent(MPEvent.EXPORT_SVG, { type: 'upload', size: contents.length })
    const { svgUrl, zipUrl } = await apiSvgsPolicy(config.userId, uuid, masterNode.id)
    const svg = createSvg(contents)
    svg.setAttribute('width', String(width))
    svg.setAttribute('height', String(height))
    const zip = await sequence(svg, 30)
    await Promise.all([
      fetchUpload(svgUrl, contents, 'image/svg+xml'),
      fetchUpload(zipUrl, zip, 'application/zip')
    ])
    const svgId = `${uuid}:${masterNode.id}`
    const { url } = await functionApiEncode(config.userId, svgId)
    window.open(url, '_blank')
    await apiSvgsCreate(config.userId, uuid, masterNode.id, masterNode.name)
  }

  if (!masterNode) { return <></> }

  return (
    <div className={styles['container']}>
      {!paid && (
        <div className={styles['tooltip']}>
          <strong>Video Export</strong> is a <strong>PRO Feature</strong>
          <br />
          Try 7 days for free
        </div>
      )}
      <Button className={clsx(
        styles['button'],
        !paid && styles['locked'],
        className
      )} loading={loading} onClick={() => {
        if (!width || !height || loading) { return }
        setLoading(true)
        runExport().catch((error: Error) => {
          notify(error.message)
        }).then(() => {
          setLoading(false)
        })
      }} {...props} />
    </div>
  )
}
