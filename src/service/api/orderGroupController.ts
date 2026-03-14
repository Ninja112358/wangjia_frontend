// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** listOrderGroup POST /api/orderGroup/list */
export async function listOrderGroupUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseListOrderGroup_>('/api/orderGroup/list', {
    method: 'POST',
    ...(options || {}),
  })
}

/** listOrderGroupSelectInfo POST /api/orderGroup/list/orderGroupSelectInfo/vo */
export async function listOrderGroupSelectInfoUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listOrderGroupSelectInfoUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListOrderGroupSelectInfoVO_>(
    '/api/orderGroup/list/orderGroupSelectInfo/vo',
    {
      method: 'POST',
      params: {
        ...params,
      },
      ...(options || {}),
    }
  )
}
