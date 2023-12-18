import { figmaExportAsync, nodeTree, prettyPrint, transformSvg } from '@figmania/common'
import { NodeData, NodeModel } from '../types/NodeModel'
import { wrapHtml, wrapWebComponent } from '../utils/unihtml'

export function initDev() {
  figma.codegen.on('generate', async ({ node, language }) => {
    const trigger = figma.codegen.preferences.customSettings.trigger ?? 'hover'
    const contents = await figmaExportAsync(node)
    const result = transformSvg(contents, nodeTree<NodeData>(node, NodeModel), (root) => {
      if (language === 'svg-animate:html') {
        return wrapHtml(root, trigger)
      } else if (language === 'svg-animate:web-component') {
        return wrapWebComponent(root, trigger)
      } else {
        return root
      }
    })
    return [{ title: 'SVG Animate', language: 'HTML', code: prettyPrint(result) }]
  })
}
