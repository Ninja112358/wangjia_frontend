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

/** contactOrder POST /api/order/contact */
export async function contactOrderUsingPost(
  body: API.OrderContactRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/order/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
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

/** listOrderByPage POST /api/order/list/page */
export async function listOrderByPageUsingPost(
  body: API.OrderQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageOrder_>('/api/order/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
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

/** updateOrder POST /api/order/update */
export async function updateOrderUsingPost(
  body: API.OrderUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/order/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
