// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** index GET /api/ */
export async function indexUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseString_>('/api/', {
    method: 'GET',
    ...(options || {}),
  })
}

/** health GET /api/health */
export async function healthUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseString_>('/api/health', {
    method: 'GET',
    ...(options || {}),
  })
}
