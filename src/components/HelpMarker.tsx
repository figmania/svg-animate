import { FunctionComponent, ReactElement } from 'react'
import { useHelp } from '../hooks/useHelp'
import { HelpText } from '../utils/help'

export interface HelpMarkerProps {
  text: HelpText
  children: ReactElement<HTMLElement>
}

export const HelpMarker: FunctionComponent<HelpMarkerProps> = ({ text, children }) => {
  const { updateHelp } = useHelp()
  const Child = children.type
  return (
    <Child {...children.props} onMouseEnter={() => { updateHelp(text) }} onMouseLeave={() => { updateHelp(undefined) }} />
  )
}
