
import { FigmaMessageEvent, MessengerDelegate } from '@figmania/common'
import { ComponentType, createContext, FunctionComponent, PropsWithChildren, useContext } from 'react'
import { AppMessenger } from '../messenger/AppMessenger'

export interface WithFigmaProps {
  messenger: AppMessenger
}

export const FigmaContext = createContext<WithFigmaProps>(null!)

function createUiDelegate(): MessengerDelegate {
  return {
    name: 'ui',
    send: (message) => { window.parent.postMessage({ pluginMessage: message }, '*') },
    listen: (callback) => { window.onmessage = (message: FigmaMessageEvent) => { callback(message.data.pluginMessage) } }
  }
}

export const FigmaProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const messenger = new AppMessenger(createUiDelegate())
  return <FigmaContext.Provider value={{ messenger }}>{children}</FigmaContext.Provider>
}

export function useFigma() {
  return useContext(FigmaContext)
}

export function useMessenger(): AppMessenger {
  return useFigma().messenger
}

export function withFigma<T extends WithFigmaProps = WithFigmaProps>(WrappedComponent: ComponentType<T>) {
  const displayName = WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component'
  const ComponentWithFigma = (props: Omit<T, keyof WithFigmaProps>) => {
    const figmaProps = useFigma()
    return <WrappedComponent {...figmaProps} {...(props as T)} />
  }
  ComponentWithFigma.displayName = `withFigma(${displayName})`
  return ComponentWithFigma
}
