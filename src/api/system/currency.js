import http from '@/utils/request'

// 查询全部币种
export function queryCurrency() {
  return http.request({
    method: 'get',
    url: '/currency/query'
  })
}