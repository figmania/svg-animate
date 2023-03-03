import { setDefaultProps, setTweenProps, TweenProps } from '@figmania/anim'
import { bufferDecodeUtf8, Messenger, MessengerDelegate, nodeList, svgTransform, TreeNode, uid } from '@figmania/common'
import { NodeData } from '../utils/shared'
import { Schema } from './Schema'

export class AppMessenger extends Messenger<Schema> {
  constructor(delegate: MessengerDelegate) {
    super(delegate)
  }

  async generateCode(targetNode?: TreeNode<NodeData>): Promise<string | undefined> {
    if (!targetNode) { return }
    const { buffer } = await this.request('export', { node: targetNode })
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
}
