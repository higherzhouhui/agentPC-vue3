import http from '@/utils/request'

export function sytemlog(data) {
  return http.request({
    method: 'get',
    url: '/sytem/log',
    data
  })
}
