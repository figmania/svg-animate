import { NodeDataModel } from '@figmania/common'
import { Version } from '../utils/migrate'

export interface RootData {
  version: Version
}

export const RootModel: NodeDataModel<RootData> = {
  key: 'data',
  defaults: { version: Version.V0 }
}
