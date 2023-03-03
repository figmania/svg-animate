import { SchemaConfig } from '@figmania/common'
import { AppConfig } from './AppConfig'
import { NodeSelectEvent } from './events/NodeSelectEvent'
import { ToastShowEvent } from './events/ToastShowEvent'
import { ExportRequest, ExportResponse } from './requests/Export'
import { UpdateRequest } from './requests/Update'

export type Schema = SchemaConfig<{
  requests: {
    name: 'setConfig'
    data: [Partial<AppConfig>, void]
  } | {
    name: 'update'
    data: [UpdateRequest, void]
  } | {
    name: 'enableExport'
    data: [void, void]
  } | {
    name: 'export'
    data: [ExportRequest, ExportResponse]
  }
  events: {
    name: 'node:select'
    data: NodeSelectEvent
  } | {
    name: 'config:changed'
    data: AppConfig
  } | {
    name: 'toast:show'
    data: ToastShowEvent
  }
}>
