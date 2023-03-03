import { anim, Timeline } from '@figmania/anim'
import { gsap } from 'gsap'
import { createRef, FunctionComponent, useLayoutEffect, useState } from 'react'
import styles from './Playback.module.scss'
import { PlaybackControls } from './PlaybackControls'

export interface PlaybackProps {
  code: string
  loop: boolean
}

export const Playback: FunctionComponent<PlaybackProps> = ({ code, loop }) => {
  const [timeline, setTimeline] = useState<Timeline>()
  const ref = createRef<HTMLDivElement>()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const svg = ref.current!.firstChild as SVGSVGElement
      setTimeline(anim(svg, { paused: false, repeat: loop ? -1 : 0 }))
      return () => ctx.revert()
    }, ref)
  }, [code, loop])

  return (
    <div className={styles['container']}>
      <div ref={ref} className={styles['svg']} dangerouslySetInnerHTML={{ __html: code }} />
      {timeline && (<PlaybackControls timeline={timeline} />)}
    </div>
  )
}
