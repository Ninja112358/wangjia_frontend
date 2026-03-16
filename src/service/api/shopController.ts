// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addShop POST /api/shop/add */
export async function addShopUsingPost(body: API.ShopAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/shop/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteShop POST /api/shop/delete */
export async function deleteShopUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/shop/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listShop POST /api/shop/list */
export async function listShopUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseListShop_>('/api/shop/list', {
    method: 'POST',
    ...(options || {}),
  })
}

/** listShopByPage POST /api/shop/list/page */
export async function listShopByPageUsingPost(
  body: API.ShopQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageShop_>('/api/shop/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateShop POST /api/shop/update */
export async function updateShopUsingPost(
  body: API.ShopUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/shop/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
