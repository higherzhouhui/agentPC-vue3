import http from '@/utils/request'

export function conditionpage(data) {
  return http.request({
    method: 'get',
    url: '/risk/condition/page',
    data
  })
}

export function conditionadd(data) {
  return http.request({
    method: 'post',
    url: '/risk/condition',
    data
  })
}
