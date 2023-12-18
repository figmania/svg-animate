import { FunctionComponent, PropsWithChildren, ReactNode } from 'react'
import styles from './BetaBanner.module.scss'

export interface BetaBannerProps extends PropsWithChildren {
  cta: ReactNode
  onClick?: () => void
}

export const BetaBanner: FunctionComponent<BetaBannerProps> = ({ children, cta, onClick }) => {
  return (
    <div className={styles['banner']} onClick={onClick}>
      {children && <div className={styles['info']}>{children}</div>}
      <div className={styles['button']}>{cta}</div>
    </div>
  )
}
