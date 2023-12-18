import { render } from '@figmania/gsap'
import { gsap } from 'gsap'
import { createRef, FunctionComponent, useEffect, useLayoutEffect, useState } from 'react'
import styles from './Playback.module.scss'
import { PlaybackControls } from './PlaybackControls'

export interface PlaybackProps {
  code: string
  loop: boolean
}

export const Playback: FunctionComponent<PlaybackProps> = ({ code, loop: initialLoop }) => {
  const [loop, setLoop] = useState(initialLoop)
  const [paused, setPaused] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [timeline, setTimeline] = useState<gsap.core.Timeline>()
  const ref = createRef<HTMLDivElement>()

  useLayoutEffect(() => {
    let tl: gsap.core.Timeline
    const ctx = gsap.context(() => {
      const svg = ref.current!.firstChild as SVGSVGElement
      tl = render(svg) as gsap.core.Timeline
      tl.paused(false)
      tl.repeat(initialLoop ? -1 : 0)
      setTimeline(tl)
      setDuration(tl.duration())
      setTime(tl.time())
      setPaused(false)
      setLoop(initialLoop)
      return () => ctx.revert()
    }, ref)
    return () => {
      if (tl != null) { tl.clear(true) }
    }
  }, [code, initialLoop])

  useEffect(() => {
    if (!timeline) { return }
    timeline.eventCallback('onUpdate', () => {
      setTime(timeline.time())
      setPaused(!timeline.isActive() || timeline.paused())
    })
    timeline.eventCallback('onComplete', () => {
      timeline.pause(undefined, false)
    })
    return () => {
      timeline.eventCallback('onUpdate', null)
      timeline.eventCallback('onComplete', null)
    }
  }, [timeline])

  return (
    <div className={styles['playback']}>
      <div ref={ref} className={styles['svg']} dangerouslySetInnerHTML={{ __html: code }} />
      {timeline && (
        <PlaybackControls loop={loop} time={time} duration={duration} paused={paused}
          onPlay={() => {
            if (timeline.progress() === 1) { timeline.seek(0, false) }
            timeline.resume(undefined, false)
            setPaused(false)
          }} onPause={() => {
            timeline.pause(undefined, false)
            setPaused(true)
          }} onLoop={(value) => {
            timeline.repeat(value ? -1 : 0)
            setLoop(value)
          }} onReset={() => {
            timeline.pause().seek(0, false)
            setTime(0)
            setPaused(true)
          }} onScrub={(value) => {
            timeline.pause(value, false)
            setTime(value)
          }} />
      )}
    </div>
  )
}
