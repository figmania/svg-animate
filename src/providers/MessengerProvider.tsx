
import { createUiDelegate } from '@figmania/common'
import { createContext, FunctionComponent, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { AppConfig, DEFAULT_CONFIG } from '../messenger/AppConfig'
import { AppMessenger } from '../messenger/AppMessenger'
import { NodeSelectEvent, NodeType } from '../messenger/events/NodeSelectEvent'

export const MessengerContext = createContext<AppMessenger>(null!)

export const MessengerProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const messenger = new AppMessenger(createUiDelegate())
  return <MessengerContext.Provider value={messenger}>{children}</MessengerContext.Provider>
}

export function useMessenger(): AppMessenger {
  return useContext(MessengerContext)
}

export function useConfig(): [AppConfig, (config: Partial<AppConfig>) => void] {
  const [config, setConfig] = useState<AppConfig>({ ...DEFAULT_CONFIG })
  const messenger = useMessenger()
  const saveConfig = (value: Partial<AppConfig>) => {
    messenger.request('setConfig', value)
    setConfig({ ...config, ...value })
  }
  useEffect(() => messenger.on('config:changed', setConfig))
  return [config, saveConfig]
}

export function useNode(): NodeSelectEvent {
  const [event, setEvent] = useState<NodeSelectEvent>({ type: NodeType.NONE })
  const messenger = useMessenger()
  useEffect(() => messenger.on('node:select', setEvent))
  return event
}
