import http from '@/utils/request'

// 获取当前登录代理余额信息
export function getBalanceInfo(query) {
    return http.request({
        url: '/api/agent-server/agent/withdraw/getBalanceInfo',
        method: 'get',
        data: query
    })
}


// 发送手机号
export function sendSms(data) {
    return http.request({
        url: '/api/agent-server/agent/withdraw/sendSms',
        method: 'post',
        data: data
    })
}

// 确认提款
export function confirm(data) {
    return http.request({
        url: '/api/agent-server/agent/withdraw/confirm',
        method: 'post',
        data: data
    })
}
