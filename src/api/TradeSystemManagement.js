import http from '@/utils/request'

// -------------------------- 红包封面 --------------------------
// 分页查询
export function getListGlobalSwitch(data) {
    return http.request({
        method: 'get',
        url:`/argument/globalSwitch/page`,
        data
    })
}
// 编辑
export function updateGlobalSwitch(data) {
    return http.request({
        url: '/argument/globalSwitch',
        method: 'put',
        data
    })
}

// 新增
export function addGlobalSwitch(data) {
    return http.request({
        url: '/argument/globalSwitch',
        method: 'post',
        data
    })
}



// 删除
export function delGlobalSwitch(data) {
    return http.request({
        url: '/argument/globalSwitch',
        method: 'delete',
        data
    })
}


