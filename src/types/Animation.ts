export type AnimationType = 'x' | 'y' | 'scale' | 'rotation' | 'opacity'

export interface Animation {
  type: AnimationType
  from: number
  to: number
}
