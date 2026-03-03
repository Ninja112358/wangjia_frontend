// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addRoomType POST /api/room_type/add */
export async function addRoomTypeUsingPost(
  body: API.RoomTypeAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>('/api/room_type/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteRoomType POST /api/room_type/delete */
export async function deleteRoomTypeUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/room_type/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listRoomType POST /api/room_type/list */
export async function listRoomTypeUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseListRoomType_>('/api/room_type/list', {
    method: 'POST',
    ...(options || {}),
  })
}

/** listRoomTypeByPage POST /api/room_type/list/page */
export async function listRoomTypeByPageUsingPost(
  body: API.RoomTypeQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageRoomType_>('/api/room_type/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateRoomType POST /api/room_type/update */
export async function updateRoomTypeUsingPost(
  body: API.RoomTypeUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/room_type/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
