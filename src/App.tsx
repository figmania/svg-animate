import { TreeNode, transformSvg } from '@figmania/common'
import { ICON, NavigationBar, useController, useNode } from '@figmania/ui'
import { FunctionComponent, useEffect, useState } from 'react'
import { NodeType, Schema } from './Schema'
import { EditorScreen } from './screens/EditorScreen'
import { EmptyScreen } from './screens/EmptyScreen'
import { ExportScreen } from './screens/ExportScreen'
import { PreviewScreen } from './screens/PreviewScreen'
import { NodeData } from './types/NodeModel'

export enum Screen { PREVIEW, EXPORT, EDITOR }

export const App: FunctionComponent = () => {
  const [screen, setScreen] = useState(Screen.PREVIEW)
  const [code, setCode] = useState<string>()
  const { type, node, masterNode } = useNode<Schema>({ type: NodeType.NONE })
  const controller = useController<Schema>()

  const generateCode = async (targetNode?: TreeNode<NodeData>) => {
    if (!targetNode) { return }
    const contents = await controller.request('export', targetNode)
    return transformSvg(contents, targetNode)
  }

  const updateMaster = async (newData: Partial<NodeData>, shouldExport = false) => {
    if (!masterNode) { throw new Error('Invalid node for update') }
    Object.assign(masterNode.data, newData)
    await controller.request('update', masterNode)
    if (shouldExport) {
      setCode(undefined)
      setCode(await generateCode(masterNode))
    }
  }

  const updateChild = async (newData: Partial<NodeData>, shouldExport = false) => {
    if (!node) { throw new Error('Invalid node for update') }
    Object.assign(node.data, newData)
    await controller.request('update', node)
    if (shouldExport) {
      setCode(undefined)
      setCode(await generateCode(masterNode))
    }
  }

  useEffect(() => {
    if (!masterNode) { return }
    setCode(undefined)
    generateCode(masterNode).then(setCode)
  }, [masterNode])

  useEffect(() => {
    if (type === NodeType.MASTER && screen === Screen.EDITOR) { setScreen(Screen.PREVIEW) }
    if (type === NodeType.CHILD && screen === Screen.PREVIEW) { setScreen(Screen.EDITOR) }
  }, [type])

  if (!node || type === NodeType.ORPHAN) { return <EmptyScreen node={node} /> }

  return (
    <>
      {screen === Screen.PREVIEW && masterNode && <PreviewScreen node={masterNode} update={updateMaster} code={code} />}
      {screen === Screen.EXPORT && masterNode && <ExportScreen node={masterNode} update={updateMaster} code={code} />}
      {screen === Screen.EDITOR && <EditorScreen node={node} update={updateChild} duration={masterNode?.data.duration ?? 1000} />}
      <NavigationBar selectedIndex={screen} onChange={(_, index) => { setScreen(index) }} items={[
        { icon: ICON.CONTROL_PLAY, label: 'Preview' },
        { icon: ICON.UI_DOWNLOAD, label: 'Export' },
        { icon: ICON.UI_ADJUST, label: 'Editor' }
      ]} />
    </>
  )
}

// disabled: type === NodeType.MASTER
