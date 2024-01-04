import { User } from '../Schema'

export function fetchApi<T>(path: string, payload: object): Promise<T> {
  return fetch(`${import.meta.env.VITE_FIGMANIA_URL}${path}`, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then((response) => {
    return response.json()
  })
}

export function fetchFunction<T>(path: string, payload: object): Promise<T> {
  return fetch(`${import.meta.env.VITE_FUNCTIONS_URL}${path}`, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then((response) => {
    return response.json()
  })
}

export async function fetchUpload(url: string, body: BodyInit, contentType: string): Promise<void> {
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body
  })
  if (response.status !== 200) { throw new Error('Unable to upload file') }
}

export async function apiUsersStatus(userId: string, params?: User): Promise<ApiUserStatus> {
  return fetchApi('/api/users/status', { userId, name: params?.name, image: params?.image })
}

export interface ApiSvgsCreateParams {
  id: string
  name: string
  user: {
    id: string
    name?: string
    image?: string
  }
}

export type ApiSvgsCreateResponse = {
  success: true
  svgUrl: string
  zipUrl: string
  viewUrl: string
} | {
  success: false
  error: 'TrialExpired' | 'Unknown'
  message: string
}

export async function apiSvgsCreate(params: ApiSvgsCreateParams): Promise<ApiSvgsCreateResponse> {
  return fetchApi('/api/svgs/create', params)
}

export interface FunctionApiEncodeParams {
  svgId: string
  userId: string
  framerate: number
  numFrames: number
}

export async function functionApiEncode(params: FunctionApiEncodeParams): Promise<{ url: string }> {
  return fetchFunction('/api/encode', params)
}

export enum PurchaseStatus { UNPAID, TRIAL, PAID }

export interface ApiUserStatus {
  purchaseStatus: PurchaseStatus
}

export interface ApiUser {
  id: string
  email?: string
  image?: string
  name?: string
  paymentStatus: 'PAID' | 'UNPAID' | 'TRIAL'
  dateOfPurchase?: string
  accessToken?: string
  refreshToken?: string
  createdAt: string
  trialEndsAt: string
}
