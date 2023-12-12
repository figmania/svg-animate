import { Element, Root } from 'unihtml'
import { EMBED_URL } from './contants'

export function wrapHtml(root: Root, trigger: string): Root {
  const component = wrapWebComponent(root, trigger)
  return {
    type: 'root',
    data: { quirksMode: false },
    children: [{
      type: 'element',
      tagName: 'html',
      children: [{
        type: 'element',
        tagName: 'head',
        children: []
      }, {
        type: 'element',
        tagName: 'body',
        children: [component.children[0] as Element, {
          type: 'element',
          tagName: 'script',
          properties: { src: EMBED_URL },
          children: []
        }]
      }]
    }]
  }
}

export function wrapWebComponent(root: Root, trigger: string): Root {
  return {
    type: 'root',
    data: { quirksMode: false },
    children: [{
      type: 'element',
      tagName: 'svg-animate',
      properties: { trigger },
      children: [root.children[0] as Element]
    }]
  }
}
