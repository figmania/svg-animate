/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIGMANIA_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
