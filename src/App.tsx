import { setDefaultProps, setTweenProps, TweenProps } from '@figmania/anim'
import { bufferDecodeUtf8, nodeList, svgTransform, TreeNode, uid } from '@figmania/common'
import { useController, useNode } from '@figmania/ui'
import { FunctionComponent, useEffect, useState } from 'react'
import { NodeType, Schema } from './Schema'
import { EditorScreen } from './screens/EditorScreen'
import { EmptyScreen } from './screens/EmptyScreen'
import { ExportScreen } from './screens/ExportScreen'
import { NodeData } from './types/NodeData'

export const App: FunctionComponent = () => {
  const [data, setData] = useState<NodeData>()
  const [code, setCode] = useState<string>()
  const { type, node, masterData } = useNode<Schema>({ type: NodeType.NONE })
  const controller = useController<Schema>()

  const generateCode = async (targetNode?: TreeNode<NodeData>) => {
    if (!targetNode) { return }
    const { buffer } = await controller.request('export', targetNode)
    const contents = await bufferDecodeUtf8(buffer)
    return svgTransform(contents, targetNode, (svg) => {
      svg.removeAttribute('width')
      svg.removeAttribute('height')
      svg.setAttribute('xmlns:anim', 'http://www.w3.org/2000/anim')
      setDefaultProps(svg, { transformOrigin: '50% 50%', duration: targetNode.data.duration, ease: targetNode.data.ease })
      const list = nodeList<NodeData>(targetNode).filter(({ data: { active } }) => active)
      for (const item of list) {
        const hash = uid(item.id)
        const target = svg.getElementById(hash)
        if (!target) { continue }
        const from = item.data.animations.reduce<Record<string, number>>((obj, entry) => { obj[entry.type] = entry.from; return obj }, {})
        const to = item.data.animations.reduce<Record<string, number>>((obj, entry) => { obj[entry.type] = entry.to; return obj }, {})
        const props: TweenProps = { from, to, delay: item.data.delay }
        if (item.data.duration) { props.duration = item.data.duration }
        setTweenProps(target, props)
      }
      return svg
    })
  }

  const update = async (newData: Partial<NodeData>, shouldExport = false) => {
    if (!node) { throw new Error('Invalid node for update') }
    Object.assign(node.data, newData)
    await controller.request('update', node)
    if (shouldExport) {
      setCode(undefined)
      setCode(await generateCode(node))
    }
    setData((cur) => ({ ...cur!, ...newData }))
  }

  useEffect(() => {
    if (!node || type !== NodeType.MASTER) { return }
    setCode(undefined)
    generateCode(node).then(setCode)
  }, [node, type])

  useEffect(() => {
    if (!node) { return }
    setData(node.data)
  }, [node])

  if (type === NodeType.MASTER && node && data) {
    return <ExportScreen name={node.name} data={data} update={update} code={code} />
  } else if (type === NodeType.CHILD && node && masterData) {
    return <EditorScreen node={node} update={update} masterData={masterData} />
  } else {
    return <EmptyScreen node={node} />
  }
}
