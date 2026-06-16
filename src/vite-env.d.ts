/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_STATE_API_TOKEN: string
  readonly VITE_ROOM_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
