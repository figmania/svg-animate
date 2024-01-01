/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIGMANIA_URL: string
  readonly VITE_MIXPANEL_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
