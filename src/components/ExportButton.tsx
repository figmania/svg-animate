import { transformSvg } from '@figmania/common'
import { Button, ButtonProps, useConfig, useController, useNotify } from '@figmania/ui'
import clsx from 'clsx'
import { FunctionComponent, useState } from 'react'
import { Config, Schema } from '../Schema'
import { MPEvent, useAnalytics } from '../hooks/useAnalytics'
import { useCheckout } from '../hooks/useCheckout'
import { useNode } from '../hooks/useNode'
import { PurchaseStatus, apiSvgsCreate, apiSvgsPolicy, apiUsersStatus, fetchUpload } from '../utils/api'
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
        controller.request('export', masterNode).then((value) => transformSvg(value, masterNode)).then((contents) => {
          return apiUsersStatus(config.userId, config.user).then(({ purchaseStatus }) => {
            if (purchaseStatus >= PurchaseStatus.TRIAL) { return }
            return checkout('TRIAL_ENDED')
          }).then(() => {
            trackEvent(MPEvent.EXPORT_SVG, { type: 'upload', size: contents.length })
            return apiSvgsPolicy(config.userId, uuid, masterNode.id)
          }).then(({ url }) => {
            return fetchUpload(url, contents, 'image/svg+xml')
          }).then(() => {
            return apiSvgsCreate(config.userId, uuid, masterNode.id, masterNode.name)
          }).then(({ url }) => {
            window.open(url, '_blank')
          })
        }).catch((error: Error) => {
          notify(error.message)
        }).then(() => {
          setLoading(false)
        })
      }} {...props} />
    </div>
  )
}
