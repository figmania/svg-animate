import { ICON, Icon } from '@figmania/ui'
import clsx from 'clsx'
import { FunctionComponent } from 'react'
import { useHelp } from '../hooks/useHelp'
import { HelpText } from '../utils/help'
import styles from './HelpBar.module.scss'

export interface HelpBarProps { }

export const HelpBar: FunctionComponent<HelpBarProps> = () => {
  const { help } = useHelp()
  return (
    <div className={clsx(styles['help'], help && styles['active'])}>
      <Icon icon={ICON.UI_HELP} color={help ? 'var(--text-color-primary)' : 'var(--text-color-secondary)'} />
      <span>{help ?? HelpText.DEFAULT}</span>
    </div>
  )
}
