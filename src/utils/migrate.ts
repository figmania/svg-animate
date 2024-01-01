import { migrateV0 } from '../migrations/migrateV0'

export enum Version { V0, V1 }

export const CURRENT_VERSION = Version.V1

const Migrations: MigrationFn[] = [migrateV0]

export type MigrationFn = (page: PageNode) => void

function getVersion(page: PageNode): Version {
  return +(page.getPluginData('version') ?? '0')
}

function setVersion(page: PageNode, version: Version): void {
  page.setPluginData('version', String(version))
}

export function runMigrations(page: PageNode) {
  let version = getVersion(page)
  while (Migrations[version]) {
    Migrations[version](page)
    version += 1
    setVersion(page, version)
  }
}
