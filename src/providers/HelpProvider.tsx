/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, PropsWithChildren, useState } from 'react'
import { HelpContext } from '../context/HelpContext'
import { HelpText } from '../utils/help'

export const HelpProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [help, setHelp] = useState<HelpText>()

  function updateHelp(value: HelpText | undefined): void {
    setHelp(value)
  }

  return <HelpContext.Provider value={{ help, updateHelp }}>{children}</HelpContext.Provider>
}
