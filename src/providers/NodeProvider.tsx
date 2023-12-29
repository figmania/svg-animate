/* eslint-disable @typescript-eslint/no-explicit-any */
import { TreeNode, nodeList } from '@figmania/common'
import { useController, useNodeEvent } from '@figmania/ui'
import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react'
import { NodeEvent, Schema } from '../Schema'
import { NodeContext } from '../context/NodeContext'
import { NodeData } from '../types/NodeModel'

export interface NodeProviderProps extends PropsWithChildren {
  defaultValue: NodeEvent
}

export const NodeProvider: FunctionComponent<NodeProviderProps> = ({ defaultValue, children }) => {
  const controller = useController<Schema>()
  const nodeEvent = useNodeEvent<Schema>(defaultValue)
  const [event, setEvent] = useState(nodeEvent)

  useEffect(() => { setEvent(nodeEvent) }, [nodeEvent])

  async function update(node: TreeNode<NodeData>, data?: Partial<NodeData>): Promise<void> {
    if (data) { Object.assign(node.data, data) }
    await controller.request('update', node)
    if (event.masterNode) {
      const childNode = nodeList(event.masterNode).find(({ id }) => id === node.id)
      if (childNode) { Object.assign(childNode.data, data) }
    }
    setEvent({ ...event })
  }

  return <NodeContext.Provider value={{ ...event, update }}>{children}</NodeContext.Provider>
}
