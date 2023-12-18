import { Code } from '@figmania/ui'
import { FunctionComponent, useMemo } from 'react'
import { useCode } from '../hooks/useCode'
import { useNode } from '../hooks/useNode'
import { getFormattedCode } from '../utils/code'
import { shared } from '../utils/styles'

export const ExportScreen: FunctionComponent = () => {
  const { node, masterNode } = useNode()
  const code = useCode()

  const formattedCode = useMemo(() => {
    if (!masterNode || !code) { return 'Loading ...' }
    return getFormattedCode(code, masterNode.data.exportFormat, masterNode.data.trigger)
  }, [code, masterNode?.data.exportFormat, masterNode?.data.trigger])

  return (
    <div className={shared('screen')}>
      {node && masterNode && <Code value={formattedCode} indent />}
    </div>
  )
}
