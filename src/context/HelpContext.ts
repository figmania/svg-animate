/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react'
import { HelpText } from '../utils/help'

export interface HelpContextValue {
  help?: HelpText
  updateHelp: (value: HelpText | undefined) => void
}

export const HelpContext = createContext<HelpContextValue>(null!)
