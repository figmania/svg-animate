import { FunctionComponent } from 'react'
import { Playback } from '../components/Playback'
import { useCode } from '../hooks/useCode'
import { useNode } from '../hooks/useNode'
import { shared } from '../utils/styles'

export const PreviewScreen: FunctionComponent = () => {
  const { masterNode } = useNode()
  const code = useCode()

  return (
    <div className={shared('screen')}>
      {masterNode && code && <Playback code={code} loop={masterNode.data.trigger === 'loop'} />}
    </div>
  )
}
