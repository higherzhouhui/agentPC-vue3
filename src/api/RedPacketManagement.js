import http from '@/utils/request'

// -------------------------- 红包封面 --------------------------
// 分页查询
export function getListCover(data) {
    return http.request({
        method: 'get',
        url:`/redPacket/Cover/page`,
        data
    })
}

// 新增
export function addCover(data) {
    return http.request({
        url: '/redPacket/Cover',
        method: 'post',
        data
    })
}

// 编辑
export function updateCover(data) {
    return http.request({
        url: '/redPacket/Cover',
        method: 'put',
        data
    })
}

// 删除
export function delCover(data) {
    return http.request({
        url: '/redPacket/Cover',
        method: 'delete',
        data
    })
}

// 详情
export function detailCover(data) {
    return http.request({
        url: `/redPacket/Cover/${data.id}`,
        method: 'get'
    })
}


// -------------------------- 红包类别 --------------------------
// 分页查询
export function getListCategory(data) {
    return http.request({
        method: 'get',
        url: '/redPacket/Category/page',
        data
    })
}
// 查询全部
export function getListCategoryQuery(data) {
    return http.request({
        method: 'get',
        url: '/redPacket/Category/query',
        data
    })
}

// 新增
export function addCategory(data) {
    return http.request({
        url: '/redPacket/Category',
        method: 'post',
        data
    })
}

// 编辑
export function updateCategory(data) {
    return http.request({
        url: '/redPacket/Category',
        method: 'put',
        data
    })
}

// 删除
export function delCategory(data) {
    return http.request({
        url: '/redPacket/Category',
        method: 'delete',
        data
    })
}

// 详情
export function detailCategory(data) {
    return http.request({
        url: `/redPacket/Category/${data.id}`,
        method: 'get'
    })
}


// -------------------------- 红包数额 --------------------------
// 分页查询
export function getListLimit(data) {
    return http.request({
        method: 'get',
        url: '/redPacket/Limit/page',
        data
    })
}

// 新增
export function addLimit(data) {
    return http.request({
        url: '/redPacket/Limit',
        method: 'post',
        data
    })
}

// 编辑
export function updateLimit(data) {
    return http.request({
        url: '/redPacket/Limit',
        method: 'put',
        data
    })
}

// 删除
export function delLimit(data) {
    return http.request({
        url: '/redPacket/Limit',
        method: 'delete',
        data
    })
}

// 详情 
export function detailLimit(data) {
    return http.request({
        url: `/redPacket/Limit/${data.id}`,
        method: 'get'
    })
}



// -------------------------- 红包记录 --------------------------


export function getTemplateList(data) {
    return http.request({
        method: 'get',
        url: '/redPacket/Template/page',
        data
    })
}
// 详情
export function detailTemplateLog(data) {
    return http.request({
        url: `/redPacket/Template/${data.id}`,
        method: 'get'
    })
}


// 分页查询
export function getListLog(data) {
    return http.request({
        method: 'get',
        url: '/redPacket/page',
        data
    })
}

// 新增
export function addLog(data) {
    return http.request({
        url: '/redPacket',
        method: 'post',
        data
    })
}

// 编辑
export function updateLog(data) {
    return http.request({
        url: '/redPacket',
        method: 'put',
        data
    })
}

// 删除
export function delLog(data) {
    return http.request({
        url: '/redPacket',
        method: 'delete',
        data
    })
}

