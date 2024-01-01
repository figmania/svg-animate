/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mixpanel } from 'mixpanel-figma'
import { createContext } from 'react'

export interface AnalyticsContextValue {
  mixpanel?: Mixpanel
}

export const AnalyticsContext = createContext<AnalyticsContextValue>(null!)
