import http from '@/utils/request'

// 查询定时任务调度列表
export function listJob(query) {
  return http.request({
    url: '/api/agent-job/job/list',
    method: 'get',
    data: query
  })
}

// 查询定时任务调度详细
export function getJob(jobId) {
  return http.request({
    url: '/api/agent-job/job/' + jobId,
    method: 'get'
  })
}

// 新增定时任务调度
export function addJob(data) {
  return http.request({
    url: '/api/agent-job/job',
    method: 'post',
    data: data
  })
}

// 修改定时任务调度
export function updateJob(data) {
  return http.request({
    url: '/api/agent-job/job',
    method: 'put',
    data: data
  })
}

// 删除定时任务调度
export function delJob(jobId) {
  return http.request({
    url: '/api/agent-job/job/' + jobId,
    method: 'delete'
  })
}

// 任务状态修改
export function changeJobStatus(jobId, status) {
  const data = {
    jobId,
    status
  }
  return http.request({
    url: '/api/agent-job/job/changeStatus',
    method: 'put',
    data: data
  })
}


// 定时任务立即执行一次
export function runJob(jobId, jobGroup) {
  const data = {
    jobId,
    jobGroup
  }
  return http.request({
    url: '/api/agent-job/job/run',
    method: 'put',
    data: data
  })
}