import { TreeNode } from '@figmania/common'
import { Button, Navbar } from '@figmania/ui'
import { FunctionComponent, useEffect, useState } from 'react'
import { SelectRequest } from '../messenger/AppSchema'
import { useMessenger } from '../providers/FigmaProvider'
import { NodeData } from '../utils/shared'
import { Editor } from './Editor'
import { Export } from './Export'
import { Tutorial } from './Tutorial'

export const App: FunctionComponent = () => {
  const [node, setNode] = useState<TreeNode<NodeData>>()
  const [data, setData] = useState<NodeData>()
  const [code, setCode] = useState<string>()
  const [exportData, setExportData] = useState<NodeData>()
  const [hasExport, setHasExport] = useState<boolean>()
  const [tutorial, setTutorial] = useState(false)

  const messenger = useMessenger()

  const handleSelectRequest = async (request: SelectRequest) => {
    setNode(request.node)
    setHasExport(request.hasExport)
    setExportData(request.exportData)
    if (request.node && request.hasExport) {
      const result = await messenger.generateCode(request.node)
      setCode(result)
    }
    setData(request.node?.data)
  }

  const handleTutorialRequest = async (request: boolean) => {
    setTutorial(request)
    return request
  }

  useEffect(() => {
    if (!messenger) { return }
    messenger.addRequestHandler('select', handleSelectRequest)
    messenger.addRequestHandler('tutorial', handleTutorialRequest)
  }, [messenger])

  const update = async (newData: Partial<NodeData>, shouldExport = false) => {
    if (!node) { throw new Error('Invalid node for update') }
    Object.assign(node.data, newData)
    await messenger.request('update', { node })
    if (shouldExport) {
      const result = await messenger.generateCode(node)
      setCode(result)
    }
    setData((cur) => ({ ...cur!, ...newData }))
  }

  if (!node) {
    return (
      <>
        <Navbar icon="ui-forward" title="No node selected" isDisabled={true}></Navbar>
        <Tutorial messenger={messenger} show={tutorial}></Tutorial>
      </>
    )
  }

  if (node && data && hasExport) {
    return <Export messenger={messenger} name={node.name} data={data} update={update} code={code}></Export>
  } else if (node && data && exportData) {
    return <Editor node={node} update={update} exportData={exportData}></Editor>
  } else {
    return (
      <>
        {node ? (
          <Navbar icon="ui-animate-off" title={node.name} isDisabled={true}>
            <Button icon={'ui-animate-on'} onClick={() => {
              if (!node) { return }
              messenger.request('enableExport', {})
            }} title="Enable SVG Export"></Button>
          </Navbar>
        ) : (
          <Navbar icon="ui-animate-off" title="No node selected" isDisabled={true}></Navbar>
        )}
        <Tutorial messenger={messenger} show={tutorial}></Tutorial>
      </>
    )
  }
}
