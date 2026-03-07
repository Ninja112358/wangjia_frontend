// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** deduct POST /api/money_info/deduct */
export async function deductUsingPost(
  body: API.MoneyInfoFeeRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/money_info/deduct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listGroupMoneyInfoByOrderId POST /api/money_info/list/group/orderId */
export async function listGroupMoneyInfoByOrderIdUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listGroupMoneyInfoByOrderIdUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListMoneyInfo_>('/api/money_info/list/group/orderId', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** listMoneyInfoByOrderId POST /api/money_info/list/orderId */
export async function listMoneyInfoByOrderIdUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listMoneyInfoByOrderIdUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListMoneyInfo_>('/api/money_info/list/orderId', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** pay POST /api/money_info/pay */
export async function payUsingPost(
  body: API.MoneyInfoFeeRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/money_info/pay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
