import { FunctionComponent } from 'react'
import tutorial1 from '../assets/tutorials/tutorial-01.svg?raw'
import tutorial2 from '../assets/tutorials/tutorial-02.svg?raw'
import { SvgAnimate } from '../components/SvgAnimate'
import { useNode } from '../hooks/useNode'
import { shared } from '../utils/styles'
import styles from './TutorialScreen.module.scss'

export const TutorialScreen: FunctionComponent = () => {
  const { node } = useNode()
  return (
    <div className={shared('screen', 'flex-column', 'align-center', 'justify-center')}>
      {node ? (
        <SvgAnimate svg={tutorial2} loop className={styles['svg']} />
      ) : (
        <SvgAnimate svg={tutorial1} loop className={styles['svg']} />
      )}
    </div>
  )
}
