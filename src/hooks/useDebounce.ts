/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react'

export const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
  const timeoutRef = useRef<number>()

  useEffect(() => {
    return () => {
      if (timeoutRef.current) { clearTimeout(timeoutRef.current) }
    }
  }, [])

  const debouncedCallback = (...args: any[]) => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current) }
    timeoutRef.current = setTimeout(() => { callback(...args) }, delay)
  }

  return debouncedCallback
}
