import { useController } from '@figmania/ui'
import { useCallback, useEffect, useState } from 'react'
import { Schema } from '../Schema'
import { MPEvent, useAnalytics } from './useAnalytics'
import { useNode } from './useNode'

export function useCheckout(): [boolean, () => Promise<void>] {
  const event = useNode()
  const controller = useController<Schema>()
  const [paid, setPaid] = useState(event.paid)
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    setPaid(event.paid)
  }, [event.paid])

  const checkout = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (paid) {
        resolve()
      } else {
        trackEvent(MPEvent.START_CHECKOUT, { interstitial: 'PAID_FEATURE' })
        controller.request('purchase', 'PAID_FEATURE').then((success) => {
          if (success) {
            setPaid(true)
            trackEvent(MPEvent.COMPLETE_CHECKOUT, { interstitial: 'PAID_FEATURE' })
            resolve()
          } else {
            setPaid(false)
            trackEvent(MPEvent.CANCEL_CHECKOUT, { interstitial: 'PAID_FEATURE' })
            reject(new Error('This feature requires a purchase'))
          }
        })
      }
    })
  }, [controller, paid])

  return [paid, checkout]
}
