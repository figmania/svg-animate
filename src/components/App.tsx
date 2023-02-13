import { bufferDecodeUtf8, nodeIdHash, nodeList, svgTransform, TreeNode } from '@figmania/common'
import { Button, Navbar } from '@figmania/ui'
import { setDefaultProps, setTweenProps, TweenProps } from '@figmania/webcomponent'
import { FunctionComponent, useEffect, useState } from 'react'
import { useMessenger } from '../providers/FigmaProvider'
import { ExportRequest, ExportResponse, SelectRequest, UpdateRequest } from '../types/messages'
import { NodeData } from '../utils/shared'
import { Editor } from './Editor'
import { Export } from './Export'
import { Tutorial } from './Tutorial'

export interface AnimationProperties {
  [key: string]: number
}

export const App: FunctionComponent = () => {
  const [node, setNode] = useState<TreeNode<NodeData>>()
  const [data, setData] = useState<NodeData>()
  const [code, setCode] = useState<string>()
  const [exportData, setExportData] = useState<NodeData>()
  const [hasExport, setHasExport] = useState<boolean>()
  const [tutorial, setTutorial] = useState(false)

  const messenger = useMessenger()

  const generateCode = async (targetNode?: TreeNode<NodeData>) => {
    if (!targetNode) { return }
    const { buffer } = await messenger.request<ExportRequest, ExportResponse>('export', { node: targetNode })
    const contents = await bufferDecodeUtf8(buffer)
    const result = svgTransform(contents, targetNode, { replaceIds: true }, (svg) => {
      svg.removeAttribute('width')
      svg.removeAttribute('height')
      svg.setAttribute('xmlns:anim', 'http://www.w3.org/2000/anim')
      setDefaultProps(svg, { transformOrigin: '50% 50%', duration: targetNode.data.duration, ease: targetNode.data.ease })
      const list = nodeList<NodeData>(targetNode).filter(({ data: { active } }) => active)
      for (const item of list) {
        const hash = nodeIdHash(item.id)
        const target = svg.getElementById(hash)
        if (!target) { continue }
        const from = item.data.animations.reduce<AnimationProperties>((obj, entry) => { obj[entry.type] = entry.from; return obj }, {})
        const to = item.data.animations.reduce<AnimationProperties>((obj, entry) => { obj[entry.type] = entry.to; return obj }, {})
        const props: TweenProps = { from, to, delay: item.data.delay }
        if (item.data.duration) { props.duration = item.data.duration }
        setTweenProps(target, props)
      }
      return svg
    })
    setCode(result)
  }

  const handleSelectRequest = async (request: SelectRequest) => {
    setNode(request.node)
    setHasExport(request.hasExport)
    setExportData(request.exportData)
    if (request.node && request.hasExport) { await generateCode(request.node) }
    setData(request.node?.data)
  }

  const handleTutorialRequest = async (request: boolean) => {
    setTutorial(request)
    return request
  }

  useEffect(() => {
    if (!messenger) { return }
    messenger.addRequestHandler<SelectRequest, void>('select', handleSelectRequest)
    messenger.addRequestHandler<boolean, boolean>('tutorial', handleTutorialRequest)
  }, [messenger])

  const update = async (newData: Partial<NodeData>, shouldExport = false) => {
    if (!node) { throw new Error('Invalid node for update') }
    Object.assign(node.data, newData)
    await messenger.request<UpdateRequest, void>('update', { node })
    if (shouldExport) { await generateCode(node) }
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
              messenger.request<{}, void>('enableExport', {})
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
