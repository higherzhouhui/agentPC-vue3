import http from '@/utils/request'

export function sellparampage(data) {
  return http.request({
    method: 'get',
    url: '/param/sellparam/page',
    data
  })
}

export function currencypage(data) {
  return http.request({
    method: 'get',
    url: '/param/currency/page',
    data
  })
}

export function currencyadd(data) {
  return http.request({
    method: 'post',
    url: '/param/currency',
    data
  })
}

export function currencydelete(data) {
  return http.request({
    method: 'delete',
    url: '/param/currency',
    data
  })
}

export function currencyedit(data) {
  return http.request({
    method: 'put',
    url: '/param/currency',
    data
  })
}

