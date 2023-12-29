import { render } from '@figmania/gsap'
import clsx from 'clsx'
import { gsap } from 'gsap'
import { createRef, FunctionComponent, HTMLAttributes, useEffect, useLayoutEffect, useState } from 'react'
import styles from './SvgAnimate.module.scss'

export interface SvgAnimateProps extends HTMLAttributes<HTMLDivElement> {
  svg: string
  loop?: boolean
  paused?: boolean
}

export const SvgAnimate: FunctionComponent<SvgAnimateProps> = ({ svg, paused = false, loop = false, className, ...props }) => {
  const [timeline, setTimeline] = useState<gsap.core.Timeline>()
  const ref = createRef<HTMLDivElement>()

  useLayoutEffect(() => {
    let tl: gsap.core.Timeline
    const ctx = gsap.context(() => {
      tl = render(ref.current!.firstChild as SVGSVGElement) as gsap.core.Timeline
      tl.paused(paused)
      tl.repeat(loop ? -1 : 0)
      setTimeline(tl)
      return () => ctx.revert()
    }, ref)
    return () => { tl?.clear(true) }
  }, [svg, loop])

  useEffect(() => {
    if (!timeline) { return }
    timeline.eventCallback('onComplete', () => { timeline.pause(undefined, false) })
    return () => { timeline.eventCallback('onComplete', null) }
  }, [timeline])

  return (
    <div ref={ref} className={clsx(styles['svg'], className)} dangerouslySetInnerHTML={{ __html: svg }} {...props} />
  )
}
