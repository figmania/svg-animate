import { transformSvg } from '@figmania/common'
import { useController } from '@figmania/ui'
import { useEffect, useState } from 'react'
import { useNode } from './useNode'

export function useCode(): string | undefined {
  const { masterNode } = useNode()
  const [code, setCode] = useState<string>()
  const controller = useController()

  useEffect(() => {
    setCode(undefined)
    if (!masterNode) { return }
    controller.request('export', masterNode).then((contents) => transformSvg(contents, masterNode)).then(setCode)
  }, [masterNode])

  return code
}
