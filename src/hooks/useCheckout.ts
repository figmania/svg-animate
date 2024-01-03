import { useController } from '@figmania/ui'
import { useCallback, useEffect, useState } from 'react'
import { Schema } from '../Schema'
import { MPEvent, useAnalytics } from './useAnalytics'
import { useNode } from './useNode'

export function useCheckout(): [boolean, (interstition?: 'PAID_FEATURE' | 'TRIAL_ENDED' | 'SKIP') => Promise<void>] {
  const event = useNode()
  const controller = useController<Schema>()
  const [paid, setPaid] = useState(event.paid)
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    setPaid(event.paid)
  }, [event.paid])

  const checkout = useCallback((interstitial: 'PAID_FEATURE' | 'TRIAL_ENDED' | 'SKIP' = 'PAID_FEATURE') => {
    return new Promise<void>((resolve, reject) => {
      if (paid) {
        resolve()
      } else {
        trackEvent(MPEvent.START_CHECKOUT, { interstitial })
        controller.request('purchase', interstitial).then((success) => {
          if (success) {
            setPaid(true)
            trackEvent(MPEvent.COMPLETE_CHECKOUT, { interstitial })
            resolve()
          } else {
            setPaid(false)
            trackEvent(MPEvent.CANCEL_CHECKOUT, { interstitial })
            reject(new Error('This feature requires a purchase'))
          }
        })
      }
    })
  }, [controller, paid])

  return [paid, checkout]
}
