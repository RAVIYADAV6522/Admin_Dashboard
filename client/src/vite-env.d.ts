/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_TAGLINE?: string;
  readonly VITE_APP_MARK?: string;
  readonly VITE_APP_EYEBROW?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
