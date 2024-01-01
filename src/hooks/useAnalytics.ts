import { useContext } from 'react'
import { User } from '../Schema'
import { AnalyticsContext } from '../context/AnalyticsContext'

export enum MPEvent {
  VIEW_SCREEN = 'View Screen',
  EXPORT_SVG = 'Export SVG',
  START_CHECKOUT = 'Start Checkout',
  CANCEL_CHECKOUT = 'Cancel Checkout',
  COMPLETE_CHECKOUT = 'Start Checkout',
  CREATE_ANIMATION = 'Create Animation',
  EDIT_TIMELINE = 'Edit Timeline'
}

export type MPEventProperties = {
  [MPEvent.VIEW_SCREEN]: { name: string }
  [MPEvent.EXPORT_SVG]: { type: 'clipboard' | 'download' | 'upload', size: number }
  [MPEvent.START_CHECKOUT]: { interstitial: 'PAID_FEATURE' | 'TRIAL_ENDED' | 'SKIP' }
  [MPEvent.CANCEL_CHECKOUT]: { interstitial: 'PAID_FEATURE' | 'TRIAL_ENDED' | 'SKIP' }
  [MPEvent.COMPLETE_CHECKOUT]: { interstitial: 'PAID_FEATURE' | 'TRIAL_ENDED' | 'SKIP' }
  [MPEvent.CREATE_ANIMATION]: {}
  [MPEvent.EDIT_TIMELINE]: { transitionCount: number }
}

export function useAnalytics() {
  const { mixpanel } = useContext(AnalyticsContext)

  function identify(userId: string, user?: User) {
    if (!mixpanel) { return }
    if (!userId || userId === 'unknown') { return }
    mixpanel.identify(userId)
    if (user) { mixpanel.people.set({ $avatar: user.image, $name: user.name }) }
  }

  function trackEvent<T extends MPEvent>(eventName: T, properties?: MPEventProperties[T]) {
    if (!mixpanel) { return }
    mixpanel.track(eventName, properties)
  }

  return { identify, trackEvent }
}
