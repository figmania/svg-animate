import { useContext } from 'react'
import { HelpContext, HelpContextValue } from '../context/HelpContext'

export function useHelp(): HelpContextValue {
  return useContext(HelpContext)
}
