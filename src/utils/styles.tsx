import styles from '../scss/shared.module.scss'

export function shared(...values: string[]): string {
  return values.map((value) => styles[value]).join(' ')
}
