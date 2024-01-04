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

export async function apiSvgsPolicy(userId: string, uuid: string, nodeId: string): Promise<{ svgUrl: string, zipUrl: string }> {
  return fetchApi('/api/svgs/policy', { userId, uuid, nodeId })
}

export async function apiSvgsCreate(userId: string, uuid: string, nodeId: string, name: string): Promise<{ url: string }> {
  return fetchApi('/api/svgs/create', { userId, uuid, nodeId, name })
}

export async function functionApiEncode(userId: string, svgId: string): Promise<{ url: string }> {
  return fetchFunction('/api/encode', { userId, svgId })
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
