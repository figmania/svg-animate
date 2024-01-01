/* eslint-disable @typescript-eslint/no-explicit-any */
import Mixpanel from 'mixpanel-figma'
import { FunctionComponent, PropsWithChildren, useMemo } from 'react'
import { AnalyticsContext } from '../context/AnalyticsContext'

export interface AnalyticsProviderProps extends PropsWithChildren {
  token: string
}

export const AnalyticsProvider: FunctionComponent<AnalyticsProviderProps> = ({ token, children }) => {
  const mixpanel = useMemo(() => {
    try {
      return Mixpanel.init(token, { disable_cookie: true, disable_persistence: true }, 'figmania')
    } catch {
      // ignore
    }
  }, [token])
  return <AnalyticsContext.Provider value={{ mixpanel }}>{children}</AnalyticsContext.Provider>
}
