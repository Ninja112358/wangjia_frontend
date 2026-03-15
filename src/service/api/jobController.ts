// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** clearAllJobs POST /api/api/quartz/clear-all */
export async function clearAllJobsUsingPost(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/api/quartz/clear-all', {
    method: 'POST',
    ...(options || {}),
  })
}

/** createCronJob POST /api/api/quartz/cron */
export async function createCronJobUsingPost(
  body: API.CreateCronJobRequest,
  options?: { [key: string]: any }
) {
  return request<Record<string, any>>('/api/api/quartz/cron', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteJob DELETE /api/api/quartz/delete/${param0} */
export async function deleteJobUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteJobUsingDELETEParams,
  options?: { [key: string]: any }
) {
  const { jobName: param0, ...queryParams } = params
  return request<Record<string, any>>(`/api/api/quartz/delete/${param0}`, {
    method: 'DELETE',
    params: {
      // groupName has a default value: DEFAULT_GROUP
      groupName: 'DEFAULT_GROUP',
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** getJobDetail GET /api/api/quartz/detail/${param0} */
export async function getJobDetailUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getJobDetailUsingGETParams,
  options?: { [key: string]: any }
) {
  const { jobName: param0, ...queryParams } = params
  return request<Record<string, any>>(`/api/api/quartz/detail/${param0}`, {
    method: 'GET',
    params: {
      // groupName has a default value: DEFAULT_GROUP
      groupName: 'DEFAULT_GROUP',
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** listJobs GET /api/api/quartz/list */
export async function listJobsUsingGet(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/api/quartz/list', {
    method: 'GET',
    ...(options || {}),
  })
}

/** pauseJob POST /api/api/quartz/pause/${param0} */
export async function pauseJobUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pauseJobUsingPOSTParams,
  options?: { [key: string]: any }
) {
  const { jobName: param0, ...queryParams } = params
  return request<Record<string, any>>(`/api/api/quartz/pause/${param0}`, {
    method: 'POST',
    params: {
      // groupName has a default value: DEFAULT_GROUP
      groupName: 'DEFAULT_GROUP',
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** resumeJob POST /api/api/quartz/resume/${param0} */
export async function resumeJobUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.resumeJobUsingPOSTParams,
  options?: { [key: string]: any }
) {
  const { jobName: param0, ...queryParams } = params
  return request<Record<string, any>>(`/api/api/quartz/resume/${param0}`, {
    method: 'POST',
    params: {
      // groupName has a default value: DEFAULT_GROUP
      groupName: 'DEFAULT_GROUP',
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** createSimpleJob POST /api/api/quartz/simple */
export async function createSimpleJobUsingPost(
  body: API.CreateSimpleJobRequest,
  options?: { [key: string]: any }
) {
  return request<Record<string, any>>('/api/api/quartz/simple', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** triggerNow POST /api/api/quartz/trigger/${param0} */
export async function triggerNowUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.triggerNowUsingPOSTParams,
  options?: { [key: string]: any }
) {
  const { jobName: param0, ...queryParams } = params
  return request<Record<string, any>>(`/api/api/quartz/trigger/${param0}`, {
    method: 'POST',
    params: {
      // groupName has a default value: DEFAULT_GROUP
      groupName: 'DEFAULT_GROUP',
      ...queryParams,
    },
    ...(options || {}),
  })
}
