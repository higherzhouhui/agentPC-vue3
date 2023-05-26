import http from '@/utils/request'

export function sytemlog(data) {
  return http.request({
    method: 'get',
    url: '/sytem/log',
    data
  })
}

export function systemuser(data) {
  return http.request({
    method: 'get',
    url: '/system/user',
    data
  })
}

export function systemrole(data) {
  return http.request({
    method: 'get',
    url: '/system/role',
    data
  })
}

export function systemdeptlist(data) {
  return http.request({
    method: 'get',
    url: '/system/dept/list',
    data
  })
}

export function systemuseredit(data) {
  return http.request({
    method: 'put',
    url: '/system/user',
    data
  })
}

export function systemuseradd(data) {
  return http.request({
    method: 'post',
    url: '/system/user',
    data
  })
}

export function systemuserdelete(data) {
  return http.request({
    method: 'delete',
    url: '/system/user',
    data
  })
}

export function systemmenu(data) {
  return http.request({
    method: 'get',
    url: '/system/menu',
    data
  })
}
