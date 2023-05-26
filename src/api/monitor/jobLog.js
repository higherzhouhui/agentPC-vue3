import http from '@/utils/request'

// 查询调度日志列表
export function listJobLog(query) {
  return http.request({
    url: '/api/agent-job/job/log/list',
    method: 'get',
    data: query
  })
}

// 删除调度日志
export function delJobLog(jobLogId) {
  return http.request({
    url: '/api/agent-job/job/log/' + jobLogId,
    method: 'delete'
  })
}

// 清空调度日志
export function cleanJobLog() {
  return http.request({
    url: '/api/agent-job/job/log/clean',
    method: 'delete'
  })
}
