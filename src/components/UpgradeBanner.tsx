import { useController } from '@figmania/ui'
import { FunctionComponent } from 'react'
import { Schema } from '../Schema'
import styles from './UpgradeBanner.module.scss'

export interface UpgradeBannerProps {
  onUpgrade: () => void
}

export const UpgradeBanner: FunctionComponent<UpgradeBannerProps> = ({ onUpgrade }) => {
  const controller = useController<Schema>()
  return (
    <div className={styles['banner']} onClick={() => {
      controller.request('purchase', 'SKIP').then((success) => {
        if (success) { onUpgrade() }
      })
    }}>
      <div className={styles['info']}>
        <div><strong>UPGRADE NOW</strong> to unlock multiple transitions per timeline</div>
      </div>
      <div className={styles['button']}>
        <strong>$ 19.50</strong>
      </div>
    </div>
  )
}
