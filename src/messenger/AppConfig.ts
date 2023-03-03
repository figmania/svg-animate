export interface AppConfig {
  theme: 'dark' | 'light'
  tutorial: boolean
}

export const DEFAULT_CONFIG: AppConfig = {
  theme: 'dark',
  tutorial: true
}
