import { FunctionComponent, ReactElement } from 'react'

export interface HoverInfoProps {
  text: string
  emit: (enter: boolean, text?: string) => void
  children: ReactElement<HTMLElement>
}

export const HoverInfo: FunctionComponent<HoverInfoProps> = ({ children, emit, text }) => {
  const Child = children.type
  return (
    <Child {...children.props} onMouseEnter={() => { emit(true, text) }} onMouseLeave={() => { emit(false) }} />
  )
}
