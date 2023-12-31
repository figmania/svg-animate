import { useController } from '@figmania/ui'
import { useCallback, useEffect, useState } from 'react'
import { Schema } from '../Schema'
import { useNode } from './useNode'

export function useCheckout(): [boolean, () => Promise<void>] {
  const event = useNode()
  const controller = useController<Schema>()
  const [paid, setPaid] = useState(event.paid)

  useEffect(() => {
    setPaid(event.paid)
  }, [event.paid])

  const checkout = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (paid) {
        resolve()
      } else {
        controller.request('purchase', 'PAID_FEATURE').then((success) => {
          if (success) {
            setPaid(true)
            resolve()
          } else {
            setPaid(false)
            reject()
          }
        })
      }
    })
  }, [controller, paid])

  console.info('paid', paid)

  return [paid, checkout]
}
