import { FunctionComponent, useEffect, useState } from 'react'
import { NodeType } from './messenger/events/NodeSelectEvent'
import { useMessenger, useNode } from './providers/MessengerProvider'
import { EditorScreen } from './screens/EditorScreen'
import { EmptyScreen } from './screens/EmptyScreen'
import { ExportScreen } from './screens/ExportScreen'
import { NodeData } from './utils/shared'

export const App: FunctionComponent = () => {
  const [data, setData] = useState<NodeData>()
  const [code, setCode] = useState<string>()
  const { type, node, masterData } = useNode()
  const messenger = useMessenger()

  useEffect(() => { if (node && type === NodeType.MASTER) { messenger.generateCode(node).then(setCode) } }, [node, type])
  useEffect(() => { if (node) { setData(node.data) } }, [node])

  const update = async (newData: Partial<NodeData>, shouldExport = false) => {
    if (!node) { throw new Error('Invalid node for update') }
    Object.assign(node.data, newData)
    await messenger.request('update', { node })
    if (shouldExport) { setCode(await messenger.generateCode(node)) }
    setData((cur) => ({ ...cur!, ...newData }))
  }

  if (type === NodeType.MASTER && node && data) {
    return <ExportScreen name={node.name} data={data} update={update} code={code} />
  } else if (type === NodeType.CHILD && node && masterData) {
    return <EditorScreen node={node} update={update} masterData={masterData} />
  } else {
    return <EmptyScreen node={node} />
  }
}
