import { useContext } from 'react'
import { NodeContext, NodeContextValue } from '../context/NodeContext'

export function useNode(): NodeContextValue {
  return useContext(NodeContext)
}
