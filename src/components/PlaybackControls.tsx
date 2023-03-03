import { Button, Scrubber } from '@figmania/ui'
import { FunctionComponent } from 'react'
import styles from './PlaybackControls.module.scss'

export interface PlaybackControlsProps {
  time: number
  duration: number
  paused: boolean
  loop: boolean
  onPlay: () => void
  onPause: () => void
  onLoop: (value: boolean) => void
  onScrub: (value: number) => void
  onReset: () => void
}

export const PlaybackControls: FunctionComponent<PlaybackControlsProps> = ({ time, duration, paused, loop, onPlay, onPause, onScrub, onLoop, onReset }) => {
  return (
    <div className={styles['controls']}>
      <Button size='sm' icon='control-reset' onClick={() => { onReset() }} />
      <Scrubber className={styles['scrubber']} value={time} duration={duration} onChange={(value) => { onScrub(value) }} />
      {paused ? (
        <Button size='sm' icon='control-play' onClick={() => { onPlay() }} />
      ) : (
        <Button size='sm' icon='control-pause' onClick={() => { onPause() }} />
      )}
      <Button size='sm' icon='control-loop' isSelected={loop} onClick={() => { onLoop(!loop) }} />
    </div>
  )
}
