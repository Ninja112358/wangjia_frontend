// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** checkIn POST /api/order/checkin */
export async function checkInUsingPost(
  body: API.OrderCheckInRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/order/checkin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** checkout POST /api/order/checkout */
export async function checkoutUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkoutUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/order/checkout', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** listOrderGroupData POST /api/order/list/orderGroupData */
export async function listOrderGroupDataUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listOrderGroupDataUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListOrder_>('/api/order/list/orderGroupData', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** changeRoomPrice POST /api/order/room_price/change */
export async function changeRoomPriceUsingPost(
  body: API.OrderChangeRoomPriceRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/order/room_price/change', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** changeRoom POST /api/order/room/change */
export async function changeRoomUsingPost(
  body: API.OrderChangeRoomRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/order/room/change', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
