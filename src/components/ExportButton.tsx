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
import { apiSvgsCreate, fetchUpload, functionApiEncode } from '../utils/api'
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
    trackEvent(MPEvent.EXPORT_SVG, { type: 'upload', size: contents.length })

    // Create and Provision SVG
    const id = `${uuid}:${masterNode.id}`
    const response = await apiSvgsCreate({
      id,
      name: masterNode.name,
      user: { id: config.userId, name: config.user?.name, image: config.user?.image }
    })
    if (!response.success) {
      await checkout('TRIAL_ENDED')
      runExport()
      return
    }

    // Generate Zip Package
    const svg = createSvg(contents)
    svg.setAttribute('width', String(width))
    svg.setAttribute('height', String(height))
    const framerate = 30
    const [zip, numFrames] = await sequence(svg, framerate)

    // Upload Assets
    await Promise.all([
      fetchUpload(response.svgUrl, contents, 'image/svg+xml'),
      fetchUpload(response.zipUrl, zip, 'application/zip')
    ])

    // EncodeVideo
    const { url } = await functionApiEncode({ svgId: id, userId: config.userId, framerate, numFrames })
    window.open(url, '_blank')
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
