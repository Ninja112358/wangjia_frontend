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
