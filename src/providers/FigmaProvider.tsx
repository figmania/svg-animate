
import { FigmaMessageEvent, Messenger, MessengerDelegate } from '@figmania/common'
import { ComponentType, createContext, FunctionComponent, PropsWithChildren, useContext } from 'react'

export interface WithFigmaProps {
  messenger: Messenger
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
  const messenger = new Messenger(createUiDelegate())
  return <FigmaContext.Provider value={{ messenger }}>{children}</FigmaContext.Provider>
}

export function useFigma() {
  return useContext(FigmaContext)
}

export function useMessenger() {
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
