import { AnimTimeline, TreeNode, serializeAnimString } from '@figmania/common'
import { NodeData } from '../types/NodeModel'

export function normalizeTick(value: number): number {
  return Math.ceil(value * 10) / 10
}

export function flattenNodeTree(node: TreeNode<NodeData>): TreeNode<NodeData>[] {
  return node.children.reduce((arr, child) => {
    arr.push(...flattenNodeTree(child))
    return arr
  }, [node])
}

export function maxTimelineDuration(node: TreeNode<NodeData>): number {
  return node.data.timelines.reduce((cur, timeline) => {
    const transitionMax = Math.max(...timeline.transitions.map((transition) => transition.to))
    return Math.max(cur, transitionMax)
  }, 0)
}

export function nodeTreeHasTransitions(node: TreeNode<NodeData>): boolean {
  return flattenNodeTree(node).some((child) => {
    return child.data.timelines.some((timeline) => {
      return timeline.transitions.length > 0
    })
  })
}

export function getNodeTreeMaxDuration(node: TreeNode<NodeData>): number {
  const flatNodes = flattenNodeTree(node)
  return flatNodes.reduce((cur, flatNode) => {
    const timelineMax = maxTimelineDuration(flatNode)
    return Math.max(cur, timelineMax)
  }, 0)
}

export function hasMultiTimelines(timelines: AnimTimeline[]): boolean {
  return timelines.some(({ transitions }) => transitions.length > 1)
}

export function getTimelinesHash(timelines: AnimTimeline[]): string {
  return timelines.map(({ initialValue, transitions }) => serializeAnimString(initialValue, transitions)).join(':')
}
