// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** checkFingerPrint GET /api/fingerprint/check */
export async function checkFingerPrintUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkFingerPrintUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/fingerprint/check', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** setFingerPrint GET /api/fingerprint/set */
export async function setFingerPrintUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.setFingerPrintUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/fingerprint/set', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
