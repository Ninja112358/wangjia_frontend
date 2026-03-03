// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addRoom POST /api/room/add */
export async function addRoomUsingPost(body: API.RoomAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/room/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteRoom POST /api/room/delete */
export async function deleteRoomUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/room/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listRoom POST /api/room/list */
export async function listRoomUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseListRoom_>('/api/room/list', {
    method: 'POST',
    ...(options || {}),
  })
}

/** listRoomByPage POST /api/room/list/page */
export async function listRoomByPageUsingPost(
  body: API.RoomQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageRoom_>('/api/room/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** setRoomState POST /api/room/set/state */
export async function setRoomStateUsingPost(
  body: API.RoomSetStateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/room/set/state', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateRoom POST /api/room/update */
export async function updateRoomUsingPost(
  body: API.RoomUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/room/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
