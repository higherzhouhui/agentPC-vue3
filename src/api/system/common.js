import http from '@/utils/request'

// 文件上传
export function upload(data) {
  return http.request({
    method: 'post',
    url: '/common/upload',
    data
  })
}