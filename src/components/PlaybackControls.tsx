import { Timeline } from '@figmania/anim'
import { Button, Scrubber } from '@figmania/ui'
import { FunctionComponent, useEffect, useState } from 'react'
import styles from './PlaybackControls.module.scss'

export interface PlaybackControlsProps {
  timeline: Timeline
}

export const PlaybackControls: FunctionComponent<PlaybackControlsProps> = ({ timeline }) => {
  const [loop, setLoop] = useState(false)
  const [paused, setPaused] = useState(false)
  const [time, setTime] = useState(timeline.time())

  useEffect(() => {
    timeline.eventCallback('onUpdate', () => {
      setTime(timeline.time())
      setPaused(!timeline.isActive() || timeline.paused())
    })
    timeline.eventCallback('onComplete', () => {
      timeline.pause(undefined, false)
    })
  }, [timeline])

  return (
    <div className={styles['controls']}>
      <Button size='sm' icon='control-reset' onClick={() => {
        timeline.pause().seek(0, false)
      }} />
      <Scrubber className={styles['scrubber']} value={time} duration={timeline.duration()} onChange={(value) => {
        timeline.pause(value, false)
      }} />
      <Button size='sm' icon={paused ? 'control-play' : 'control-pause'} onClick={() => {
        if (timeline.isActive()) {
          timeline.pause(undefined, false)
          setPaused(true)
        } else {
          timeline.resume(undefined, false)
        }
      }} />
      <Button size='sm' icon='control-loop' isSelected={loop} onClick={() => {
        setLoop(!loop)
        timeline.repeat(loop ? 0 : -1)
      }} />
    </div>
  )
}
