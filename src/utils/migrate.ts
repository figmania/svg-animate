import { migrateV0 } from '../migrations/migrateV0'

export enum Version { V0, V1 }

export const CURRENT_VERSION = Version.V1

export type MigrationFn = () => void

export function runMigrations() {
  migrateV0()
}
